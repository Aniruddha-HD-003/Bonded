from rest_framework import serializers
from .models import Post
from users.models import GroupMembership
import os

class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.SerializerMethodField()
    group_name = serializers.CharField(source='group.name', read_only=True)
    media_url = serializers.SerializerMethodField()
    media_type = serializers.CharField(read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'group', 'group_name', 'author', 'author_username', 'text', 'media', 'media_url', 'media_type', 'created_at', 'updated_at']
        read_only_fields = ['id', 'author', 'author_username', 'group_name', 'created_at', 'updated_at', 'media_url', 'media_type']

    def get_author_username(self, obj):
        try:
            membership = GroupMembership.objects.get(user=obj.author, group=obj.group)
            return membership.username
        except GroupMembership.DoesNotExist:
            return obj.author.username  # fallback to User model username

    def get_media_url(self, obj):
        if obj.media:
            # Return the full Cloudinary URL
            return obj.media.url
        return None
    
    def validate_media(self, value):
        if value:
            # Check file size (max 50MB for videos, 10MB for images)
            max_size = 50 * 1024 * 1024  # 50MB
            if value.size > max_size:
                raise serializers.ValidationError("File size must be under 50MB.")
            
            # Check file extension
            allowed_extensions = {
                'image': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
                'video': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm']
            }
            
            file_extension = os.path.splitext(value.name)[1].lower()
            
            # Determine media type based on file extension
            if file_extension in allowed_extensions['image']:
                self.context['media_type'] = 'image'
            elif file_extension in allowed_extensions['video']:
                self.context['media_type'] = 'video'
            else:
                raise serializers.ValidationError("Unsupported file type. Please upload an image or video.")
        
        return value
    
    def create(self, validated_data):
        # Set media type based on validation
        if 'media' in validated_data and validated_data['media']:
            validated_data['media_type'] = self.context.get('media_type', 'text')
        else:
            validated_data['media_type'] = 'text'
        
        return super().create(validated_data) 