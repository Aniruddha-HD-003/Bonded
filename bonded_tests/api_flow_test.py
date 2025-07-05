import requests
import time

BASE_URL = "http://localhost:8000/api"

# Store IDs and tokens for cleanup
state = {
    "group_id": None,
    "group_name": None,
    "usernames": [],
    "passwords": [],
    "new_username": "john_doe",
    "new_password": "password123",
    "access_token": None,
    "post_id": None,
    "event_id": None,
    "comment_id": None,
    "reaction_id": None,
    "user_ids": [],
}

def print_result(step, resp):
    print(f"\n=== {step} ===")
    print(f"Status: {resp.status_code}")
    try:
        print(resp.json())
    except Exception:
        print(resp.text)

def register_group():
    url = f"{BASE_URL}/users/register-group/"
    data = {"group_name": "Test Group API", "num_people": 2}
    resp = requests.post(url, json=data)
    print_result("Register Group", resp)
    if resp.status_code == 201:
        state["group_name"] = data["group_name"]
        creds = resp.json()["credentials"]
        for c in creds:
            state["usernames"].append(c["username"])
            state["passwords"].append(c["password"])
    return resp

def register_group_duplicate():
    url = f"{BASE_URL}/users/register-group/"
    data = {"group_name": state["group_name"], "num_people": 2}
    resp = requests.post(url, json=data)
    print_result("Register Duplicate Group", resp)
    return resp

def login_first_time():
    url = f"{BASE_URL}/users/group-login/"
    data = {"group": state["group_name"], "username": state["usernames"][0], "password": state["passwords"][0]}
    resp = requests.post(url, json=data)
    print_result("First Login (should require credential change)", resp)
    return resp

def change_credentials():
    url = f"{BASE_URL}/users/change-credentials/"
    data = {
        "group": state["group_name"],
        "username": state["usernames"][0],
        "new_username": state["new_username"],
        "new_password": state["new_password"]
    }
    resp = requests.post(url, json=data)
    print_result("Change Credentials", resp)
    return resp

def login_with_new_credentials():
    url = f"{BASE_URL}/users/group-login/"
    data = {"group": state["group_name"], "username": state["new_username"], "password": state["new_password"]}
    resp = requests.post(url, json=data)
    print_result("Login with New Credentials", resp)
    if resp.status_code == 200:
        state["access_token"] = resp.json()["access"]
        state["group_id"] = resp.json()["memberships"][0]["group_id"]
        state["user_ids"].append(resp.json()["user_id"])
    return resp

def get_group_members():
    url = f"{BASE_URL}/users/groups/{state['group_id']}/members/"
    headers = {"Authorization": f"Bearer {state['access_token']}"}
    resp = requests.get(url, headers=headers)
    print_result("Get Group Members", resp)
    if resp.status_code == 200:
        for m in resp.json()["members"]:
            state["user_ids"].append(m["user_id"])
    return resp

def create_post():
    url = f"{BASE_URL}/posts/"
    headers = {"Authorization": f"Bearer {state['access_token']}"}
    data = {"text": "Hello from API test!", "group": state["group_id"]}
    resp = requests.post(url, json=data, headers=headers)
    print_result("Create Post", resp)
    if resp.status_code == 201:
        state["post_id"] = resp.json()["id"]
    return resp

def get_posts():
    url = f"{BASE_URL}/posts/?group={state['group_id']}"
    headers = {"Authorization": f"Bearer {state['access_token']}"}
    resp = requests.get(url, headers=headers)
    print_result("Get Posts", resp)
    return resp

def create_event():
    url = f"{BASE_URL}/events/"
    headers = {"Authorization": f"Bearer {state['access_token']}"}
    data = {"title": "API Test Event", "type": "trip", "start_time": "2025-07-12T10:00:00Z", "group": state["group_id"]}
    resp = requests.post(url, json=data, headers=headers)
    print_result("Create Event", resp)
    if resp.status_code == 201:
        state["event_id"] = resp.json()["id"]
    return resp

def get_events():
    url = f"{BASE_URL}/events/?group={state['group_id']}"
    headers = {"Authorization": f"Bearer {state['access_token']}"}
    resp = requests.get(url, headers=headers)
    print_result("Get Events", resp)
    return resp

def add_comment():
    url = f"{BASE_URL}/comments/post/{state['post_id']}/"
    headers = {"Authorization": f"Bearer {state['access_token']}"}
    data = {"text": "This is a test comment."}
    resp = requests.post(url, json=data, headers=headers)
    print_result("Add Comment", resp)
    if resp.status_code == 201:
        state["comment_id"] = resp.json()["id"]
    return resp

def get_comments():
    url = f"{BASE_URL}/comments/post/{state['post_id']}/"
    headers = {"Authorization": f"Bearer {state['access_token']}"}
    resp = requests.get(url, headers=headers)
    print_result("Get Comments", resp)
    return resp

def add_reaction(reaction_type="like"):
    url = f"{BASE_URL}/reactions/post/{state['post_id']}/"
    headers = {"Authorization": f"Bearer {state['access_token']}"}
    data = {"type": reaction_type}
    resp = requests.post(url, json=data, headers=headers)
    print_result(f"Add Reaction ({reaction_type})", resp)
    if resp.status_code == 201:
        state["reaction_id"] = resp.json()["id"]
    return resp

def get_reactions():
    url = f"{BASE_URL}/reactions/post/{state['post_id']}/"
    headers = {"Authorization": f"Bearer {state['access_token']}"}
    resp = requests.get(url, headers=headers)
    print_result("Get Reactions", resp)
    return resp

def delete_reaction():
    url = f"{BASE_URL}/reactions/post/{state['post_id']}/"
    headers = {"Authorization": f"Bearer {state['access_token']}"}
    resp = requests.delete(url, headers=headers)
    print_result("Delete Reaction", resp)
    return resp

def cleanup():
    print("\n=== Cleanup: Deleting all created objects ===")
    import subprocess
    import os
    
    # Run Django management command to clean up test data
    try:
        # Change to backend directory
        backend_dir = os.path.join(os.path.dirname(__file__), '..', 'backend')
        result = subprocess.run(
            ['python', 'manage.py', 'cleanup_test_data', '--group-name', state['group_name']],
            cwd=backend_dir,
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            print("✅ Cleanup successful!")
            print(result.stdout)
        else:
            print("❌ Cleanup failed!")
            print(result.stderr)
            
    except Exception as e:
        print(f"❌ Error during cleanup: {e}")
        print("Manual cleanup required. Run: python manage.py cleanup_test_data --group-name 'Test Group API'")

def main():
    register_group()
    register_group_duplicate()
    login_first_time()
    change_credentials()
    login_with_new_credentials()
    get_group_members()
    create_post()
    get_posts()
    create_event()
    get_events()
    add_comment()
    get_comments()
    add_reaction("like")
    get_reactions()
    add_reaction("love")
    get_reactions()
    delete_reaction()
    get_reactions()
    cleanup()

if __name__ == "__main__":
    main() 