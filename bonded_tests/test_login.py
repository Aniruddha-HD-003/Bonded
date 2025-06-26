import requests

BASE_URL = "http://127.0.0.1:8000/api/users/"

def test_login_must_change_credentials():
    # Register a new group and get credentials
    reg_resp = requests.post(BASE_URL + "register-group/", json={"group_name": "apitestgroup2", "num_people": 1})
    creds = reg_resp.json()["credentials"][0]
    # Try to login (should be blocked)
    login_resp = requests.post(BASE_URL + "login/", json={"username": creds["username"], "password": creds["password"]})
    assert login_resp.status_code in (400, 401, 403, 200)
    data = login_resp.json()
    assert "must_change_credentials" in data or "No active account" in str(data)

def test_login_after_credential_change():
    # Register a new group and get credentials
    reg_resp = requests.post(BASE_URL + "register-group/", json={"group_name": "apitestgroup3", "num_people": 1})
    creds = reg_resp.json()["credentials"][0]
    # Change credentials
    change_resp = requests.post(BASE_URL + "change-credentials/", json={"username": creds["username"], "new_username": "apitestuser3", "new_password": "apitestpass123"})
    assert change_resp.status_code == 200
    # Login with new credentials
    login_resp = requests.post(BASE_URL + "login/", json={"username": "apitestuser3", "password": "apitestpass123"})
    assert login_resp.status_code == 200
    data = login_resp.json()
    assert "access" in data and "refresh" in data 