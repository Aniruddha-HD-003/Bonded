import requests
from datetime import datetime, timedelta

BASE_URL = "http://localhost:8000/api/games"
GROUP_ID = 1  # Replace with a valid group ID for your test environment
USER_TOKEN = None  # Set a valid JWT token if authentication is required
HEADERS = {'Authorization': f'Bearer {USER_TOKEN}'} if USER_TOKEN else {}

def print_result(label, response):
    print(f"{label}: {response.status_code}")
    try:
        print(response.json())
    except Exception:
        print(response.text)

def test_birthday_celebration():
    print("\n=== Birthday Celebration ===")
    # Create
    data = {
        "group": GROUP_ID,
        "birthday_person": 2,  # Replace with a valid user ID
        "birthday_date": (datetime.now() + timedelta(days=1)).date().isoformat(),
        "celebration_date": (datetime.now() + timedelta(days=1)).date().isoformat()
    }
    r = requests.post(f"{BASE_URL}/birthday-celebrations/", json=data, headers=HEADERS)
    print_result("Create Birthday Celebration", r)
    if r.status_code == 201:
        celebration_id = r.json()['id']
        # Send wish
        wish_data = {"message": "Happy Birthday!", "is_anonymous": False}
        r2 = requests.post(f"{BASE_URL}/birthday-celebrations/{celebration_id}/wish/", json=wish_data, headers=HEADERS)
        print_result("Send Birthday Wish", r2)
        # Get wishes
        r3 = requests.get(f"{BASE_URL}/birthday-celebrations/{celebration_id}/wishes/", headers=HEADERS)
        print_result("Get Birthday Wishes", r3)

def test_anniversary_celebration():
    print("\n=== Anniversary Celebration ===")
    data = {
        "group": GROUP_ID,
        "title": "Group Creation Anniversary",
        "description": "Celebrating our group's creation!",
        "anniversary_date": (datetime.now() - timedelta(days=365)).date().isoformat(),
        "celebration_date": datetime.now().date().isoformat(),
        "anniversary_type": "group_creation"
    }
    r = requests.post(f"{BASE_URL}/anniversary-celebrations/", json=data, headers=HEADERS)
    print_result("Create Anniversary Celebration", r)
    if r.status_code == 201:
        celebration_id = r.json()['id']
        # Send message
        msg_data = {"message": "Congrats to the group!", "is_anonymous": False}
        r2 = requests.post(f"{BASE_URL}/anniversary-celebrations/{celebration_id}/message/", json=msg_data, headers=HEADERS)
        print_result("Send Anniversary Message", r2)
        # Get messages
        r3 = requests.get(f"{BASE_URL}/anniversary-celebrations/{celebration_id}/messages/", headers=HEADERS)
        print_result("Get Anniversary Messages", r3)

def test_holiday_game():
    print("\n=== Holiday Game ===")
    data = {
        "group": GROUP_ID,
        "holiday_type": "christmas",
        "title": "Secret Santa",
        "description": "Gift exchange for Christmas!",
        "game_type": "gift_exchange",
        "start_date": datetime.now().isoformat(),
        "end_date": (datetime.now() + timedelta(days=2)).isoformat(),
        "points_reward": 50
    }
    r = requests.post(f"{BASE_URL}/holiday-games/", json=data, headers=HEADERS)
    print_result("Create Holiday Game", r)
    if r.status_code == 201:
        game_id = r.json()['id']
        # Join game
        r2 = requests.post(f"{BASE_URL}/holiday-games/{game_id}/join/", headers=HEADERS)
        print_result("Join Holiday Game", r2)
        # Get participants
        r3 = requests.get(f"{BASE_URL}/holiday-games/{game_id}/participants/", headers=HEADERS)
        print_result("Get Holiday Game Participants", r3)

def test_random_act_of_kindness():
    print("\n=== Random Act of Kindness ===")
    data = {
        "group": GROUP_ID,
        "title": "Secret Appreciation",
        "description": "Send a secret appreciation note!",
        "is_group_wide": True,
        "points_reward": 10
    }
    r = requests.post(f"{BASE_URL}/random-acts-kindness/", json=data, headers=HEADERS)
    print_result("Create Random Act of Kindness", r)
    if r.status_code == 201:
        act_id = r.json()['id']
        # Complete act
        comp_data = {"description": "You are awesome!", "is_anonymous": True}
        r2 = requests.post(f"{BASE_URL}/random-acts-kindness/{act_id}/complete/", json=comp_data, headers=HEADERS)
        print_result("Complete Kindness Act", r2)
        # Get completions
        r3 = requests.get(f"{BASE_URL}/random-acts-kindness/{act_id}/completions/", headers=HEADERS)
        print_result("Get Kindness Act Completions", r3)

def main():
    test_birthday_celebration()
    test_anniversary_celebration()
    test_holiday_game()
    test_random_act_of_kindness()

if __name__ == "__main__":
    main() 