from django.shortcuts import render
from rest_framework import generics, permissions
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
