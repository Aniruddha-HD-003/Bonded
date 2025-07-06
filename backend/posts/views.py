from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Post
from .serializers import PostSerializer
from users.models import Group, GroupMembership

# Create your views here.

class PostListCreateView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        group_id = self.request.query_params.get('group')
        if not group_id:
            return Post.objects.none()
        try:
            group = Group.objects.get(id=group_id)
        except Group.DoesNotExist:
            return Post.objects.none()
        # Check membership
        if not GroupMembership.objects.filter(user=user, group=group).exists():
            return Post.objects.none()
        return Post.objects.filter(group=group).order_by('-created_at')

    def perform_create(self, serializer):
        user = self.request.user
        group_id = self.request.data.get('group')
        if not group_id:
            raise serializers.ValidationError({'group': 'This field is required.'})
        try:
            group = Group.objects.get(id=group_id)
        except Group.DoesNotExist:
            raise serializers.ValidationError({'group': 'Invalid group.'})
        if not GroupMembership.objects.filter(user=user, group=group).exists():
            raise serializers.ValidationError({'group': 'You are not a member of this group.'})
        serializer.save(author=user, group=group)

class PostDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Post.objects.all()

    def get_queryset(self):
        user = self.request.user
        # Users can only access posts from groups they're members of
        user_groups = GroupMembership.objects.filter(user=user).values_list('group', flat=True)
        return Post.objects.filter(group__in=user_groups)

    def destroy(self, request, *args, **kwargs):
        post = self.get_object()
        user = request.user
        
        # Check if user is the author of the post
        if post.author != user:
            return Response(
                {'error': 'You can only delete your own posts.'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Delete the post (this will cascade delete related comments, reactions, etc.)
        post.delete()
        return Response(
            {'message': 'Post deleted successfully.'}, 
            status=status.HTTP_204_NO_CONTENT
        )
