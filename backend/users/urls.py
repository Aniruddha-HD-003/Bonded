from django.urls import path
from .views import GroupRegistrationView, CredentialChangeView, CustomTokenObtainPairView, GroupLoginView, group_members

urlpatterns = [
    path('register-group/', GroupRegistrationView.as_view(), name='register-group'),
    path('change-credentials/', CredentialChangeView.as_view(), name='change-credentials'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('group-login/', GroupLoginView.as_view(), name='group_login'),
    path('groups/<int:group_id>/members/', group_members, name='group-members'),
] 