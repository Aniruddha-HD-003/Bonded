from rest_framework import serializers
from .models import Event, RSVP, Task

class TaskSerializer(serializers.ModelSerializer):
    assigned_to_username = serializers.CharField(source='assigned_to.username', read_only=True)
    class Meta:
        model = Task
        fields = ['id', 'event', 'title', 'assigned_to', 'assigned_to_username', 'is_completed', 'due_date', 'created_at']
        read_only_fields = ['id', 'event', 'assigned_to_username', 'created_at']

class RSVPSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = RSVP
        fields = ['id', 'event', 'user', 'user_username', 'status', 'responded_at']
        read_only_fields = ['id', 'event', 'user', 'user_username', 'responded_at']

class EventSerializer(serializers.ModelSerializer):
    creator_username = serializers.CharField(source='creator.username', read_only=True)
    group_name = serializers.CharField(source='group.name', read_only=True)
    rsvps = RSVPSerializer(many=True, read_only=True)
    tasks = TaskSerializer(many=True, read_only=True)
    class Meta:
        model = Event
        fields = ['id', 'group', 'group_name', 'creator', 'creator_username', 'title', 'description', 'type', 'start_time', 'end_time', 'created_at', 'updated_at', 'rsvps', 'tasks']
        read_only_fields = ['id', 'group', 'group_name', 'creator', 'creator_username', 'created_at', 'updated_at', 'rsvps', 'tasks'] 