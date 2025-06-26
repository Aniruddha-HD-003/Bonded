from rest_framework import serializers
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    post_id = serializers.IntegerField(source='post.id', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'user_username', 'post', 'post_id', 'text', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'user_username', 'post', 'post_id', 'created_at', 'updated_at'] 