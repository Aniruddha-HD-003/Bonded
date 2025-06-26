from django.urls import path
from .views import ReactionListCreateView

urlpatterns = [
    path('post/<int:post_id>/', ReactionListCreateView.as_view(), name='reaction-list-create'),
] 