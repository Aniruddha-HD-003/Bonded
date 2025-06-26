import requests
import time

BASE_URL = "http://127.0.0.1:8000/api/users/"
POSTS_URL = "http://127.0.0.1:8000/api/posts/"

def get_jwt_token(group_name=None, username=None, password=None):
    if group_name is None:
        group_name = f"posttestgroup_{int(time.time() * 1000)}"
    if username is None:
        username = f"{group_name}_user"
    if password is None:
        password = "posttestpass123"
    reg_resp = requests.post(BASE_URL + "register-group/", json={"group_name": group_name, "num_people": 1})
    if "credentials" not in reg_resp.json():
        print("Registration failed:", reg_resp.status_code, reg_resp.text)
        assert False, "Registration failed"
    creds = reg_resp.json()["credentials"][0]
    change_resp = requests.post(BASE_URL + "change-credentials/", json={"username": creds["username"], "new_username": username, "new_password": password})
    if change_resp.status_code != 200:
        print("Credential change failed:", change_resp.status_code, change_resp.text)
        assert False, "Credential change failed"
    login_resp = requests.post(BASE_URL + "login/", json={"username": username, "password": password})
    if "access" not in login_resp.json():
        print("Login failed:", login_resp.status_code, login_resp.text)
        assert False, "Login failed"
    return login_resp.json()["access"], username

def test_create_post():
    token, username = get_jwt_token()
    headers = {"Authorization": f"Bearer {token}"}
    data = {"text": "This is a test post."}
    resp = requests.post(POSTS_URL, data=data, headers=headers)
    if resp.status_code != 201:
        print("Post creation failed:", resp.status_code, resp.text)
    assert resp.status_code == 201
    post = resp.json()
    assert post["text"] == "This is a test post."
    assert post["author_username"] == username

def test_list_posts():
    token, username = get_jwt_token()
    headers = {"Authorization": f"Bearer {token}"}
    # Create a post to ensure at least one exists
    requests.post(POSTS_URL, data={"text": "List test post."}, headers=headers)
    resp = requests.get(POSTS_URL, headers=headers)
    if resp.status_code != 200:
        print("Post list failed:", resp.status_code, resp.text)
    assert resp.status_code == 200
    posts = resp.json()
    assert isinstance(posts, list)
    assert any(p["author_username"] == username for p in posts) 