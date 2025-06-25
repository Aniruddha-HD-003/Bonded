from flask import Flask, render_template, request, redirect, url_for, session, flash, send_from_directory, jsonify
from functools import wraps
import os
import random
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename
import cloudinary
import cloudinary.uploader
import cloudinary.api
import sqlite3
from contextlib import contextmanager

app = Flask(__name__, static_folder='static')
app.secret_key = os.urandom(24)

# Cloudinary configuration
cloudinary.config(
    cloud_name = "dm0kkxyia",  # Replace with your cloud name
    api_key = "494732922624254",        # Replace with your API key
    api_secret = "wwF_hLD-MpsA25OAJUsMbbmIa2s"   # Replace with your API secret
)

# Database configuration
DATABASE = 'memories.db'

# Add these global variables after the existing ones
TYPING_STATUS = {}
ONLINE_STATUS = {}

def init_db():
    """Initialize the database with required tables"""
    with get_db() as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS memories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                public_id TEXT NOT NULL,
                caption TEXT,
                memory_date TEXT,
                upload_date TEXT,
                resource_type TEXT,
                url TEXT,
                UNIQUE(public_id)
            )
        ''')
        
        conn.execute('''
            CREATE TABLE IF NOT EXISTS comments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                memory_id INTEGER NOT NULL,
                username TEXT NOT NULL,
                comment TEXT NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY (memory_id) REFERENCES memories (id)
            )
        ''')
        
        conn.execute('''
            CREATE TABLE IF NOT EXISTS goals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                created_by TEXT NOT NULL,
                created_at TEXT NOT NULL,
                completed_at TEXT,
                completed_by TEXT,
                completion_media_id TEXT,
                completion_media_url TEXT,
                completion_media_type TEXT,
                FOREIGN KEY (completion_media_id) REFERENCES memories (public_id)
            )
        ''')

        # Add messages table for chat functionality
        conn.execute('''
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sender TEXT NOT NULL,
                receiver TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at TEXT NOT NULL,
                is_read INTEGER DEFAULT 0,
                FOREIGN KEY (sender) REFERENCES users (username),
                FOREIGN KEY (receiver) REFERENCES users (username)
            )
        ''')

        conn.execute('''
            CREATE TABLE IF NOT EXISTS migration_status (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                migration_name TEXT NOT NULL,
                completed_at TEXT NOT NULL,
                UNIQUE(migration_name)
            )
        ''')
        conn.commit()

@contextmanager
def get_db():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def load_existing_posts():
    """Load all existing posts from Cloudinary and database"""
    try:
        # Clear existing posts
        PHOTOS['Ani'] = []
        PHOTOS['Sri'] = []
        
        # Load posts from database
        with get_db() as conn:
            for username in ['Ani', 'Sri']:
                cursor = conn.execute('SELECT * FROM memories WHERE username = ? ORDER BY upload_date DESC', (username,))
                for row in cursor:
                    photo_data = {
                        'public_id': row['public_id'],
                        'url': row['url'],
                        'resource_type': row['resource_type'],
                        'caption': row['caption'],
                        'date': row['memory_date'],
                        'upload_date': row['upload_date']
                    }
                    PHOTOS[username].append(photo_data)
        
        print("Successfully loaded existing posts from database")
    except Exception as e:
        print(f"Error loading existing posts: {str(e)}")

def save_memory_to_db(username, photo_data):
    """Save memory metadata to database"""
    try:
        with get_db() as conn:
            conn.execute('''
                INSERT OR REPLACE INTO memories 
                (username, public_id, caption, memory_date, upload_date, resource_type, url)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                username,
                photo_data['public_id'],
                photo_data['caption'],
                photo_data['date'],
                photo_data['upload_date'],
                photo_data['resource_type'],
                photo_data['url']
            ))
            conn.commit()
    except Exception as e:
        print(f"Error saving to database: {str(e)}")

# Configure upload folder for temporary storage
UPLOAD_FOLDER = 'static/images/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov', 'avi'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Hardcoded user credentials (in a real app, this would be in a database)
USERS = {
    "Ani": "love456",  # Your credentials
    "Sri": "love123"   # Your partner's credentials
}

