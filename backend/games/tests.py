from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse
from users.models import User, Group, GroupMembership
from .models import SpotTheDifference, SpotTheDifferenceAttempt

# Create your tests here.

class SpotTheDifferenceAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Create group and user
        self.group = Group.objects.create(name="Test Group")
        self.user = User.objects.create_user(username="testuser", password="testpass123")
        GroupMembership.objects.create(user=self.user, group=self.group, username="testuser")
        self.client.force_authenticate(user=self.user)

    def test_create_and_attempt_spot_the_difference(self):
        # Create a Spot the Difference game
        url = reverse('spot-difference-list-create')
        data = {
            "group": self.group.id,
            "original_image": "https://example.com/original.jpg",
            "modified_image": "https://example.com/modified.jpg",
            "title": "Find 5 differences!",
            "description": "Spot all the differences in the image.",
            "difficulty": "easy",
            "differences_count": 5,
            "time_limit": 60,
            "points_reward": 10
        }
        resp = self.client.post(url, data, format='json')
        self.assertEqual(resp.status_code, 201)
        game_id = resp.data["id"]

        # Attempt the game
        attempt_url = reverse('spot-difference-attempt', kwargs={"game_id": game_id})
        attempt_data = {"differences_found": 5, "time_taken": 45}
        resp2 = self.client.post(attempt_url, attempt_data, format='json')
        self.assertEqual(resp2.status_code, 200)
        self.assertTrue(resp2.data["is_completed"])
        self.assertEqual(resp2.data["points_earned"], 10)
        self.assertEqual(resp2.data["attempt"]["differences_found"], 5)

class GuessWhoAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.group = Group.objects.create(name="Guess Group")
        self.user = User.objects.create_user(username="guessuser", password="testpass123")
        self.target_user = User.objects.create_user(username="targetuser", password="testpass123")
        GroupMembership.objects.create(user=self.user, group=self.group, username="guessuser")
        GroupMembership.objects.create(user=self.target_user, group=self.group, username="targetuser")
        self.client.force_authenticate(user=self.user)

    def test_create_and_attempt_guess_who(self):
        url = reverse('guess-who-list-create')
        data = {
            "group": self.group.id,
            "title": "Who is this?",
            "description": "Guess the member!",
            "photo_url": "https://example.com/photo.jpg",
            "correct_user": self.target_user.id,
            "hint": "He likes coding!",
            "points_reward": 15,
            "time_limit": 120
        }
        resp = self.client.post(url, data, format='json')
        self.assertEqual(resp.status_code, 201)
        game_id = resp.data["id"]

        # Attempt the game
        attempt_url = reverse('guess-who-attempt', kwargs={"game_id": game_id})
        attempt_data = {"guessed_user_id": self.target_user.id, "time_taken": 30}
        resp2 = self.client.post(attempt_url, attempt_data, format='json')
        self.assertEqual(resp2.status_code, 200)
        self.assertTrue(resp2.data["is_correct"])
        self.assertEqual(resp2.data["points_earned"], 15)
        self.assertEqual(resp2.data["attempt"]["guessed_user"], self.target_user.id)

class WordCloudAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.group = Group.objects.create(name="Cloud Group")
        self.user = User.objects.create_user(username="clouduser", password="testpass123")
        GroupMembership.objects.create(user=self.user, group=self.group, username="clouduser")
        self.client.force_authenticate(user=self.user)
        # Create some posts
        from posts.models import Post
        Post.objects.create(group=self.group, author=self.user, text="Hello world cloud test!")
        Post.objects.create(group=self.group, author=self.user, text="Hello again world!")

    def test_generate_word_cloud(self):
        url = reverse('generate-word-cloud', kwargs={"group_id": self.group.id})
        resp = self.client.get(url + "?period=daily")
        if resp.status_code != 200:
            print("Word Cloud API error:", resp.status_code, resp.content)
        self.assertEqual(resp.status_code, 200)
        self.assertIn("word_data", resp.data)
        self.assertTrue("hello" in resp.data["word_data"])  # 'hello' should be counted

class ReactionRaceAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.group = Group.objects.create(name="Race Group")
        self.user = User.objects.create_user(username="raceuser", password="testpass123")
        self.user2 = User.objects.create_user(username="raceuser2", password="testpass123")
        GroupMembership.objects.create(user=self.user, group=self.group, username="raceuser")
        GroupMembership.objects.create(user=self.user2, group=self.group, username="raceuser2")
        self.client.force_authenticate(user=self.user)
        # Create a post
        from posts.models import Post
        self.post = Post.objects.create(group=self.group, author=self.user, text="Race post!")

    def test_create_and_join_reaction_race(self):
        url = reverse('reaction-race-list-create')
        data = {
            "group": self.group.id,
            "post": self.post.id,
            "title": "First to react!",
            "description": "Be the fastest!",
            "target_reaction_type": "like",
            "time_limit": 60,
            "points_reward": 8
        }
        resp = self.client.post(url, data, format='json')
        self.assertEqual(resp.status_code, 201)
        race_id = resp.data["id"]

        # Join the race as user1
        join_url = reverse('join-reaction-race', kwargs={"race_id": race_id})
        join_data = {"reaction_time": 10}
        resp2 = self.client.post(join_url, join_data, format='json')
        self.assertEqual(resp2.status_code, 200)
        self.assertEqual(resp2.data["position"], 1)
        self.assertEqual(resp2.data["points_earned"], 8)

        # Join the race as user2
        self.client.force_authenticate(user=self.user2)
        resp3 = self.client.post(join_url, join_data, format='json')
        self.assertEqual(resp3.status_code, 200)
        self.assertEqual(resp3.data["position"], 2)
        self.assertTrue(resp3.data["points_earned"] < 8)
