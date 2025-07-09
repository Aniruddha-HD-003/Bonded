#!/usr/bin/env python3
"""
Test script for the new engagement games (Spot the Difference, Guess Who, Word Cloud, Reaction Race)
"""

import requests
import json
from datetime import datetime, timedelta

# Configuration
BASE_URL = "http://localhost:8000/api"
GROUP_NAME = f"New Games Test {datetime.now().strftime('%Y%m%d_%H%M%S')}"

def test_new_games():
    print("🎮 Testing New Engagement Games")
    print("=" * 50)
    
    # Step 1: Register a group
    print("\n1. Registering group...")
    register_data = {
        "group_name": GROUP_NAME,
        "num_people": 3
    }
    
    try:
        response = requests.post(f"{BASE_URL}/users/register-group/", json=register_data)
        if response.status_code == 201:
            print("✅ Group registered successfully")
            group_data = response.json()
            group_name = group_data['group']
            first_credential = group_data['credentials'][0]
            username = first_credential['username']
            password = first_credential['password']
            print(f"Using credentials: {username} / {password}")
        else:
            print(f"❌ Failed to register group: {response.status_code}")
            print(response.text)
            return
    except Exception as e:
        print(f"❌ Error registering group: {e}")
        return
    
    # Step 2: Change credentials
    print("\n2. Changing credentials...")
    change_data = {
        "group": group_name,
        "username": username,
        "new_username": "testuser",
        "new_password": "testpass123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/users/change-credentials/", json=change_data)
        if response.status_code == 200:
            print("✅ Credentials changed successfully")
            username = "testuser"
            password = "testpass123"
        else:
            print(f"❌ Failed to change credentials: {response.status_code}")
            print(response.text)
            return
    except Exception as e:
        print(f"❌ Error changing credentials: {e}")
        return
    
    # Step 3: Login
    print("\n3. Logging in...")
    login_data = {
        "group": group_name,
        "username": username,
        "password": password
    }
    
    try:
        response = requests.post(f"{BASE_URL}/users/group-login/", json=login_data)
        if response.status_code == 200:
            print("✅ Login successful")
            login_data = response.json()
            access_token = login_data['access']
            headers = {'Authorization': f'Bearer {access_token}'}
            memberships = login_data['memberships']
            group_id = memberships[0]['group_id']
            print(f"Group ID: {group_id}")
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(response.text)
            return
    except Exception as e:
        print(f"❌ Error logging in: {e}")
        return
    
    # Step 4: Test Spot the Difference
    print("\n4. Testing Spot the Difference...")
    
    # Create a spot the difference game
    spot_diff_data = {
        "group": group_id,
        "title": "Test Spot the Difference",
        "description": "Find the differences between two images",
        "original_image": "https://example.com/original.jpg",
        "modified_image": "https://example.com/modified.jpg",
        "differences": [
            {"x": 100, "y": 150, "radius": 20},
            {"x": 300, "y": 200, "radius": 15}
        ],
        "time_limit": 60
    }
    
    try:
        response = requests.post(f"{BASE_URL}/games/spot-difference/", json=spot_diff_data, headers=headers)
        if response.status_code == 201:
            print("✅ Spot the Difference game created successfully")
            spot_diff_game = response.json()
            spot_diff_id = spot_diff_game['id']
        else:
            print(f"❌ Failed to create Spot the Difference game: {response.status_code}")
            print(response.text)
            return
    except Exception as e:
        print(f"❌ Error creating Spot the Difference game: {e}")
        return
    
    # Get spot the difference games
    try:
        response = requests.get(f"{BASE_URL}/games/spot-difference/?group={group_id}", headers=headers)
        if response.status_code == 200:
            games = response.json()
            print(f"✅ Retrieved {len(games)} Spot the Difference games")
        else:
            print(f"❌ Failed to get Spot the Difference games: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Error getting Spot the Difference games: {e}")
    
    # Step 5: Test Guess Who
    print("\n5. Testing Guess Who...")
    
    # Create a guess who game
    guess_who_data = {
        "group": group_id,
        "title": "Test Guess Who",
        "description": "Guess who this person is based on clues",
        "photo_url": "https://example.com/mystery_photo.jpg",
        "correct_user": login_data['user_id'],
        "hint": "This person loves pizza and has a pet dog",
        "time_limit": 120
    }
    
    try:
        response = requests.post(f"{BASE_URL}/games/guess-who/", json=guess_who_data, headers=headers)
        if response.status_code == 201:
            print("✅ Guess Who game created successfully")
            guess_who_game = response.json()
            guess_who_id = guess_who_game['id']
        else:
            print(f"❌ Failed to create Guess Who game: {response.status_code}")
            print(response.text)
            return
    except Exception as e:
        print(f"❌ Error creating Guess Who game: {e}")
        return
    
    # Get guess who games
    try:
        response = requests.get(f"{BASE_URL}/games/guess-who/?group={group_id}", headers=headers)
        if response.status_code == 200:
            games = response.json()
            print(f"✅ Retrieved {len(games)} Guess Who games")
        else:
            print(f"❌ Failed to get Guess Who games: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Error getting Guess Who games: {e}")
    
    # Step 6: Test Word Cloud
    print("\n6. Testing Word Cloud...")
    
    # Get word cloud data
    try:
        response = requests.get(f"{BASE_URL}/games/word-cloud/{group_id}/?period=daily", headers=headers)
        if response.status_code == 200:
            word_cloud = response.json()
            print("✅ Word Cloud data retrieved successfully")
            print(f"   - Total words: {len(word_cloud.get('words', []))}")
            print(f"   - Period: {word_cloud.get('period', 'unknown')}")
        else:
            print(f"❌ Failed to get Word Cloud data: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Error getting Word Cloud data: {e}")
    
    # Step 7: Test Reaction Race (List only)
    print("\n7. Testing Reaction Race...")
    
    # Get reaction race games
    try:
        response = requests.get(f"{BASE_URL}/games/reaction-race/?group={group_id}", headers=headers)
        if response.status_code == 200:
            games = response.json()
            print(f"✅ Retrieved {len(games)} Reaction Race games")
        else:
            print(f"❌ Failed to get Reaction Race games: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Error getting Reaction Race games: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 New Engagement Games Testing Complete!")
    print("=" * 50)

if __name__ == "__main__":
    test_new_games() 