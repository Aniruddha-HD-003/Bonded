# 🚀 Bonded Social Platform - Production Build Guide

## 📋 Prerequisites

Before building for production, ensure you have:

- **Node.js 16+** and **npm 8+**
- **Python 3.11+** and **pip**
- **PostgreSQL** database (local or cloud)
- **Cloudinary** account for media storage
- **Git** for version control

## 🏗️ Backend Production Setup

### 1. Environment Configuration

Create a `.env` file in the `backend/` directory:

```bash
# Django Settings
DJANGO_SECRET_KEY=your-super-secret-key-here
DEBUG=False

# Database Configuration
DB_NAME=your_production_db_name
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
DB_HOST=your_production_db_host
DB_PORT=5432

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# CORS Settings (Update with your frontend domain)
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### 2. Install Production Dependencies

```bash
cd backend
pip install -r requirements_production.txt
```

### 3. Database Setup

```bash
# Run migrations
python manage_production.py makemigrations
python manage_production.py migrate

# Create superuser (optional)
python manage_production.py createsuperuser

# Collect static files
python manage_production.py collectstatic --noinput
```

### 4. Test Production Settings

```bash
# Test with production settings
python manage_production.py check --deploy
```

## ⚛️ Frontend Production Setup

### 1. Environment Configuration

Create a `.env.production` file in the `frontend/` directory:

```bash
REACT_APP_API_URL=https://your-backend-domain.com/api
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.1.0
```

### 2. Install Dependencies

```bash
cd frontend
npm install
```

### 3. Build for Production

```bash
# Production build (without source maps)
npm run build:production

# Or regular build with source maps
npm run build
```

### 4. Test Production Build

```bash
# Serve the production build locally
npm run analyze
```

## 🚀 Deployment Options

### Option 1: Heroku Deployment

#### Backend Deployment

1. **Create Heroku App**
```bash
heroku create your-bonded-backend
```

2. **Set Environment Variables**
```bash
heroku config:set DJANGO_SECRET_KEY=your-secret-key
heroku config:set DEBUG=False
heroku config:set DB_NAME=your_db_name
heroku config:set DB_USER=your_db_user
heroku config:set DB_PASSWORD=your_db_password
heroku config:set DB_HOST=your_db_host
heroku config:set CLOUDINARY_CLOUD_NAME=your_cloud_name
heroku config:set CLOUDINARY_API_KEY=your_api_key
heroku config:set CLOUDINARY_API_SECRET=your_api_secret
```

3. **Add PostgreSQL Add-on**
```bash
heroku addons:create heroku-postgresql:mini
```

4. **Deploy**
```bash
git add .
git commit -m "Production deployment"
git push heroku main
```

5. **Run Migrations**
```bash
heroku run python manage_production.py migrate
```

#### Frontend Deployment

1. **Create Heroku App**
```bash
heroku create your-bonded-frontend
```

2. **Set Buildpack**
```bash
heroku buildpacks:set mars/create-react-app
```

3. **Set Environment Variables**
```bash
heroku config:set REACT_APP_API_URL=https://your-backend-app.herokuapp.com/api
```

4. **Deploy**
```bash
git add .
git commit -m "Frontend production deployment"
git push heroku main
```

### Option 2: Railway Deployment

#### Backend Deployment

1. **Connect Repository**
   - Go to [Railway](https://railway.app)
   - Connect your GitHub repository
   - Select the `backend` directory

2. **Set Environment Variables**
   - Add all environment variables in Railway dashboard

3. **Deploy**
   - Railway will automatically deploy on push

#### Frontend Deployment

1. **Connect Repository**
   - Create a new service
   - Select the `frontend` directory

2. **Set Environment Variables**
   - Add `REACT_APP_API_URL` pointing to your backend

3. **Deploy**
   - Railway will automatically build and deploy

### Option 3: Vercel Deployment

#### Frontend Deployment

1. **Connect Repository**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Set root directory to `frontend`

2. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

3. **Set Environment Variables**
   - Add `REACT_APP_API_URL`

4. **Deploy**
   - Vercel will automatically deploy

## 🔧 Production Checklist

### Backend Checklist
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Static files collected
- [ ] Security settings enabled
- [ ] CORS configured for frontend domain
- [ ] Logging configured
- [ ] SSL/HTTPS enabled
- [ ] Database backups configured

### Frontend Checklist
- [ ] Environment variables set
- [ ] API URL updated to production backend
- [ ] Build completed successfully
- [ ] No console errors
- [ ] All features working
- [ ] Performance optimized
- [ ] SEO meta tags added

### Security Checklist
- [ ] Django secret key changed
- [ ] Debug mode disabled
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] JWT tokens secured
- [ ] Database credentials secured
- [ ] Cloudinary credentials secured

## 🧪 Testing Production Build

### Backend Testing

```bash
# Test production settings
python manage_production.py check --deploy

# Test API endpoints
curl -X GET https://your-backend-domain.com/api/posts/

# Test authentication
curl -X POST https://your-backend-domain.com/api/users/group-login/ \
  -H "Content-Type: application/json" \
  -d '{"group":"Test Group","username":"test","password":"test123"}'
```

### Frontend Testing

```bash
# Serve production build locally
npx serve -s build

# Test all features
# - Registration
# - Login
# - Group selection
# - Post creation
# - Event creation
# - Comments
# - Reactions
# - Documentation
```

## 📊 Monitoring & Maintenance

### Backend Monitoring

1. **Logs**
   - Monitor Django logs in `backend/logs/django.log`
   - Set up log aggregation (e.g., Papertrail)

2. **Database**
   - Monitor database performance
   - Set up automated backups

3. **API Health**
   - Set up health check endpoints
   - Monitor response times

### Frontend Monitoring

1. **Error Tracking**
   - Set up error tracking (e.g., Sentry)
   - Monitor console errors

2. **Performance**
   - Monitor Core Web Vitals
   - Track user interactions

## 🔄 Update Process

### Backend Updates

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
pip install -r requirements_production.txt

# Run migrations
python manage_production.py migrate

# Restart application
# (Platform specific - Heroku: git push, Railway: auto-deploy)
```

### Frontend Updates

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Build new version
npm run build:production

# Deploy
# (Platform specific)
```

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check CORS_ALLOWED_ORIGINS in backend
   - Verify frontend domain is included

2. **Database Connection**
   - Verify database credentials
   - Check database server status

3. **JWT Token Issues**
   - Check token expiration settings
   - Verify secret key configuration

4. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies installed

### Support

For issues not covered in this guide:
1. Check the application logs
2. Review the documentation in the app
3. Test with development settings first
4. Verify environment variables are set correctly

## 🎉 Success!

Your Bonded social platform is now ready for production! 

**Next Steps:**
1. Share the platform with your group
2. Monitor usage and performance
3. Gather feedback for improvements
4. Plan future feature releases

---

**Version:** 1.1.0  
**Last Updated:** June 2025  
**Maintainer:** Bonded Development Team 