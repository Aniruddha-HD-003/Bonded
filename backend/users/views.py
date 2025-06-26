from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User, Group, GroupMembership
from .serializers import GroupRegistrationSerializer, CredentialChangeSerializer, GroupLoginSerializer
from django.utils.crypto import get_random_string
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes

# Create your views here.

class GroupRegistrationView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = GroupRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            group_name = serializer.validated_data['group_name']
            num_people = serializer.validated_data['num_people']
            if Group.objects.filter(name=group_name).exists():
                return Response({'error': 'Group name already exists.'}, status=status.HTTP_400_BAD_REQUEST)
            group = Group.objects.create(name=group_name)
            credentials = []
            for i in range(1, num_people + 1):
                per_group_username = f"{group_name.lower()}_user{i}"
                # Ensure per-group username is unique within the group
                while GroupMembership.objects.filter(group=group, username=per_group_username).exists():
                    per_group_username = f"{group_name.lower()}_user{i}_{get_random_string(4)}"
                temp_password = get_random_string(10)
                # Create a new User for each membership (or you could reuse existing users by email, etc.)
                user = User.objects.create_user(
                    username=f"{group_name.lower()}_user{i}_{get_random_string(6)}",  # generic unique username for User model
                    password=temp_password,
                    must_change_credentials=True
                )
                GroupMembership.objects.create(
                    group=group,
                    user=user,
                    username=per_group_username,
                    role='member'
                )
                credentials.append({'username': per_group_username, 'password': temp_password})
            return Response({'group': group_name, 'credentials': credentials}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CredentialChangeView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = CredentialChangeSerializer(data=request.data)
        if serializer.is_valid():
            group_name = serializer.validated_data['group']
            username = serializer.validated_data['username']
            new_username = serializer.validated_data['new_username']
            new_password = serializer.validated_data['new_password']
            try:
                group = Group.objects.get(name=group_name)
            except Group.DoesNotExist:
                return Response({'error': 'Group does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
            try:
                membership = GroupMembership.objects.get(group=group, username=username)
            except GroupMembership.DoesNotExist:
                return Response({'error': 'Invalid username for this group.'}, status=status.HTTP_400_BAD_REQUEST)
            user = membership.user
            if not user.must_change_credentials:
                return Response({'error': 'Credentials already set.'}, status=status.HTTP_400_BAD_REQUEST)
            if GroupMembership.objects.filter(group=group, username=new_username).exclude(pk=membership.pk).exists():
                return Response({'error': 'New username already taken in this group.'}, status=status.HTTP_400_BAD_REQUEST)
            membership.username = new_username
            membership.save()
            user.set_password(new_password)
            user.must_change_credentials = False
            user.save()
            return Response({'success': 'Credentials updated. Please log in with your new credentials.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        if self.user.must_change_credentials:
            raise serializers.ValidationError({'must_change_credentials': 'You must change your username and password before logging in.'})
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class GroupLoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = GroupLoginSerializer(data=request.data)
        if serializer.is_valid():
            group_name = serializer.validated_data['group']
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            try:
                group = Group.objects.get(name=group_name)
            except Group.DoesNotExist:
                return Response({'error': 'Group does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
            try:
                membership = GroupMembership.objects.get(group=group, username=username)
            except GroupMembership.DoesNotExist:
                return Response({'error': 'Invalid username for this group.'}, status=status.HTTP_400_BAD_REQUEST)
            user = membership.user
            if not user.check_password(password):
                return Response({'error': 'Invalid password.'}, status=status.HTTP_400_BAD_REQUEST)
            if user.must_change_credentials:
                return Response({'must_change_credentials': 'You must change your username and password before logging in.'}, status=status.HTTP_400_BAD_REQUEST)
            refresh = RefreshToken.for_user(user)
            memberships = GroupMembership.objects.filter(user=user)
            memberships_data = [
                {
                    'group_id': m.group.id,
                    'group_name': m.group.name,
                    'username': m.username,
                    'role': m.role,
                }
                for m in memberships
            ]
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_id': user.id,
                'memberships': memberships_data,
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def group_members(request, group_id):
    from .models import Group, GroupMembership
    try:
        group = Group.objects.get(id=group_id)
    except Group.DoesNotExist:
        return Response({'error': 'Group does not exist.'}, status=status.HTTP_404_NOT_FOUND)
    memberships = GroupMembership.objects.filter(group=group)
    members = [
        {
            'user_id': m.user.id,
            'username': m.username,
            'role': m.role,
        }
        for m in memberships
    ]
    return Response({'members': members})

