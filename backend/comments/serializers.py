from rest_framework import serializers
from .models import Comment
from users.models import GroupMembership

class CommentSerializer(serializers.ModelSerializer):
    user_username = serializers.SerializerMethodField()
    post_id = serializers.IntegerField(source='post.id', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'user_username', 'post', 'post_id', 'text', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'user_username', 'post', 'post_id', 'created_at', 'updated_at']

    def get_user_username(self, obj):
        try:
            membership = GroupMembership.objects.get(user=obj.user, group=obj.post.group)
            return membership.username
        except GroupMembership.DoesNotExist:
            return obj.user.username  # fallback to User model username 