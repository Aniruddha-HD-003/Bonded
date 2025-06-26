import requests
import time

BASE_URL = "http://127.0.0.1:8000/api/users/"
POSTS_URL = "http://127.0.0.1:8000/api/posts/"
REACTIONS_URL = "http://127.0.0.1:8000/api/reactions/post/"

def get_jwt_token_and_post():
    group_name = f"reactiontestgroup_{int(time.time() * 1000)}"
    username = f"{group_name}_user"
    password = "reactiontestpass123"
    reg_resp = requests.post(BASE_URL + "register-group/", json={"group_name": group_name, "num_people": 1})
    creds = reg_resp.json()["credentials"][0]
    requests.post(BASE_URL + "change-credentials/", json={"username": creds["username"], "new_username": username, "new_password": password})
    login_resp = requests.post(BASE_URL + "login/", json={"username": username, "password": password})
    token = login_resp.json()["access"]
    headers = {"Authorization": f"Bearer {token}"}
    post_resp = requests.post(POSTS_URL, data={"text": "Reaction test post."}, headers=headers)
    post_id = post_resp.json()["id"]
    return token, username, post_id

def test_add_reaction():
    token, username, post_id = get_jwt_token_and_post()
    headers = {"Authorization": f"Bearer {token}"}
    data = {"type": "like"}
    resp = requests.post(f"{REACTIONS_URL}{post_id}/", data=data, headers=headers)
    assert resp.status_code == 201
    reaction = resp.json()
    assert reaction["type"] == "like"
    assert reaction["user_username"] == username
    assert reaction["post_id"] == post_id

def test_unique_reaction_per_user():
    token, username, post_id = get_jwt_token_and_post()
    headers = {"Authorization": f"Bearer {token}"}
    # Add a like reaction
    requests.post(f"{REACTIONS_URL}{post_id}/", data={"type": "like"}, headers=headers)
    # Add a love reaction (should replace the like)
    resp = requests.post(f"{REACTIONS_URL}{post_id}/", data={"type": "love"}, headers=headers)
    assert resp.status_code == 201
    # List reactions for the post
    list_resp = requests.get(f"{REACTIONS_URL}{post_id}/", headers=headers)
    assert list_resp.status_code == 200
    reactions = list_resp.json()
    assert len(reactions) == 1
    assert reactions[0]["type"] == "love"
    assert reactions[0]["user_username"] == username 