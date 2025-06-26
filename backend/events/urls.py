from django.urls import path
from .views import EventListCreateView, RSVPListCreateView, TaskListCreateView

urlpatterns = [
    path('', EventListCreateView.as_view(), name='event-list-create'),
    path('<int:event_id>/rsvps/', RSVPListCreateView.as_view(), name='rsvp-list-create'),
    path('<int:event_id>/tasks/', TaskListCreateView.as_view(), name='task-list-create'),
] 