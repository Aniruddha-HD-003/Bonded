from rest_framework import serializers
from .models import Event, RSVP, Task
from users.models import GroupMembership

class TaskSerializer(serializers.ModelSerializer):
    assigned_to_username = serializers.SerializerMethodField()
    
    class Meta:
        model = Task
        fields = ['id', 'event', 'title', 'assigned_to', 'assigned_to_username', 'is_completed', 'due_date', 'created_at']
        read_only_fields = ['id', 'event', 'assigned_to_username', 'created_at']

    def get_assigned_to_username(self, obj):
        try:
            membership = GroupMembership.objects.get(user=obj.assigned_to, group=obj.event.group)
            return membership.username
        except GroupMembership.DoesNotExist:
            return obj.assigned_to.username  # fallback to User model username

class RSVPSerializer(serializers.ModelSerializer):
    user_username = serializers.SerializerMethodField()
    
    class Meta:
        model = RSVP
        fields = ['id', 'event', 'user', 'user_username', 'status', 'responded_at']
        read_only_fields = ['id', 'event', 'user', 'user_username', 'responded_at']

    def get_user_username(self, obj):
        try:
            membership = GroupMembership.objects.get(user=obj.user, group=obj.event.group)
            return membership.username
        except GroupMembership.DoesNotExist:
            return obj.user.username  # fallback to User model username

class EventSerializer(serializers.ModelSerializer):
    creator_username = serializers.SerializerMethodField()
    group_name = serializers.CharField(source='group.name', read_only=True)
    rsvps = RSVPSerializer(many=True, read_only=True)
    tasks = TaskSerializer(many=True, read_only=True)
    
    class Meta:
        model = Event
        fields = ['id', 'group', 'group_name', 'creator', 'creator_username', 'title', 'description', 'type', 'start_time', 'end_time', 'created_at', 'updated_at', 'rsvps', 'tasks']
        read_only_fields = ['id', 'group', 'group_name', 'creator', 'creator_username', 'created_at', 'updated_at', 'rsvps', 'tasks']

    def get_creator_username(self, obj):
        try:
            membership = GroupMembership.objects.get(user=obj.creator, group=obj.group)
            return membership.username
        except GroupMembership.DoesNotExist:
            return obj.creator.username  # fallback to User model username 