from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Reaction
from .serializers import ReactionSerializer

# Create your views here.

class ReactionListCreateView(generics.ListCreateAPIView):
    serializer_class = ReactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        post_id = self.kwargs.get('post_id')
        return Reaction.objects.filter(post_id=post_id)

    def perform_create(self, serializer):
        post_id = self.kwargs.get('post_id')
        user = self.request.user
        # Remove existing reaction by this user for this post (enforce one reaction per user per post)
        Reaction.objects.filter(user=user, post_id=post_id).delete()
        serializer.save(user=user, post_id=post_id)
