from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    group_name = serializers.CharField(source='group.name', read_only=True)
    media_url = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'group', 'group_name', 'author', 'author_username', 'text', 'media', 'media_url', 'created_at', 'updated_at']
        read_only_fields = ['id', 'author', 'author_username', 'group_name', 'created_at', 'updated_at', 'media_url']

    def get_media_url(self, obj):
        if obj.media:
            return obj.media.url
        return None 