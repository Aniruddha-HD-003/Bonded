import requests
import time
from datetime import datetime, timedelta

BASE_URL = "http://127.0.0.1:8000/api/users/"
EVENTS_URL = "http://127.0.0.1:8000/api/events/"

def get_jwt_token():
    group_name = f"eventtestgroup_{int(time.time() * 1000)}"
    username = f"{group_name}_user"
    password = "eventtestpass123"
    reg_resp = requests.post(BASE_URL + "register-group/", json={"group_name": group_name, "num_people": 1})
    creds = reg_resp.json()["credentials"][0]
    requests.post(BASE_URL + "change-credentials/", json={"username": creds["username"], "new_username": username, "new_password": password})
    login_resp = requests.post(BASE_URL + "login/", json={"username": username, "password": password})
    token = login_resp.json()["access"]
    return token, username

def test_create_event():
    token, username = get_jwt_token()
    headers = {"Authorization": f"Bearer {token}"}
    now = datetime.now()
    data = {
        "title": "Test Event",
        "description": "This is a test event.",
        "type": "trip",
        "start_time": (now + timedelta(days=1)).isoformat(),
        "end_time": (now + timedelta(days=2)).isoformat()
    }
    resp = requests.post(EVENTS_URL, json=data, headers=headers)
    assert resp.status_code == 201
    event = resp.json()
    assert event["title"] == "Test Event"
    assert event["creator_username"] == username

def test_list_events():
    token, username = get_jwt_token()
    headers = {"Authorization": f"Bearer {token}"}
    now = datetime.now()
    # Create an event to ensure at least one exists
    requests.post(EVENTS_URL, json={
        "title": "List Test Event",
        "description": "Event for listing.",
        "type": "meeting",
        "start_time": (now + timedelta(days=1)).isoformat(),
        "end_time": (now + timedelta(days=2)).isoformat()
    }, headers=headers)
    resp = requests.get(EVENTS_URL, headers=headers)
    assert resp.status_code == 200
    events = resp.json()
    assert isinstance(events, list)
    assert any(e["creator_username"] == username for e in events) 