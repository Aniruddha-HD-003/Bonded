from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Event, RSVP, Task
from .serializers import EventSerializer, RSVPSerializer, TaskSerializer

# Create your views here.

class EventListCreateView(generics.ListCreateAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        group_id = self.request.query_params.get('group')
        if group_id:
            return Event.objects.filter(group_id=group_id).order_by('-start_time')
        return Event.objects.none()

    def perform_create(self, serializer):
        group_id = self.request.data.get('group')
        serializer.save(creator=self.request.user, group_id=group_id)

class RSVPListCreateView(generics.ListCreateAPIView):
    serializer_class = RSVPSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        event_id = self.kwargs.get('event_id')
        return RSVP.objects.filter(event_id=event_id)

    def perform_create(self, serializer):
        event_id = self.kwargs.get('event_id')
        serializer.save(user=self.request.user, event_id=event_id)

class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        event_id = self.kwargs.get('event_id')
        return Task.objects.filter(event_id=event_id)

    def perform_create(self, serializer):
        event_id = self.kwargs.get('event_id')
        serializer.save(event_id=event_id)
