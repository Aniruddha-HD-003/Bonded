#!/bin/bash

# 🚀 Bonded Social Platform - Render Environment Setup Script
# This script helps you generate the environment variables needed for Render deployment

echo "🚀 Bonded Render Environment Setup"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Generate Django secret key
DJANGO_SECRET_KEY=$(python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())")

print_info "Generating environment variables for Render deployment..."
echo ""

# Backend Environment Variables
echo "🔧 BACKEND ENVIRONMENT VARIABLES"
echo "================================"
echo ""
echo "Set these in your Render backend service:"
echo ""
echo "# Django Settings"
echo "DJANGO_SECRET_KEY=$DJANGO_SECRET_KEY"
echo "DEBUG=False"
echo ""
echo "# Database Configuration (update with your Render PostgreSQL details)"
echo "DB_NAME=your_render_db_name"
echo "DB_USER=your_render_db_user"
echo "DB_PASSWORD=your_render_db_password"
echo "DB_HOST=your_render_db_host"
echo "DB_PORT=5432"
echo ""
echo "# Cloudinary Configuration (update with your Cloudinary details)"
echo "CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name"
echo "CLOUDINARY_API_KEY=your_cloudinary_api_key"
echo "CLOUDINARY_API_SECRET=your_cloudinary_api_secret"
echo ""
echo "# CORS Settings (update with your frontend URL)"
echo "CORS_ALLOWED_ORIGINS=https://your-bonded-frontend.onrender.com"
echo ""

# Frontend Environment Variables
echo "🎨 FRONTEND ENVIRONMENT VARIABLES"
echo "================================="
echo ""
echo "Set these in your Render frontend service:"
echo ""
echo "# API Configuration (update with your backend URL)"
echo "REACT_APP_API_URL=https://your-bonded-backend.onrender.com"
echo "REACT_APP_ENVIRONMENT=production"
echo "REACT_APP_VERSION=1.0.0"
echo ""

print_warning "IMPORTANT: Replace the placeholder values with your actual configuration!"
echo ""
print_info "Next steps:"
echo "1. Create your Render services (backend and frontend)"
echo "2. Set the environment variables in each service"
echo "3. Deploy your services"
echo "4. Test the connection between frontend and backend"
echo ""
print_info "For detailed instructions, see: RENDER_DEPLOYMENT.md"
echo ""

# Create environment files for reference
print_info "Creating reference environment files..."

# Backend environment file
cat > backend/.env.render << EOF
# Django Settings
DJANGO_SECRET_KEY=$DJANGO_SECRET_KEY
DEBUG=False

# Database Configuration
DB_NAME=your_render_db_name
DB_USER=your_render_db_user
DB_PASSWORD=your_render_db_password
DB_HOST=your_render_db_host
DB_PORT=5432

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# CORS Settings
CORS_ALLOWED_ORIGINS=https://your-bonded-frontend.onrender.com
EOF

# Frontend environment file
cat > frontend/.env.render << EOF
# API Configuration
REACT_APP_API_URL=https://your-bonded-backend.onrender.com
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.0.0
EOF

print_success "Reference files created:"
echo "  - backend/.env.render"
echo "  - frontend/.env.render"
echo ""
print_warning "These files are for reference only. Do NOT commit them to Git!"
echo ""

print_success "Environment setup complete! 🎉" 