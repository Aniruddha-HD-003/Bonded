# Bonded API Testing Guide

This directory contains automated tests for the Bonded social platform API.

## Quick Start

### 1. Run the Complete API Test
```bash
# From the project root directory
python bonded_tests/api_flow_test.py
```

This will:
- ✅ Register a new group
- ✅ Test duplicate group prevention
- ✅ Test first-time login (requires credential change)
- ✅ Test credential change
- ✅ Test login with new credentials
- ✅ Get group members
- ✅ Create a post
- ✅ Get posts
- ✅ Create an event
- ✅ Get events
- ✅ Add a comment
- ✅ Get comments
- ✅ Add reactions (like, love)
- ✅ Get reactions
- ✅ Delete reactions
- ✅ **Automatically clean up all test data**

### 2. Manual Cleanup Commands

If you need to clean up manually:

```bash
# Clean up specific group
cd backend
python manage.py cleanup_test_data --group-name "Test Group API"

# Clean up all test groups (containing "Test Group")
python manage.py cleanup_test_data

# Clean up ALL data (use with extreme caution!)
python manage.py cleanup_test_data --all
```

## How to Add New API Tests

### Step 1: Add a new test function
Add your new test function to `api_flow_test.py`:

```python
def your_new_endpoint_test():
    url = f"{BASE_URL}/your/new/endpoint/"
    headers = {"Authorization": f"Bearer {state['access_token']}"}
    data = {"your": "data"}
    resp = requests.post(url, json=data, headers=headers)
    print_result("Your New Endpoint", resp)
    if resp.status_code == 201:
        state["your_new_id"] = resp.json()["id"]
    return resp
```

### Step 2: Call it in main()
Add your function call to the `main()` function:

```python
def main():
    # ... existing tests ...
    your_new_endpoint_test()
    # ... rest of tests ...
```

### Step 3: Run the test
```bash
python bonded_tests/api_flow_test.py
```

## Test Flow Overview

The test script follows this exact flow:

1. **Group Registration** → Creates group and generates credentials
2. **Duplicate Check** → Verifies duplicate group names are rejected
3. **First Login** → Should require credential change
4. **Credential Change** → Updates username/password
5. **Login with New Credentials** → Gets JWT token and memberships
6. **Get Group Members** → Lists all group members
7. **Create Post** → Creates a test post
8. **Get Posts** → Retrieves posts for the group
9. **Create Event** → Creates a test event
10. **Get Events** → Retrieves events for the group
11. **Add Comment** → Adds comment to the post
12. **Get Comments** → Retrieves comments for the post
13. **Add Reaction** → Adds like reaction
14. **Get Reactions** → Retrieves reactions for the post
15. **Change Reaction** → Changes to love reaction
16. **Get Reactions** → Verifies reaction change
17. **Delete Reaction** → Removes the reaction
18. **Get Reactions** → Verifies reaction deletion
19. **Cleanup** → Automatically deletes all test data

## State Management

The script uses a global `state` dictionary to pass data between tests:

```python
state = {
    "group_id": None,        # Group ID after login
    "group_name": None,      # Group name for cleanup
    "usernames": [],         # Generated usernames
    "passwords": [],         # Generated passwords
    "new_username": "john_doe",  # New username after change
    "new_password": "password123", # New password after change
    "access_token": None,    # JWT access token
    "post_id": None,         # Created post ID
    "event_id": None,        # Created event ID
    "comment_id": None,      # Created comment ID
    "reaction_id": None,     # Created reaction ID
    "user_ids": [],          # All user IDs for cleanup
}
```

## Error Handling

The script includes error handling and will:
- Print detailed results for each step
- Show HTTP status codes
- Display JSON responses
- Continue testing even if some steps fail
- Provide cleanup instructions if automatic cleanup fails

## Prerequisites

- Backend server running on `http://localhost:8000`
- `requests` module installed (`pip install requests`)
- Django backend with all models and endpoints working

## Troubleshooting

### If tests fail:
1. Check that the backend is running
2. Verify all endpoints are working
3. Check the console output for specific error messages
4. Run manual cleanup if needed

### If cleanup fails:
```bash
cd backend
python manage.py cleanup_test_data --group-name "Test Group API"
```

### If you need to start fresh:
```bash
cd backend
python manage.py cleanup_test_data --all
```

## Extending the Tests

You can easily extend this for:
- New API endpoints
- Different data scenarios
- Performance testing
- Load testing
- Integration testing

Just add new functions and call them in the `main()` function! 