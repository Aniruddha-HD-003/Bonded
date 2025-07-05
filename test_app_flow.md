# Bonded App Flow Test Guide

## Prerequisites
- Backend running on http://localhost:8000
- Frontend running on http://localhost:3000
- Both servers should be running without errors

## Test Flow

### 1. Group Registration (Onboarding)
1. Open http://localhost:3000
2. You should be redirected to /onboarding
3. Enter a unique group name (e.g., "Test Group 3")
4. Set number of people to 2
5. Click "Create Group"
6. **Expected Result**: You should see generated credentials for 2 users
7. Click "Proceed to Login"

### 2. Credential Change (First Time Login)
1. Use the first set of credentials from step 1
2. Enter:
   - Group: "Test Group 3"
   - Username: (from generated credentials)
   - Password: (from generated credentials)
3. Click "Sign In"
4. **Expected Result**: You should be redirected to /change-credentials
5. Enter new username (e.g., "john_doe") and password (e.g., "password123")
6. Click "Update Credentials"
7. **Expected Result**: Success message and redirect to login

### 3. Login with New Credentials
1. Use the new credentials:
   - Group: "Test Group 3"
   - Username: "john_doe"
   - Password: "password123"
2. Click "Sign In"
3. **Expected Result**: 
   - You should be redirected to /dashboard
   - Group selector should appear with your group
   - Dashboard should show group members and allow posting

### 4. Dashboard Functionality
1. Select your group from the dropdown
2. **Expected Result**: 
   - Group members should be displayed
   - Posts section should be visible
   - Events section should be visible
3. Create a test post:
   - Enter some text in the post field
   - Click "Post"
4. **Expected Result**: Post should appear in the posts list
5. Create a test event:
   - Enter event title (e.g., "Weekend Trip")
   - Select event type (e.g., "trip")
   - Set start time
   - Click "Create Event"
6. **Expected Result**: Event should appear in the events list

### 5. Interactions
1. On a post, try adding a comment
2. **Expected Result**: Comment should appear under the post
3. Try adding reactions (like, love, etc.)
4. **Expected Result**: Reaction count should update

### 6. Logout and Re-login
1. Click the "Logout" button
2. **Expected Result**: You should be redirected to login page
3. Login again with the same credentials
4. **Expected Result**: You should be back on the dashboard with your data

## Troubleshooting

### If group registration fails:
- Check that the group name is unique
- Check browser console for errors
- Verify backend is running and accessible

### If login fails:
- Check that credentials are correct
- Check browser console for errors
- Verify JWT token is being stored in localStorage

### If dashboard doesn't load data:
- Check that group is selected
- Check browser console for API errors
- Verify authentication token is being sent with requests

### If posts/events don't appear:
- Check that you're in the correct group
- Check browser console for API errors
- Verify the selected group matches the group where you created the content

## API Endpoints to Verify

You can test these endpoints directly with curl:

```bash
# Register a group
curl -X POST http://localhost:8000/api/users/register-group/ \
  -H "Content-Type: application/json" \
  -d '{"group_name": "Test Group", "num_people": 2}'

# Login
curl -X POST http://localhost:8000/api/users/group-login/ \
  -H "Content-Type: application/json" \
  -d '{"group": "Test Group", "username": "test group_user1", "password": "generated_password"}'

# Get group members (with auth token)
curl -X GET http://localhost:8000/api/users/groups/1/members/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Expected Console Logs

Look for these console logs during the flow:
- "Login: Success! Storing tokens and redirecting to dashboard"
- "Login: Stored memberships: [...]"
- "AuthGate: Token found, staying on current page" 