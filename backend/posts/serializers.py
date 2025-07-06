from rest_framework import serializers
from .models import Post
from users.models import GroupMembership

class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.SerializerMethodField()
    group_name = serializers.CharField(source='group.name', read_only=True)
    media_url = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'group', 'group_name', 'author', 'author_username', 'text', 'media', 'media_url', 'created_at', 'updated_at']
        read_only_fields = ['id', 'author', 'author_username', 'group_name', 'created_at', 'updated_at', 'media_url']

    def get_author_username(self, obj):
        try:
            membership = GroupMembership.objects.get(user=obj.author, group=obj.group)
            return membership.username
        except GroupMembership.DoesNotExist:
            return obj.author.username  # fallback to User model username

    def get_media_url(self, obj):
        if obj.media:
            return obj.media.url
        return None 