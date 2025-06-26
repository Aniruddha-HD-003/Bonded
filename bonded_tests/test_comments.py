import requests
import time

BASE_URL = "http://127.0.0.1:8000/api/users/"
POSTS_URL = "http://127.0.0.1:8000/api/posts/"
COMMENTS_URL = "http://127.0.0.1:8000/api/comments/post/"

def get_jwt_token_and_post():
    group_name = f"commenttestgroup_{int(time.time() * 1000)}"
    username = f"{group_name}_user"
    password = "commenttestpass123"
    reg_resp = requests.post(BASE_URL + "register-group/", json={"group_name": group_name, "num_people": 1})
    creds = reg_resp.json()["credentials"][0]
    requests.post(BASE_URL + "change-credentials/", json={"username": creds["username"], "new_username": username, "new_password": password})
    login_resp = requests.post(BASE_URL + "login/", json={"username": username, "password": password})
    token = login_resp.json()["access"]
    headers = {"Authorization": f"Bearer {token}"}
    post_resp = requests.post(POSTS_URL, data={"text": "Comment test post."}, headers=headers)
    post_id = post_resp.json()["id"]
    return token, username, post_id

def test_create_comment():
    token, username, post_id = get_jwt_token_and_post()
    headers = {"Authorization": f"Bearer {token}"}
    data = {"text": "This is a test comment."}
    resp = requests.post(f"{COMMENTS_URL}{post_id}/", data=data, headers=headers)
    assert resp.status_code == 201
    comment = resp.json()
    assert comment["text"] == "This is a test comment."
    assert comment["user_username"] == username
    assert comment["post_id"] == post_id

def test_list_comments():
    token, username, post_id = get_jwt_token_and_post()
    headers = {"Authorization": f"Bearer {token}"}
    # Create a comment to ensure at least one exists
    requests.post(f"{COMMENTS_URL}{post_id}/", data={"text": "List test comment."}, headers=headers)
    resp = requests.get(f"{COMMENTS_URL}{post_id}/", headers=headers)
    assert resp.status_code == 200
    comments = resp.json()
    assert isinstance(comments, list)
    assert any(c["user_username"] == username for c in comments) 