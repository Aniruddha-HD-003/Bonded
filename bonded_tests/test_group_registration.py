import requests

BASE_URL = "http://127.0.0.1:8000/api/users/register-group/"

def test_group_registration_success():
    payload = {"group_name": "pytestgroup", "num_people": 2}
    response = requests.post(BASE_URL, json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["group"] == "pytestgroup"
    assert len(data["credentials"]) == 2
    for cred in data["credentials"]:
        assert "username" in cred and "password" in cred

def test_group_registration_duplicate():
    payload = {"group_name": "pytestgroup", "num_people": 2}
    response = requests.post(BASE_URL, json=payload)
    assert response.status_code == 400
    data = response.json()
    assert "error" in data and "already exists" in data["error"] 