from rest_framework import serializers
from .models import Reaction

class ReactionSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    post_id = serializers.IntegerField(source='post.id', read_only=True)

    class Meta:
        model = Reaction
        fields = ['id', 'user', 'user_username', 'post', 'post_id', 'type', 'emoji', 'created_at']
        read_only_fields = ['id', 'user', 'user_username', 'post', 'post_id', 'created_at'] 