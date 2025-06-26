from rest_framework import serializers
from .models import User, Group, GroupMembership

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name', 'created_at']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'group', 'must_change_credentials']
        read_only_fields = ['id', 'username', 'group', 'must_change_credentials']

class GroupRegistrationSerializer(serializers.Serializer):
    group_name = serializers.CharField(max_length=100)
    num_people = serializers.IntegerField(min_value=1, max_value=50)

class CredentialChangeSerializer(serializers.Serializer):
    group = serializers.CharField(max_length=100)
    username = serializers.CharField(max_length=150)
    new_username = serializers.CharField(max_length=150)
    new_password = serializers.CharField(min_length=8, max_length=128)

class GroupLoginSerializer(serializers.Serializer):
    group = serializers.CharField(max_length=100)
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128) 