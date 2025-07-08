# 🚀 Bonded Social Platform - Render Deployment Guide

This guide will help you deploy the Bonded Social Platform on Render, including both backend and frontend services.

## 📋 Prerequisites

- Render account
- GitHub repository with your Bonded code
- PostgreSQL database (can be provisioned on Render)

## 🔧 Backend Deployment

### 1. Create a New Web Service

1. Go to your Render dashboard
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:

**Basic Settings:**
- **Name:** `bonded-backend`
- **Environment:** `Python 3`
- **Build Command:** `pip install -r requirements_production.txt`
- **Start Command:** `gunicorn bonded_backend.wsgi:application`

**Environment Variables:**
```bash
DJANGO_SECRET_KEY=your-super-secret-key-here
DEBUG=False
DB_NAME=your_render_db_name
DB_USER=your_render_db_user
DB_PASSWORD=your_render_db_password
DB_HOST=your_render_db_host
DB_PORT=5432
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CORS_ALLOWED_ORIGINS=https://your-bonded-frontend.onrender.com
```

### 2. Database Setup

1. Create a new PostgreSQL service on Render
2. Note the database credentials
3. Update the environment variables with your database details

### 3. Environment Variables for Backend

Set these in your Render backend service:

```bash
# Django Settings
DJANGO_SECRET_KEY=your-super-secret-key-here
DEBUG=False

# Database Configuration (from Render PostgreSQL)
DB_NAME=your_render_db_name
DB_USER=your_render_db_user
DB_PASSWORD=your_render_db_password
DB_HOST=your_render_db_host
DB_PORT=5432

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# CORS Settings (update with your frontend URL)
CORS_ALLOWED_ORIGINS=https://your-bonded-frontend.onrender.com
```

## 🎨 Frontend Deployment

### 1. Create a New Static Site

1. Go to your Render dashboard
2. Click "New +" and select "Static Site"
3. Connect your GitHub repository
4. Configure the service:

**Basic Settings:**
- **Name:** `bonded-frontend`
- **Build Command:** `cd frontend && npm install && npm run build:production`
- **Publish Directory:** `frontend/build`

### 2. Environment Variables for Frontend

Set these in your Render frontend service:

```bash
# API Configuration (update with your backend URL)
REACT_APP_API_URL=https://your-bonded-backend.onrender.com
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.2.0
```

## 🔄 Deployment Process

### Backend Deployment Steps:

1. **Push your code to GitHub**
2. **Set environment variables** in Render dashboard
3. **Deploy the service** - Render will automatically build and deploy
4. **Run migrations** (if needed):
   ```bash
   # In Render shell or via SSH
   python manage_production.py migrate
   ```

### Frontend Deployment Steps:

1. **Update the API URL** in environment variables
2. **Deploy the service** - Render will build and deploy automatically
3. **Verify the build** completes successfully

## 🐛 Troubleshooting

### Common Issues:

#### 1. CORS Errors
**Symptoms:** Frontend can't connect to backend
**Solution:** 
- Check `CORS_ALLOWED_ORIGINS` in backend environment variables
- Ensure frontend URL is included in the list
- Verify the URL format (https://your-frontend.onrender.com)

#### 2. Database Connection Issues
**Symptoms:** Backend fails to start or database errors
**Solution:**
- Verify database credentials in environment variables
- Check if PostgreSQL service is running
- Ensure database exists and is accessible

#### 3. Build Failures
**Symptoms:** Frontend or backend build fails
**Solution:**
- Check build logs in Render dashboard
- Verify all dependencies are in requirements.txt
- Ensure Node.js version is compatible (16+)

#### 4. API Connection Issues
**Symptoms:** Frontend shows network errors
**Solution:**
- Verify `REACT_APP_API_URL` is correct
- Check backend service is running
- Test API endpoints directly

### Debugging Steps:

1. **Check Render Logs:**
   - Go to your service dashboard
   - Click on "Logs" tab
   - Look for error messages

2. **Test API Endpoints:**
   ```bash
   # Test backend health
   curl https://your-backend.onrender.com/api/
   
   # Test with authentication
   curl -H "Authorization: Bearer your-token" \
        https://your-backend.onrender.com/api/users/groups/
   ```

3. **Verify Environment Variables:**
   - Check all required variables are set
   - Ensure no typos in variable names
   - Verify values are correct

## 🔒 Security Considerations

1. **Environment Variables:**
   - Never commit secrets to Git
   - Use Render's environment variable system
   - Rotate secrets regularly

2. **CORS Configuration:**
   - Only allow necessary origins
   - Use HTTPS in production
   - Avoid wildcard origins

3. **Database Security:**
   - Use strong passwords
   - Enable SSL connections
   - Regular backups

## 📊 Monitoring

1. **Health Checks:**
   - Monitor service uptime
   - Check response times
   - Watch for errors

2. **Logs:**
   - Review application logs regularly
   - Set up alerts for critical errors
   - Monitor database performance

## 🔄 Updates and Maintenance

1. **Code Updates:**
   - Push changes to GitHub
   - Render will auto-deploy
   - Test thoroughly after deployment

2. **Database Migrations:**
   ```bash
   # Run migrations after code updates
   python manage_production.py migrate
   ```

3. **Environment Variable Updates:**
   - Update in Render dashboard
   - Redeploy service if needed
   - Test functionality

## 📞 Support

If you encounter issues:

1. Check this guide first
2. Review Render documentation
3. Check application logs
4. Test locally to isolate issues

## 🎉 Success Checklist

- [ ] Backend service is running
- [ ] Frontend service is running
- [ ] Database is connected
- [ ] API endpoints are accessible
- [ ] Frontend can connect to backend
- [ ] Authentication works
- [ ] All features are functional
- [ ] CORS is properly configured
- [ ] Environment variables are set
- [ ] Logs show no errors

---

**Note:** Replace `your-bonded-backend.onrender.com` and `your-bonded-frontend.onrender.com` with your actual Render service URLs. 