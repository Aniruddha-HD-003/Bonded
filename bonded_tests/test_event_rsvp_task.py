import requests
import time
from datetime import datetime, timedelta

BASE_URL = "http://127.0.0.1:8000/api/users/"
EVENTS_URL = "http://127.0.0.1:8000/api/events/"

def get_jwt_token_and_event():
    group_name = f"rsvptasktestgroup_{int(time.time() * 1000)}"
    username = f"{group_name}_user"
    password = "rsvptasktestpass123"
    reg_resp = requests.post(BASE_URL + "register-group/", json={"group_name": group_name, "num_people": 1})
    creds = reg_resp.json()["credentials"][0]
    requests.post(BASE_URL + "change-credentials/", json={"username": creds["username"], "new_username": username, "new_password": password})
    login_resp = requests.post(BASE_URL + "login/", json={"username": username, "password": password})
    token = login_resp.json()["access"]
    headers = {"Authorization": f"Bearer {token}"}
    now = datetime.now()
    event_resp = requests.post(EVENTS_URL, json={
        "title": "RSVP Task Test Event",
        "description": "Event for RSVP/Task testing.",
        "type": "goal",
        "start_time": (now + timedelta(days=1)).isoformat(),
        "end_time": (now + timedelta(days=2)).isoformat()
    }, headers=headers)
    event_id = event_resp.json()["id"]
    return token, username, event_id

def test_create_and_list_rsvp():
    token, username, event_id = get_jwt_token_and_event()
    headers = {"Authorization": f"Bearer {token}"}
    data = {"status": "yes"}
    resp = requests.post(f"{EVENTS_URL}{event_id}/rsvps/", data=data, headers=headers)
    assert resp.status_code == 201
    rsvp = resp.json()
    assert rsvp["status"] == "yes"
    assert rsvp["user_username"] == username
    # List RSVPs
    list_resp = requests.get(f"{EVENTS_URL}{event_id}/rsvps/", headers=headers)
    assert list_resp.status_code == 200
    rsvps = list_resp.json()
    assert any(r["user_username"] == username for r in rsvps)

def test_create_and_list_task():
    token, username, event_id = get_jwt_token_and_event()
    headers = {"Authorization": f"Bearer {token}"}
    data = {"title": "Test Task"}
    resp = requests.post(f"{EVENTS_URL}{event_id}/tasks/", data=data, headers=headers)
    assert resp.status_code == 201
    task = resp.json()
    assert task["title"] == "Test Task"
    # List Tasks
    list_resp = requests.get(f"{EVENTS_URL}{event_id}/tasks/", headers=headers)
    assert list_resp.status_code == 200
    tasks = list_resp.json()
    assert any(t["title"] == "Test Task" for t in tasks) 