# Store photos and their metadata (in a real app, this would be in a database)
PHOTOS = {
    "Ani": [],
    "Sri": []
}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'username' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def login():
    if 'username' in session:
        return redirect(url_for('dashboard'))
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def login_post():
    username = request.form.get('username')
    password = request.form.get('password')
    
    if username in USERS and USERS[username] == password:
        session['username'] = username
        return redirect(url_for('dashboard'))
    
    flash('Invalid credentials!')
    return redirect(url_for('login'))

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html', username=session['username'])

@app.route('/love_letter')
@login_required
def love_letter():
    return render_template('love_letter.html')

@app.route('/memory_game')
@login_required
def memory_game():
    return render_template('memory_game.html')

# New endpoints for photo gallery
@app.route('/photo_gallery')
@login_required
def photo_gallery():
    username = session['username']
    photos = PHOTOS.get(username, [])
    # Get comments for each photo
    for photo in photos:
        memory_id = get_memory_id(photo['public_id'])
        if memory_id:
            photo['comments'] = get_comments(memory_id)
        else:
            photo['comments'] = []
    
    return render_template('photo_gallery.html', photos=photos, username=username)

@app.route('/create_post', methods=['GET', 'POST'])
@login_required
def create_post():
    if request.method == 'POST':
        if 'photo' not in request.files:
            flash('No file selected', 'error')
            return redirect(request.url)
        
        file = request.files['photo']
        if file.filename == '':
            flash('No file selected', 'error')
            return redirect(request.url)
        
        if file and allowed_file(file.filename):
            try:
                # Get form data
                caption = request.form.get('caption', '')
                memory_date = request.form.get('memory_date', '')
                
                # Generate a unique filename with timestamp
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                filename = secure_filename(file.filename)
                public_id = f"love_memories/{session['username']}/{timestamp}_{filename}"
                
                # Upload to Cloudinary with context metadata
                upload_result = cloudinary.uploader.upload(
                    file,
                    resource_type="auto",
                    public_id=public_id,
                    context={
                        "caption": caption,
                        "date": memory_date
                    }
                )
                
                # Store photo metadata
                username = session['username']
                photo_data = {
                    'public_id': upload_result['public_id'],
                    'url': upload_result['secure_url'],
                    'resource_type': upload_result['resource_type'],
                    'caption': caption,
                    'date': memory_date,
                    'upload_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                }
                
                # Save to database
                save_memory_to_db(username, photo_data)
                
                # Update in-memory storage
                PHOTOS[username].append(photo_data)
                
                flash('Memory uploaded successfully!', 'success')
                return redirect(url_for('photo_gallery'))
                
            except Exception as e:
                flash(f'Error uploading file: {str(e)}', 'error')
                return redirect(request.url)
    
    return render_template('create_post.html')

@app.route('/view_posts/<username>')
@login_required
def view_posts(username):
    if username not in USERS:
        flash('User not found', 'error')
        return redirect(url_for('dashboard'))
    
    photos = PHOTOS.get(username, [])
    # Get comments for each photo
    for photo in photos:
        memory_id = get_memory_id(photo['public_id'])
        if memory_id:
            photo['comments'] = get_comments(memory_id)
        else:
            photo['comments'] = []
    
    return render_template('view_posts.html', photos=photos, username=username)

@app.route('/countdown')
@login_required
def countdown():
    return render_template('countdown.html')

def get_comments(memory_id):
    """Get all comments for a memory"""
    with get_db() as conn:
        cursor = conn.execute('''
            SELECT c.*, m.username as memory_owner 
            FROM comments c
            JOIN memories m ON c.memory_id = m.id
            WHERE c.memory_id = ?
            ORDER BY c.created_at DESC
        ''', (memory_id,))
        return [dict(row) for row in cursor.fetchall()]

def add_comment(memory_id, username, comment):
    """Add a new comment to a memory"""
    try:
        with get_db() as conn:
            conn.execute('''
                INSERT INTO comments (memory_id, username, comment, created_at)
                VALUES (?, ?, ?, ?)
            ''', (memory_id, username, comment, datetime.now().strftime('%Y-%m-%d %H:%M:%S')))
            conn.commit()
            return True
    except Exception as e:
        print(f"Error adding comment: {str(e)}")
        return False

def get_memory_id(public_id):
    """Get memory ID from public_id"""
    with get_db() as conn:
        cursor = conn.execute('SELECT id FROM memories WHERE public_id = ?', (public_id,))
        row = cursor.fetchone()
        return row['id'] if row else None

@app.route('/add_comment', methods=['POST'])
@login_required
def add_comment_route():
    memory_public_id = request.form.get('memory_public_id')
    comment = request.form.get('comment')
    
    if not comment or not memory_public_id:
        return jsonify({'success': False, 'message': 'Missing required fields'})
    
    memory_id = get_memory_id(memory_public_id)
    if not memory_id:
        return jsonify({'success': False, 'message': 'Memory not found'})
    
    if add_comment(memory_id, session['username'], comment):
        return jsonify({
            'success': True,
            'comment': {
                'username': session['username'],
                'comment': comment,
                'created_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
        })
    return jsonify({'success': False, 'message': 'Failed to add comment'})

@app.route('/get_comments/<memory_public_id>')
@login_required
def get_comments_route(memory_public_id):
    memory_id = get_memory_id(memory_public_id)
    if not memory_id:
        return jsonify({'success': False, 'message': 'Memory not found'})
    
    comments = get_comments(memory_id)
    return jsonify({'success': True, 'comments': comments})

def delete_memory(public_id):
    """Delete a memory and all its associated data"""
    try:
        print(f"Starting deletion process for public_id: {public_id}")
        with get_db() as conn:
            # Get the memory ID first
            cursor = conn.execute('SELECT id, resource_type, username FROM memories WHERE public_id = ?', (public_id,))
            memory = cursor.fetchone()
            
            if not memory:
                print(f"Memory not found in database: {public_id}")
                return False
            
            print(f"Found memory in database: {memory}")
            
            # Delete all comments associated with this memory
            try:
                conn.execute('DELETE FROM comments WHERE memory_id = ?', (memory['id'],))
                print(f"Deleted comments for memory_id: {memory['id']}")
            except Exception as e:
                print(f"Error deleting comments: {str(e)}")
            
            # Delete the memory itself
            try:
                conn.execute('DELETE FROM memories WHERE public_id = ?', (public_id,))
                print(f"Deleted memory from database: {public_id}")
            except Exception as e:
                print(f"Error deleting memory from database: {str(e)}")
                return False
            
            # Delete from Cloudinary
            try:
                # Get the resource type from the database
                resource_type = memory['resource_type']
                print(f"Attempting to delete from Cloudinary with resource_type: {resource_type}")
                
                # Format the public_id for Cloudinary
                # Remove any leading slashes and ensure proper format
                formatted_public_id = public_id.lstrip('/')
                
                # Extract the actual public_id from the full path
                # Cloudinary public_ids don't include the folder structure
                if '/' in formatted_public_id:
                    formatted_public_id = formatted_public_id.split('/')[-1]
                
                print(f"Formatted public_id for Cloudinary: {formatted_public_id}")
                
                # Delete from Cloudinary with the correct resource type
                result = cloudinary.uploader.destroy(
                    formatted_public_id,
                    resource_type=resource_type,
                    invalidate=True
                )
                
                print(f"Cloudinary deletion result: {result}")
                
                if result.get('result') != 'ok':
                    print(f"Cloudinary deletion failed: {result}")
                    # Continue with database deletion even if Cloudinary fails
            except Exception as e:
                print(f"Error deleting from Cloudinary: {str(e)}")
                # Continue with database deletion even if Cloudinary fails
            
            try:
                conn.commit()
                print("Database changes committed successfully")
                return True
            except Exception as e:
                print(f"Error committing database changes: {str(e)}")
                return False
    except Exception as e:
        print(f"Unexpected error in delete_memory: {str(e)}")
        return False

@app.route('/delete_post/<public_id>', methods=['POST'])
@login_required
def delete_post(public_id):
    try:
        print(f"Delete request received for public_id: {public_id}")
        print(f"Current user: {session['username']}")
        
        # Verify that the user owns this post
        with get_db() as conn:
            cursor = conn.execute('SELECT username, public_id FROM memories WHERE public_id = ?', (public_id,))
            memory = cursor.fetchone()
            
            if not memory:
                print(f"Post not found: {public_id}")
                return jsonify({'success': False, 'message': 'Post not found'})
            
            print(f"Post owner: {memory['username']}")
            print(f"Original public_id: {memory['public_id']}")
            
            if memory['username'] != session['username']:
                print(f"Unauthorized deletion attempt by {session['username']}")
                return jsonify({'success': False, 'message': 'Unauthorized to delete this post'})
        
        if delete_memory(public_id):
            # Remove from in-memory storage
            for username in PHOTOS:
                PHOTOS[username] = [p for p in PHOTOS[username] if p['public_id'] != public_id]
            print("Post successfully deleted")
            return jsonify({'success': True})
        
        print("Failed to delete post")
        return jsonify({'success': False, 'message': 'Failed to delete post'})
    except Exception as e:
        print(f"Error in delete_post: {str(e)}")
        return jsonify({'success': False, 'message': str(e)})

def add_goal(title, description, username):
    """Add a new goal to the database"""
    try:
        with get_db() as conn:
            conn.execute('''
                INSERT INTO goals (title, description, created_by, created_at)
                VALUES (?, ?, ?, ?)
            ''', (title, description, username, datetime.now().strftime('%Y-%m-%d %H:%M:%S')))
            conn.commit()
            return True
    except Exception as e:
        print(f"Error adding goal: {str(e)}")
        return False

def get_goals():
    """Get all goals"""
    try:
        with get_db() as conn:
            cursor = conn.execute('''
                SELECT g.*, 
                       m.caption as completion_caption,
                       m.memory_date as completion_date
                FROM goals g
                LEFT JOIN memories m ON g.completion_media_id = m.public_id
                ORDER BY g.created_at DESC
            ''')
            return [dict(row) for row in cursor.fetchall()]
    except Exception as e:
        print(f"Error getting goals: {str(e)}")
        return []

def complete_goal(goal_id, username, media_data=None):
    """Mark a goal as completed with optional media"""
    try:
        with get_db() as conn:
            if media_data:
                # Update goal with media information
                conn.execute('''
                    UPDATE goals 
                    SET completed_at = ?,
                        completed_by = ?,
                        completion_media_id = ?,
                        completion_media_url = ?,
                        completion_media_type = ?
                    WHERE id = ?
                ''', (
                    datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    username,
                    media_data['public_id'],
                    media_data['url'],
                    media_data['resource_type'],
                    goal_id
                ))
            else:
                # Update goal without media
                conn.execute('''
                    UPDATE goals 
                    SET completed_at = ?,
                        completed_by = ?
                    WHERE id = ?
                ''', (
                    datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    username,
                    goal_id
                ))
            conn.commit()
            return True
    except Exception as e:
        print(f"Error completing goal: {str(e)}")
        return False

def delete_goal(goal_id):
    """Delete a goal"""
    try:
        with get_db() as conn:
            conn.execute('DELETE FROM goals WHERE id = ?', (goal_id,))
            conn.commit()
            return True
    except Exception as e:
        print(f"Error deleting goal: {str(e)}")
        return False

@app.route('/goals')
@login_required
def goals():
    goals_list = get_goals()
    return render_template('goals.html', goals=goals_list)

@app.route('/add_goal', methods=['POST'])
@login_required
def add_goal_route():
    title = request.form.get('title')
    description = request.form.get('description')
    
    if not title:
        return jsonify({'success': False, 'message': 'Title is required'})
    
    if add_goal(title, description, session['username']):
        return jsonify({'success': True})
    return jsonify({'success': False, 'message': 'Failed to add goal'})

@app.route('/complete_goal/<int:goal_id>', methods=['POST'])
@login_required
def complete_goal_route(goal_id):
    try:
        media_data = None
        if 'media' in request.files:
            file = request.files['media']
            if file and file.filename != '':
                # Upload to Cloudinary
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                filename = secure_filename(file.filename)
                public_id = f"goals/{session['username']}/{timestamp}_{filename}"
                
                upload_result = cloudinary.uploader.upload(
                    file,
                    resource_type="auto",
                    public_id=public_id
                )
                
                media_data = {
                    'public_id': upload_result['public_id'],
                    'url': upload_result['secure_url'],
                    'resource_type': upload_result['resource_type']
                }
        
        if complete_goal(goal_id, session['username'], media_data):
            return jsonify({'success': True})
        return jsonify({'success': False, 'message': 'Failed to complete goal'})
    except Exception as e:
        print(f"Error completing goal: {str(e)}")
        return jsonify({'success': False, 'message': str(e)})

@app.route('/delete_goal/<int:goal_id>', methods=['POST'])
@login_required
def delete_goal_route(goal_id):
    if delete_goal(goal_id):
        return jsonify({'success': True})
    return jsonify({'success': False, 'message': 'Failed to delete goal'})

def is_migration_completed(migration_name):
    """Check if a migration has been completed"""
    with get_db() as conn:
        cursor = conn.execute('SELECT id FROM migration_status WHERE migration_name = ?', (migration_name,))
        return cursor.fetchone() is not None

def mark_migration_completed(migration_name):
    """Mark a migration as completed"""
    with get_db() as conn:
        conn.execute('''
            INSERT INTO migration_status (migration_name, completed_at)
            VALUES (?, ?)
        ''', (migration_name, datetime.now().strftime('%Y-%m-%d %H:%M:%S')))
        conn.commit()

def migrate_usernames():
    """Migrate usernames from old to new in the database"""
    if is_migration_completed('username_migration'):
        print("Username migration already completed")
        return

    try:
        with get_db() as conn:
            # Update memories table
            conn.execute('UPDATE memories SET username = ? WHERE username = ?', ('Ani', 'boyfriend'))
            conn.execute('UPDATE memories SET username = ? WHERE username = ?', ('Sri', 'girlfriend'))
            
            # Update comments table
            conn.execute('UPDATE comments SET username = ? WHERE username = ?', ('Ani', 'boyfriend'))
            conn.execute('UPDATE comments SET username = ? WHERE username = ?', ('Sri', 'girlfriend'))
            
            # Update goals table
            conn.execute('UPDATE goals SET created_by = ? WHERE created_by = ?', ('Ani', 'boyfriend'))
            conn.execute('UPDATE goals SET created_by = ? WHERE created_by = ?', ('Sri', 'girlfriend'))
            conn.execute('UPDATE goals SET completed_by = ? WHERE completed_by = ?', ('Ani', 'boyfriend'))
            conn.execute('UPDATE goals SET completed_by = ? WHERE completed_by = ?', ('Sri', 'girlfriend'))
            
            conn.commit()
            mark_migration_completed('username_migration')
            print("Successfully migrated usernames in database")
    except Exception as e:
        print(f"Error migrating usernames: {str(e)}")

def migrate_cloudinary_folders():
    """Migrate Cloudinary folders from old to new structure"""
    if is_migration_completed('cloudinary_migration'):
        print("Cloudinary migration already completed")
        return

    try:
        # Get all resources from old folders
        old_folders = ['love_memories/boyfriend', 'love_memories/girlfriend']
        new_folders = ['love_memories/Ani', 'love_memories/Sri']
        
        for old_folder, new_folder in zip(old_folders, new_folders):
            # List all resources in the old folder
            result = cloudinary.api.resources(
                type='upload',
                prefix=old_folder,
                max_results=500
            )
            
            # Move each resource to the new folder
            for resource in result.get('resources', []):
                old_public_id = resource['public_id']
                new_public_id = old_public_id.replace(old_folder, new_folder)
                
                # Rename the resource
                cloudinary.uploader.rename(
                    old_public_id,
                    new_public_id,
                    resource_type=resource['resource_type']
                )
                
                # Update the public_id in the database
                with get_db() as conn:
                    conn.execute('UPDATE memories SET public_id = ? WHERE public_id = ?',
                               (new_public_id, old_public_id))
                    conn.commit()
                
                print(f"Migrated {old_public_id} to {new_public_id}")
        
        mark_migration_completed('cloudinary_migration')
        print("Successfully migrated Cloudinary folders")
    except Exception as e:
        print(f"Error migrating Cloudinary folders: {str(e)}")

# Chat-related functions
def get_messages(username1, username2, limit=50, after_id=0):
    """Get messages between two users"""
    try:
        with get_db() as conn:
            cursor = conn.execute('''
                SELECT * FROM messages 
                WHERE ((sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?))
                AND id > ?
                ORDER BY created_at ASC
                LIMIT ?
            ''', (username1, username2, username2, username1, after_id, limit))
            messages = [dict(row) for row in cursor.fetchall()]
            return messages
    except Exception as e:
        print(f"Error getting messages: {str(e)}")
        return []

@app.route('/get_messages/<username>')
@login_required
def get_messages_route(username):
    after_id = request.args.get('after', 0, type=int)
    messages = get_messages(session['username'], username, after_id=after_id)
    return jsonify({'success': True, 'messages': messages})

@app.route('/send_message', methods=['POST'])
@login_required
def send_message():
    receiver = request.form.get('receiver')
    message = request.form.get('message')
    
    if not receiver or not message:
        return jsonify({'success': False, 'message': 'Missing required fields'})
    
    try:
        with get_db() as conn:
            cursor = conn.execute('''
                INSERT INTO messages (sender, receiver, message, created_at)
                VALUES (?, ?, ?, ?)
            ''', (session['username'], receiver, message, datetime.now().strftime('%Y-%m-%d %H:%M:%S')))
            message_id = cursor.lastrowid
            conn.commit()
            
            return jsonify({
                'success': True,
                'message': {
                    'id': message_id,
                    'sender': session['username'],
                    'receiver': receiver,
                    'message': message,
                    'created_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    'is_read': 0
                }
            })
    except Exception as e:
        print(f"Error sending message: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to send message'})

@app.route('/mark_read/<username>')
@login_required
def mark_read(username):
    if mark_messages_as_read(username, session['username']):
        return jsonify({'success': True})
    return jsonify({'success': False, 'message': 'Failed to mark messages as read'})

@app.route('/get_unread_count')
@login_required
def get_unread_count_route():
    count = get_unread_count(session['username'])
    return jsonify({'success': True, 'count': count})

# Chat routes
@app.route('/chat')
@login_required
def chat():
    update_online_status(session['username'])
    return render_template('chat.html')

def mark_messages_as_read(sender, receiver):
    """Mark messages as read"""
    try:
        with get_db() as conn:
            conn.execute('''
                UPDATE messages 
                SET is_read = 1 
                WHERE sender = ? AND receiver = ? AND is_read = 0
            ''', (sender, receiver))
            conn.commit()
            return True
    except Exception as e:
        print(f"Error marking messages as read: {str(e)}")
        return False

def get_unread_count(username):
    """Get count of unread messages for a user"""
    try:
        with get_db() as conn:
            cursor = conn.execute('''
                SELECT COUNT(*) as count 
                FROM messages 
                WHERE receiver = ? AND is_read = 0
            ''', (username,))
            return cursor.fetchone()['count']
    except Exception as e:
        print(f"Error getting unread count: {str(e)}")
        return 0

# Add these new functions
def update_typing_status(username, receiver, is_typing):
    """Update typing status for a user"""
    TYPING_STATUS[username] = {
        'receiver': receiver,
        'is_typing': is_typing,
        'timestamp': datetime.now()
    }

def get_typing_status(username):
    """Get typing status for a user"""
    status = TYPING_STATUS.get(username)
    if status and datetime.now() - status['timestamp'] < timedelta(seconds=5):
        return status['is_typing']
    return False

def update_online_status(username):
    """Update online status for a user"""
    ONLINE_STATUS[username] = datetime.now()

def check_user_online(username):
    """Check if a user is online"""
    last_seen = ONLINE_STATUS.get(username)
    if last_seen and datetime.now() - last_seen < timedelta(seconds=30):
        return True
    return False

# Add these new routes
@app.route('/update_typing_status', methods=['POST'])
@login_required
def update_typing_status_route():
    receiver = request.form.get('receiver')
    is_typing = request.form.get('is_typing') == 'true'
    
    if not receiver:
        return jsonify({'success': False, 'message': 'Missing receiver'})
    
    update_typing_status(session['username'], receiver, is_typing)
    return jsonify({'success': True})

@app.route('/get_typing_status/<username>')
@login_required
def get_typing_status_route(username):
    is_typing = get_typing_status(username)
    return jsonify({'success': True, 'is_typing': is_typing})

@app.route('/get_online_status')
@login_required
def get_online_status_route():
    receiver = 'Sri' if session['username'] == 'Ani' else 'Ani'
    online_status = check_user_online(receiver)
    return jsonify({'success': True, 'is_online': online_status})

# Add a heartbeat route to keep online status updated
@app.route('/heartbeat')
@login_required
def heartbeat():
    update_online_status(session['username'])
    return jsonify({'success': True})

if __name__ == '__main__':
    # Initialize database
    init_db()
    # Run migrations only if not already completed
    migrate_usernames()
    migrate_cloudinary_folders()
    # Load existing posts when server starts
    load_existing_posts()
    app.run(debug=True, port=8000, host='0.0.0.0')
