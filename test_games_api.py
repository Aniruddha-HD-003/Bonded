#!/usr/bin/env python3
"""
Test script for the Games API endpoints
"""

import requests
import json
from datetime import datetime, timedelta

# Configuration
BASE_URL = "http://localhost:8000/api"
GROUP_NAME = "Test Group API"
USERNAME = "testuser"
PASSWORD = "testpass123"

def test_games_api():
    print("🧪 Testing Games API Endpoints")
    print("=" * 50)
    
    # Step 1: Register a group
    print("\n1. Registering group...")
    register_data = {
        "group_name": GROUP_NAME,
        "num_people": 5
    }
    
    try:
        response = requests.post(f"{BASE_URL}/users/register-group/", json=register_data)
        if response.status_code == 201:
            print("✅ Group registered successfully")
            group_data = response.json()
            # Handle different response formats
            if 'group' in group_data:
                group_id = group_data['group']['id']
            elif 'id' in group_data:
                group_id = group_data['id']
            else:
                print("❌ Unexpected response format")
                print(group_data)
                return
        else:
            print(f"❌ Failed to register group: {response.status_code}")
            print(response.text)
            return
    except Exception as e:
        print(f"❌ Error registering group: {e}")
        return
    
    # Step 2: Login
    print("\n2. Logging in...")
    login_data = {
        "group_name": GROUP_NAME,
        "username": USERNAME,
        "password": PASSWORD
    }
    
    try:
        response = requests.post(f"{BASE_URL}/users/group-login/", json=login_data)
        if response.status_code == 200:
            print("✅ Login successful")
            login_data = response.json()
            access_token = login_data['access']
            headers = {'Authorization': f'Bearer {access_token}'}
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(response.text)
            return
    except Exception as e:
        print(f"❌ Error logging in: {e}")
        return
    
    # Step 3: Test Challenges API
    print("\n3. Testing Challenges API...")
    
    # Create a challenge
    challenge_data = {
        "group": group_id,
        "title": "Test Daily Challenge",
        "description": "This is a test challenge for the API",
        "challenge_type": "daily",
        "category": "post",
        "target_count": 3,
        "points_reward": 15,
        "start_date": datetime.now().isoformat(),
        "end_date": (datetime.now() + timedelta(days=1)).isoformat()
    }
    
    try:
        response = requests.post(f"{BASE_URL}/games/challenges/", json=challenge_data, headers=headers)
        if response.status_code == 201:
            print("✅ Challenge created successfully")
            challenge = response.json()
            challenge_id = challenge['id']
        else:
            print(f"❌ Failed to create challenge: {response.status_code}")
            print(response.text)
            return
    except Exception as e:
        print(f"❌ Error creating challenge: {e}")
        return
    
    # Get challenges
    try:
        response = requests.get(f"{BASE_URL}/games/challenges/?group={group_id}", headers=headers)
        if response.status_code == 200:
            challenges = response.json()
            print(f"✅ Retrieved {len(challenges)} challenges")
        else:
            print(f"❌ Failed to get challenges: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Error getting challenges: {e}")
    
    # Step 4: Test Streaks API
    print("\n4. Testing Streaks API...")
    
    # Update streak
    streak_data = {
        "group": group_id,
        "streak_type": "post"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/games/streaks/update/", json=streak_data, headers=headers)
        if response.status_code == 200:
            print("✅ Streak updated successfully")
        else:
            print(f"❌ Failed to update streak: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Error updating streak: {e}")
    
    # Get streaks
    try:
        response = requests.get(f"{BASE_URL}/games/streaks/?group={group_id}", headers=headers)
        if response.status_code == 200:
            streaks = response.json()
            print(f"✅ Retrieved {len(streaks)} streaks")
        else:
            print(f"❌ Failed to get streaks: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Error getting streaks: {e}")
    
    # Step 5: Test Leaderboard API
    print("\n5. Testing Leaderboard API...")
    
    # Calculate leaderboard
    leaderboard_data = {
        "group": group_id,
        "period": "all_time"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/games/leaderboards/calculate/", json=leaderboard_data, headers=headers)
        if response.status_code == 200:
            print("✅ Leaderboard calculated successfully")
        else:
            print(f"❌ Failed to calculate leaderboard: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Error calculating leaderboard: {e}")
    
    # Get leaderboard entries
    try:
        response = requests.get(f"{BASE_URL}/games/leaderboard-entries/?group={group_id}", headers=headers)
        if response.status_code == 200:
            entries = response.json()
            print(f"✅ Retrieved {len(entries)} leaderboard entries")
        else:
            print(f"❌ Failed to get leaderboard entries: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Error getting leaderboard entries: {e}")
    
    # Step 6: Test User Stats API
    print("\n6. Testing User Stats API...")
    
    try:
        response = requests.get(f"{BASE_URL}/games/user-stats/?group={group_id}", headers=headers)
        if response.status_code == 200:
            stats = response.json()
            print("✅ User stats retrieved successfully")
            print(f"   - Username: {stats['user_username']}")
            print(f"   - Total Points: {stats['total_points']}")
            print(f"   - Total Posts: {stats['total_posts']}")
            print(f"   - Current Streaks: {stats['current_streaks']}")
        else:
            print(f"❌ Failed to get user stats: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Error getting user stats: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Games API Testing Complete!")
    print("=" * 50)

if __name__ == "__main__":
    test_games_api() 