from django.test import TestCase
from django.urls import reverse
from .models import User, Group, GroupMembership
from django.contrib.auth.hashers import make_password
from django.db import IntegrityError

# Create your tests here.

class CredentialChangeTest(TestCase):
    def setUp(self):
        self.group = Group.objects.create(name='testgroup')
        self.user = User.objects.create_user(username='testgroup_user1', password='temp12345', must_change_credentials=True)
        self.membership = GroupMembership.objects.create(group=self.group, user=self.user, username='testgroup_user1')

    def test_credential_change_success(self):
        url = reverse('change-credentials')
        data = {
            'group': 'testgroup',
            'username': 'testgroup_user1',
            'new_username': 'newuser1',
            'new_password': 'newpassword123'
        }
        response = self.client.post(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.membership.refresh_from_db()
        self.assertEqual(self.membership.username, 'newuser1')
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('newpassword123'))
        self.assertFalse(self.user.must_change_credentials)

    def test_credential_change_duplicate_username(self):
        user2 = User.objects.create_user(username='existinguser', password='temp12345', must_change_credentials=False)
        GroupMembership.objects.create(group=self.group, user=user2, username='existinguser')
        url = reverse('change-credentials')
        data = {
            'group': 'testgroup',
            'username': 'testgroup_user1',
            'new_username': 'existinguser',
            'new_password': 'newpassword123'
        }
        response = self.client.post(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('New username already taken in this group.', response.json().get('error', ''))

class GroupRegistrationTest(TestCase):
    def test_same_username_in_different_groups(self):
        url = reverse('register-group')
        # Register group1 with 1 user
        data1 = {'group_name': 'group1', 'num_people': 1}
        response1 = self.client.post(url, data1, content_type='application/json')
        self.assertEqual(response1.status_code, 201)
        username1 = response1.json()['credentials'][0]['username']
        # Register group2 with 1 user, same username pattern should be allowed
        data2 = {'group_name': 'group2', 'num_people': 1}
        response2 = self.client.post(url, data2, content_type='application/json')
        self.assertEqual(response2.status_code, 201)
        username2 = response2.json()['credentials'][0]['username']
        self.assertTrue(username1.endswith('_user1'))
        self.assertTrue(username2.endswith('_user1'))

    def test_duplicate_username_in_same_group(self):
        group = Group.objects.create(name='group3')
        user1 = User.objects.create_user(username='group3_user1', password='pass')
        user2 = User.objects.create_user(username='group3_user2', password='pass')
        # First membership is fine
        GroupMembership.objects.create(group=group, user=user1, username='group3_user1')
        # Second membership with same username should fail
        with self.assertRaises(IntegrityError):
            GroupMembership.objects.create(group=group, user=user2, username='group3_user1')

class GroupLoginTest(TestCase):
    def setUp(self):
        self.group = Group.objects.create(name='logingroup')
        self.user = User.objects.create(username='baseuser', password=make_password('testpass'), must_change_credentials=False)
        self.membership = GroupMembership.objects.create(group=self.group, user=self.user, username='member1', role='member')

    def test_login_success(self):
        url = reverse('group_login')
        data = {'group': 'logingroup', 'username': 'member1', 'password': 'testpass'}
        response = self.client.post(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.json())

    def test_login_wrong_group(self):
        url = reverse('group_login')
        data = {'group': 'wronggroup', 'username': 'member1', 'password': 'testpass'}
        response = self.client.post(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('Group does not exist.', str(response.content))

    def test_login_wrong_username(self):
        url = reverse('group_login')
        data = {'group': 'logingroup', 'username': 'wronguser', 'password': 'testpass'}
        response = self.client.post(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('Invalid username for this group.', str(response.content))

    def test_login_wrong_password(self):
        url = reverse('group_login')
        data = {'group': 'logingroup', 'username': 'member1', 'password': 'wrongpass'}
        response = self.client.post(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('Invalid password.', str(response.content))

class GroupCredentialChangeTest(TestCase):
    def setUp(self):
        self.group = Group.objects.create(name='credgroup')
        self.user = User.objects.create(username='creduser', password=make_password('oldpass'), must_change_credentials=True)
        self.membership = GroupMembership.objects.create(group=self.group, user=self.user, username='oldname', role='member')
        self.user2 = User.objects.create(username='otheruser', password=make_password('pass'), must_change_credentials=False)
        self.membership2 = GroupMembership.objects.create(group=self.group, user=self.user2, username='takenname', role='member')

    def test_credential_change_success(self):
        url = reverse('change-credentials')
        data = {
            'group': 'credgroup',
            'username': 'oldname',
            'new_username': 'newname',
            'new_password': 'newpass123'
        }
        response = self.client.post(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.membership.refresh_from_db()
        self.assertEqual(self.membership.username, 'newname')
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('newpass123'))
        self.assertFalse(self.user.must_change_credentials)

    def test_credential_change_duplicate_username(self):
        url = reverse('change-credentials')
        data = {
            'group': 'credgroup',
            'username': 'oldname',
            'new_username': 'takenname',
            'new_password': 'newpass123'
        }
        response = self.client.post(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('New username already taken in this group.', str(response.content))
