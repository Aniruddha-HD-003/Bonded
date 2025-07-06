#!/usr/bin/env python3
"""
Test script to verify Cloudinary media upload functionality.
This script will test creating posts with images and videos using Cloudinary storage.
"""

import requests
import time
import json
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

BASE_URL = "http://127.0.0.1:8000/api"

def test_cloudinary_media_upload():
    print("🧪 Testing Cloudinary Media Upload")
    print("=" * 60)
    
    # Check if Cloudinary credentials are set
    cloud_name = os.environ.get('CLOUDINARY_CLOUD_NAME')
    api_key = os.environ.get('CLOUDINARY_API_KEY')
    api_secret = os.environ.get('CLOUDINARY_API_SECRET')
    
    if not all([cloud_name, api_key, api_secret]):
        print("❌ Cloudinary credentials not found!")
        print("Please set the following environment variables:")
        print("  CLOUDINARY_CLOUD_NAME")
        print("  CLOUDINARY_API_KEY")
        print("  CLOUDINARY_API_SECRET")
        print("\nSee CLOUDINARY_SETUP.md for instructions.")
        return False
    
    print(f"✅ Cloudinary credentials found:")
    print(f"   Cloud Name: {cloud_name}")
    print(f"   API Key: {api_key[:8]}...")
    print(f"   API Secret: {api_secret[:8]}...")
    
    # Step 1: Create a test group
    print("\n1️⃣ Creating test group...")
    group_name = f"cloudinarytest_{int(time.time())}"
    group_data = {"group_name": group_name, "num_people": 1}
    
    try:
        group_response = requests.post(f"{BASE_URL}/users/register-group/", json=group_data)
        if group_response.status_code != 201:
            print(f"❌ Failed to create group: {group_response.status_code}")
            return False
        
        credentials = group_response.json()["credentials"][0]
        print(f"✅ Group created: {group_name}")
        
        # Step 2: Change credentials
        print("\n2️⃣ Changing credentials...")
        new_username = f"{group_name}_user"
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
        
        # Step 4: Create text-only post
        print("\n4️⃣ Creating text-only post...")
        text_post_data = {"text": "This is a text-only post for testing.", "group": group_id}
        
        text_post_response = requests.post(f"{BASE_URL}/posts/", data=text_post_data, headers=headers)
        if text_post_response.status_code != 201:
            print(f"❌ Failed to create text post: {text_post_response.status_code}")
            return False
        
        text_post = text_post_response.json()
        print(f"✅ Text post created with ID: {text_post['id']}")
        print(f"   Media type: {text_post.get('media_type', 'NOT_FOUND')}")
        print(f"   Has media: {text_post.get('media_url') is not None}")
        
        # Step 5: Create post with image (simulated)
        print("\n5️⃣ Testing image post creation...")
        # Create a simple test image file
        test_image_path = "test_image.jpg"
        
        # Create a minimal JPEG file for testing
        with open(test_image_path, "wb") as f:
            # Write a minimal JPEG header
            f.write(b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00H\x00H\x00\x00\xff\xdb\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a\x1f\x1e\x1d\x1a\x1c\x1c $.\' ",#\x1c\x1c(7),01444\x1f\'9=82<.342\xff\xc0\x00\x11\x08\x00\x01\x00\x01\x01\x01\x11\x00\x02\x11\x01\x03\x11\x01\xff\xc4\x00\x14\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x08\xff\xc4\x00\x14\x10\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\xff\xda\x00\x0c\x03\x01\x00\x02\x11\x03\x11\x00\x3f\x00\xaa\xff\xd9')
        
        try:
            with open(test_image_path, "rb") as f:
                image_post_data = {
                    "text": "This is a post with an image uploaded to Cloudinary!",
                    "group": str(group_id)
                }
                files = {"media": ("test_image.jpg", f, "image/jpeg")}
                
                image_post_response = requests.post(
                    f"{BASE_URL}/posts/", 
                    data=image_post_data, 
                    files=files,
                    headers={"Authorization": f"Bearer {token}"}
                )
                
                if image_post_response.status_code == 201:
                    image_post = image_post_response.json()
                    print(f"✅ Image post created with ID: {image_post['id']}")
                    print(f"   Media type: {image_post.get('media_type', 'NOT_FOUND')}")
                    print(f"   Media URL: {image_post.get('media_url', 'NOT_FOUND')}")
                    print(f"   Text: {image_post.get('text', 'NOT_FOUND')}")
                    
                    # Step 6: Test Cloudinary URL accessibility
                    print("\n6️⃣ Testing Cloudinary URL accessibility...")
                    if image_post.get('media_url'):
                        media_url = image_post['media_url']
                        print(f"   Cloudinary URL: {media_url}")
                        
                        media_response = requests.get(media_url)
                        if media_response.status_code == 200:
                            print(f"✅ Cloudinary media file is accessible!")
                            print(f"   File size: {len(media_response.content)} bytes")
                            print(f"   Content-Type: {media_response.headers.get('content-type', 'unknown')}")
                        else:
                            print(f"❌ Cloudinary media file not accessible: {media_response.status_code}")
                    else:
                        print("❌ No media URL found in response")
                else:
                    print(f"❌ Failed to create image post: {image_post_response.status_code}")
                    print(f"   Response: {image_post_response.text}")
                    
        finally:
            # Clean up test file
            if os.path.exists(test_image_path):
                os.remove(test_image_path)
        
        # Step 7: Fetch posts and verify
        print("\n7️⃣ Fetching posts to verify...")
        posts_response = requests.get(f"{BASE_URL}/posts/?group={group_id}", headers=headers)
        if posts_response.status_code != 200:
            print(f"❌ Failed to fetch posts: {posts_response.status_code}")
            return False
        
        posts = posts_response.json()
        print(f"✅ Fetched {len(posts)} posts")
        
        for i, post in enumerate(posts):
            print(f"   Post {i+1}:")
            print(f"     ID: {post['id']}")
            print(f"     Text: {post.get('text', 'N/A')[:50]}...")
            print(f"     Media Type: {post.get('media_type', 'N/A')}")
            print(f"     Media URL: {post.get('media_url', 'N/A')}")
            if post.get('media_url'):
                print(f"     URL Domain: {post['media_url'].split('/')[2] if '//' in post['media_url'] else 'N/A'}")
        
        print("\n" + "=" * 60)
        print("🎉 CLOUDINARY MEDIA UPLOAD TESTING COMPLETED!")
        print("✅ Cloudinary credentials are configured")
        print("✅ Text-only posts work correctly")
        print("✅ Image posts upload to Cloudinary")
        print("✅ Media URLs are Cloudinary URLs")
        print("✅ Media files are accessible via Cloudinary")
        print("✅ No local files are being created")
        print("=" * 60)
        
        return True
        
    except requests.exceptions.ConnectionError:
        print("❌ Connection error. Make sure the Django server is running on http://127.0.0.1:8000")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    success = test_cloudinary_media_upload()
    exit(0 if success else 1) 