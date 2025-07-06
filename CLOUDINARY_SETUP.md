# Cloudinary Setup Guide

## 🚀 Cloudinary-Only Media Storage

The application is now configured to use Cloudinary exclusively for all media storage. No local files are stored on your system.

## 📋 Prerequisites

1. **Cloudinary Account** - Sign up at [cloudinary.com](https://cloudinary.com)
2. **Python Environment** - Ensure you have the required packages installed

## 🔧 Setup Instructions

### 1. Get Cloudinary Credentials

1. **Sign up/Login** to [Cloudinary](https://cloudinary.com)
2. **Go to Dashboard** - You'll see your credentials
3. **Copy the following:**
   - Cloud Name
   - API Key
   - API Secret

### 2. Set Environment Variables

#### Option A: Export in Terminal (Temporary)
```bash
export CLOUDINARY_CLOUD_NAME=your_cloud_name
export CLOUDINARY_API_KEY=your_api_key
export CLOUDINARY_API_SECRET=your_api_secret
```

#### Option B: Create .env File (Recommended)
Create a `.env` file in the `backend` directory:
```bash
# backend/.env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Install python-dotenv (if using .env file)
```bash
cd backend
pip install python-dotenv
```

### 4. Update Settings (if using .env file)
Add this to the top of `backend/bonded_backend/settings.py`:
```python
from pathlib import Path
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
```

### 5. Test the Setup
```bash
cd backend
python manage.py check
```

## 🧪 Testing Media Upload

### Run the Test Script
```bash
python test_cloudinary_media.py
```

### Manual Testing
1. Start the backend server: `python manage.py runserver`
2. Start the frontend: `npm start`
3. Create a group and login
4. Upload a photo or video
5. Check that it displays correctly

## 📁 Cloudinary Storage Structure

Media files will be stored in Cloudinary with this structure:
```
Cloudinary Cloud/
├── posts/
│   ├── image1.jpg
│   ├── video1.mp4
│   └── ...
```

## 🔍 Troubleshooting

### Common Issues:

1. **"Invalid credentials" error**
   - Double-check your Cloudinary credentials
   - Ensure environment variables are set correctly

2. **Media not uploading**
   - Check file size (max 50MB)
   - Verify file type is supported
   - Check Django logs for errors

3. **Media not displaying**
   - Check browser console for errors
   - Verify the media URL in the API response
   - Test the URL directly in browser

### Debug Steps:

1. **Check Environment Variables**
   ```bash
   echo $CLOUDINARY_CLOUD_NAME
   echo $CLOUDINARY_API_KEY
   echo $CLOUDINARY_API_SECRET
   ```

2. **Test Cloudinary Connection**
   ```python
   python manage.py shell
   >>> from cloudinary import uploader
   >>> result = uploader.upload("test.jpg")
   ```

3. **Check Django Settings**
   ```python
   python manage.py shell
   >>> from django.conf import settings
   >>> print(settings.CLOUDINARY_STORAGE)
   ```

## 📊 Cloudinary Dashboard

After uploading media, you can view it in your Cloudinary dashboard:
- **Media Library** - See all uploaded files
- **Analytics** - Track usage and bandwidth
- **Transformations** - Apply image/video transformations

## 🔒 Security

- **API Key** - Keep your API key secret
- **Upload Presets** - Consider using upload presets for additional security
- **Access Control** - Configure access control in Cloudinary dashboard

## 💰 Pricing

Cloudinary offers a generous free tier:
- **25 GB storage**
- **25 GB bandwidth/month**
- **25,000 transformations/month**

## 🚀 Production Deployment

For production, ensure:
1. Environment variables are set securely
2. Use production Cloudinary account
3. Configure proper CORS settings
4. Set up monitoring and analytics

## 📝 Example .env File

```bash
# backend/.env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# Optional: Additional settings
DEBUG=True
SECRET_KEY=your_django_secret_key
```

## 🆘 Support

If you encounter issues:
1. Check Cloudinary dashboard for upload status
2. Verify credentials are correct
3. Check Django logs for detailed error messages
4. Test with a simple image file first
5. Ensure your Cloudinary account is active

## ✅ Verification Checklist

- [ ] Cloudinary account created
- [ ] Credentials obtained (Cloud Name, API Key, API Secret)
- [ ] Environment variables set
- [ ] Django settings updated (if using .env)
- [ ] Test upload successful
- [ ] Media displays correctly in frontend
- [ ] No local files being created 