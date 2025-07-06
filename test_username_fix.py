#!/usr/bin/env python3
"""
Test script to verify the username fix for comments, posts, and reactions.
This script will create a test group, user, post, and comment to verify that
the correct GroupMembership username is displayed instead of the User model username.
"""

import requests
import time
import json

BASE_URL = "http://127.0.0.1:8000/api"

def test_username_fix():
    print("🧪 Testing Username Fix for Comments, Posts, and Reactions")
    print("=" * 60)
    
    # Step 1: Create a test group
    print("1️⃣ Creating test group...")
    group_name = f"testgroup_{int(time.time())}"
    group_data = {"group_name": group_name, "num_people": 1}
    
    try:
        group_response = requests.post(f"{BASE_URL}/users/register-group/", json=group_data)
        if group_response.status_code != 201:
            print(f"❌ Failed to create group: {group_response.status_code}")
            return False
        
        credentials = group_response.json()["credentials"][0]
        print(f"✅ Group created: {group_name}")
        print(f"   Initial credentials: {credentials}")
        
        # Step 2: Change credentials to a custom username
        print("\n2️⃣ Changing credentials...")
        new_username = f"{group_name}_customuser"
        new_password = "testpass123"
        
        cred_change_data = {
            "group": group_name,
            "username": credentials["username"],
            "new_username": new_username,
            "new_password": new_password
        }
        
        cred_response = requests.post(f"{BASE_URL}/users/change-credentials/", json=cred_change_data)
        if cred_response.status_code != 200:
            print(f"❌ Failed to change credentials: {cred_response.status_code}")
            return False
        
        print(f"✅ Credentials changed to: {new_username}")
        
        # Step 3: Login
        print("\n3️⃣ Logging in...")
        login_data = {
            "group": group_name,
            "username": new_username,
            "password": new_password
        }
        
        login_response = requests.post(f"{BASE_URL}/users/group-login/", json=login_data)
        if login_response.status_code != 200:
            print(f"❌ Failed to login: {login_response.status_code}")
            return False
        
        token = login_response.json()["access"]
        group_id = login_response.json()["memberships"][0]["group_id"]
        headers = {"Authorization": f"Bearer {token}"}
        
        print(f"✅ Login successful")
        print(f"   Group ID: {group_id}")
        print(f"   Token received: {'Yes' if token else 'No'}")
        
        # Step 4: Create a post
        print("\n4️⃣ Creating a test post...")
        post_data = {"text": "This is a test post for username verification", "group": group_id}
        
        post_response = requests.post(f"{BASE_URL}/posts/", data=post_data, headers=headers)
        if post_response.status_code != 201:
            print(f"❌ Failed to create post: {post_response.status_code}")
            return False
        
        post = post_response.json()
        post_id = post["id"]
        print(f"✅ Post created with ID: {post_id}")
        print(f"   Post author username: {post.get('author_username', 'NOT_FOUND')}")
        
        # Verify the username is correct
        if post.get('author_username') != new_username:
            print(f"❌ Post author username mismatch!")
            print(f"   Expected: {new_username}")
            print(f"   Got: {post.get('author_username')}")
            return False
        else:
            print(f"✅ Post author username is correct: {new_username}")
        
        # Step 5: Create a comment
        print("\n5️⃣ Creating a test comment...")
        comment_data = {"text": "This is a test comment for username verification"}
        
        comment_response = requests.post(f"{BASE_URL}/comments/post/{post_id}/", data=comment_data, headers=headers)
        if comment_response.status_code != 201:
            print(f"❌ Failed to create comment: {comment_response.status_code}")
            return False
        
        comment = comment_response.json()
        print(f"✅ Comment created with ID: {comment['id']}")
        print(f"   Comment user username: {comment.get('user_username', 'NOT_FOUND')}")
        
        # Verify the username is correct
        if comment.get('user_username') != new_username:
            print(f"❌ Comment user username mismatch!")
            print(f"   Expected: {new_username}")
            print(f"   Got: {comment.get('user_username')}")
            return False
        else:
            print(f"✅ Comment user username is correct: {new_username}")
        
        # Step 6: Create a reaction
        print("\n6️⃣ Creating a test reaction...")
        reaction_data = {"type": "like"}
        
        reaction_response = requests.post(f"{BASE_URL}/reactions/post/{post_id}/", data=reaction_data, headers=headers)
        if reaction_response.status_code != 201:
            print(f"❌ Failed to create reaction: {reaction_response.status_code}")
            return False
        
        reaction = reaction_response.json()
        print(f"✅ Reaction created with ID: {reaction['id']}")
        print(f"   Reaction user username: {reaction.get('user_username', 'NOT_FOUND')}")
        
        # Verify the username is correct
        if reaction.get('user_username') != new_username:
            print(f"❌ Reaction user username mismatch!")
            print(f"   Expected: {new_username}")
            print(f"   Got: {reaction.get('user_username')}")
            return False
        else:
            print(f"✅ Reaction user username is correct: {new_username}")
        
        # Step 7: Fetch posts and verify usernames
        print("\n7️⃣ Fetching posts to verify usernames...")
        posts_response = requests.get(f"{BASE_URL}/posts/?group={group_id}", headers=headers)
        if posts_response.status_code != 200:
            print(f"❌ Failed to fetch posts: {posts_response.status_code}")
            return False
        
        posts = posts_response.json()
        if len(posts) == 0:
            print("❌ No posts found")
            return False
        
        post = posts[0]
        print(f"✅ Fetched post with author: {post.get('author_username', 'NOT_FOUND')}")
        
        if post.get('author_username') != new_username:
            print(f"❌ Fetched post author username mismatch!")
            print(f"   Expected: {new_username}")
            print(f"   Got: {post.get('author_username')}")
            return False
        
        # Step 8: Fetch comments and verify usernames
        print("\n8️⃣ Fetching comments to verify usernames...")
        comments_response = requests.get(f"{BASE_URL}/comments/post/{post_id}/", headers=headers)
        if comments_response.status_code != 200:
            print(f"❌ Failed to fetch comments: {comments_response.status_code}")
            return False
        
        comments = comments_response.json()
        if len(comments) == 0:
            print("❌ No comments found")
            return False
        
        comment = comments[0]
        print(f"✅ Fetched comment with user: {comment.get('user_username', 'NOT_FOUND')}")
        
        if comment.get('user_username') != new_username:
            print(f"❌ Fetched comment user username mismatch!")
            print(f"   Expected: {new_username}")
            print(f"   Got: {comment.get('user_username')}")
            return False
        
        # Step 9: Fetch reactions and verify usernames
        print("\n9️⃣ Fetching reactions to verify usernames...")
        reactions_response = requests.get(f"{BASE_URL}/reactions/post/{post_id}/", headers=headers)
        if reactions_response.status_code != 200:
            print(f"❌ Failed to fetch reactions: {reactions_response.status_code}")
            return False
        
        reactions = reactions_response.json()
        if len(reactions) == 0:
            print("❌ No reactions found")
            return False
        
        reaction = reactions[0]
        print(f"✅ Fetched reaction with user: {reaction.get('user_username', 'NOT_FOUND')}")
        
        if reaction.get('user_username') != new_username:
            print(f"❌ Fetched reaction user username mismatch!")
            print(f"   Expected: {new_username}")
            print(f"   Got: {reaction.get('user_username')}")
            return False
        
        print("\n" + "=" * 60)
        print("🎉 ALL TESTS PASSED! Username fix is working correctly.")
        print("✅ Posts show correct GroupMembership username")
        print("✅ Comments show correct GroupMembership username") 
        print("✅ Reactions show correct GroupMembership username")
        print("=" * 60)
        
        return True
        
    except requests.exceptions.ConnectionError:
        print("❌ Connection error. Make sure the Django server is running on http://127.0.0.1:8000")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    success = test_username_fix()
    exit(0 if success else 1) 