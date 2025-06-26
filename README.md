# 🚀 Bonded - Social Platform for Groups

A production-grade social platform designed for groups of friends to share memories, plan trips/goals/meetings, and interact via posts, likes, and reactions. Features group isolation where the same username can exist in different groups but must be unique within a group.

## ✨ Features

### 🏠 Group-Based Social Networking
- **Multi-group membership** - Join multiple groups with unique usernames per group
- **Group isolation** - Complete separation of data between groups
- **Member management** - View and manage group members

### 📝 Content Creation & Interaction
- **Posts** - Share text content with your group
- **Events** - Plan trips, goals, and meetings with event types
- **Comments** - Engage with posts through comments
- **Reactions** - React with emojis (like, love, laugh, wow, sad, angry)

### 🔐 Security & Authentication
- **JWT Authentication** - Secure token-based authentication
- **Group-based login** - Login with group name, username, and password
- **Credential management** - Change username and password securely
- **CORS protection** - Cross-origin request security

### 🎨 Modern UI/UX
- **Futuristic design** - Gradient backgrounds, glassmorphism effects
- **Responsive layout** - Works on all devices
- **Material-UI components** - Professional, accessible components
- **Real-time updates** - Automatic data refresh after actions

### 📚 Comprehensive Documentation
- **Built-in documentation** - Accessible via the app
- **API reference** - Complete endpoint documentation
- **Setup guides** - Detailed installation instructions

## 🏗️ Architecture

### Backend Stack
- **Django 5.2.3** - Web framework
- **Django REST Framework 3.16.0** - API framework
- **PostgreSQL** - Database
- **JWT Authentication** - Security
- **Cloudinary** - Media storage
- **CORS** - Cross-origin support

### Frontend Stack
- **React 19.1.0** - UI library
- **TypeScript 4.9.5** - Type safety
- **Material-UI 7.1.2** - Component library
- **React Router 7.6.2** - Navigation
- **Axios 1.10.0** - HTTP client

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm 8+
- Python 3.11+ and pip
- PostgreSQL database
- Cloudinary account (for media storage)

### Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd bonded
```

2. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
npm start
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## 📦 Production Build

### Automated Build
```bash
./build.sh
```

### Manual Build
See [BUILD_GUIDE.md](BUILD_GUIDE.md) for detailed production deployment instructions.

## 🗄️ Database Models

### Core Models
- **User** - Custom user model with group memberships
- **Group** - Social groups with member relationships
- **GroupMembership** - Junction table with username per group
- **Post** - User posts with text content
- **Event** - Events with title, type, and start time
- **Comment** - Comments on posts
- **Reaction** - User reactions to posts

## 🔌 API Endpoints

### Authentication
- `POST /api/users/register-group/` - Register a new group
- `POST /api/users/group-login/` - Login with group credentials
- `POST /api/users/change-credentials/` - Change username/password

### Groups
- `GET /api/users/groups/{id}/members/` - Get group members

### Content
- `GET /api/posts/?group={id}` - Get posts for a group
- `POST /api/posts/` - Create a new post
- `GET /api/events/?group={id}` - Get events for a group
- `POST /api/events/` - Create a new event

### Interactions
- `GET /api/comments/post/{id}/` - Get comments for a post
- `POST /api/comments/post/{id}/` - Add a comment
- `GET /api/reactions/post/{id}/` - Get reactions for a post
- `POST /api/reactions/post/{id}/` - Add/change reaction
- `DELETE /api/reactions/post/{id}/` - Remove reaction

## 🚀 Deployment Options

### Backend Deployment
- **Heroku** - Easy deployment with PostgreSQL add-on
- **Railway** - Automatic deployment from GitHub
- **DigitalOcean** - VPS deployment with Docker

### Frontend Deployment
- **Vercel** - Optimized for React applications
- **Netlify** - Static site hosting
- **Heroku** - Full-stack deployment

## 🧪 Testing

### Backend Testing
```bash
cd backend
python manage.py test
```

### Frontend Testing
```bash
cd frontend
npm test
npm run test:coverage
```

## 📊 Monitoring

### Backend Monitoring
- Django logs in `backend/logs/django.log`
- Database performance monitoring
- API response time tracking

### Frontend Monitoring
- Error tracking with Sentry
- Core Web Vitals monitoring
- User interaction analytics

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```bash
DJANGO_SECRET_KEY=your-secret-key
DEBUG=False
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Frontend (.env.production)
```bash
REACT_APP_API_URL=https://your-backend-domain.com/api
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.0.0
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

Copyright (c) 2025 Aniruddha H D

This source code is proprietary and confidential.
No part of this codebase may be copied, modified, distributed, or used in any form
without explicit written permission from the author.

## 🆘 Support

- **Documentation** - Available in the app via the Documentation button
- **Issues** - Report bugs and feature requests via GitHub Issues
- **Discussions** - Join discussions in GitHub Discussions

## 🎯 Roadmap

### Version 1.1 (Planned)
- [ ] Real-time chat functionality
- [ ] File sharing capabilities
- [ ] Event RSVP system
- [ ] Task management features

### Version 1.2 (Planned)
- [ ] Push notifications
- [ ] Mobile app development
- [ ] Advanced analytics
- [ ] Multi-language support

## 🙏 Acknowledgments

- **Django** - For the robust backend framework
- **React** - For the powerful frontend library
- **Material-UI** - For the beautiful component library
- **PostgreSQL** - For the reliable database
- **Cloudinary** - For media storage solutions

---

**Built with ❤️ by the Bonded Development Team**

**Version:** 1.0.0  
**Last Updated:** June 2025 
