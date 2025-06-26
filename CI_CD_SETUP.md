# 🚀 CI/CD Pipeline Setup Guide

This guide explains how to set up and use the CI/CD pipeline for the Bonded social platform.

## 📋 Overview

The CI/CD pipeline is configured with GitHub Actions and supports:

- **Development Branch (`group`)**: Testing, linting, and building
- **Production Branch (`production`)**: Security scans, production builds, and deployment
- **Main Branch**: Repository overview and documentation

## 🏗️ Pipeline Structure

### 1. Development Pipeline (`group` branch)
- **Triggers**: Push to `group` branch or pull requests
- **Actions**:
  - Backend testing with PostgreSQL
  - Frontend linting and type checking
  - Frontend testing with coverage
  - Frontend build verification

### 2. Production Pipeline (`production` branch)
- **Triggers**: Push to `production` branch
- **Actions**:
  - Production backend checks
  - Production frontend build
  - Security scanning (CodeQL)
  - Deployment to Railway (backend) and Vercel (frontend)

## 🔧 Setup Instructions

### 1. GitHub Repository Setup

1. **Enable GitHub Actions**
   - Go to your repository → Settings → Actions → General
   - Enable "Allow all actions and reusable workflows"

2. **Set up Branch Protection** (Recommended)
   - Go to Settings → Branches
   - Add rule for `production` branch:
     - Require pull request reviews
     - Require status checks to pass
     - Require branches to be up to date

### 2. Environment Secrets

Add the following secrets in your GitHub repository (Settings → Secrets and variables → Actions):

#### Backend Secrets
```bash
DJANGO_SECRET_KEY=your-super-secret-key-here
DB_NAME=your_production_db_name
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
DB_HOST=your_production_db_host
DB_PORT=5432
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### Frontend Secrets
```bash
REACT_APP_API_URL=https://your-backend-domain.com/api
```

#### Deployment Secrets
```bash
# Railway (Backend)
RAILWAY_TOKEN=your_railway_token

# Vercel (Frontend)
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id

# Optional: Notification URLs
BACKEND_URL=https://your-backend-domain.com
FRONTEND_URL=https://your-frontend-domain.com
```

### 3. Railway Setup (Backend)

1. **Create Railway Account**
   - Go to [Railway](https://railway.app)
   - Sign up with GitHub

2. **Connect Repository**
   - Create new project
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Set root directory to `backend`

3. **Configure Environment Variables**
   - Add all backend environment variables
   - Set `DJANGO_SETTINGS_MODULE=bonded_backend.settings_production`

4. **Get Railway Token**
   - Go to Railway dashboard → Account → Tokens
   - Create new token
   - Add to GitHub secrets as `RAILWAY_TOKEN`

### 4. Vercel Setup (Frontend)

1. **Create Vercel Account**
   - Go to [Vercel](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Set root directory to `frontend`
   - Configure build settings:
     - Build Command: `npm run build`
     - Output Directory: `build`
     - Install Command: `npm install`

3. **Get Vercel Tokens**
   - Go to Vercel dashboard → Settings → Tokens
   - Create new token
   - Add to GitHub secrets as `VERCEL_TOKEN`
   - Get Org ID and Project ID from project settings

## 🚀 Usage

### Development Workflow

1. **Start Development**
   ```bash
   ./scripts/branch-management.sh dev
   ```

2. **Make Changes**
   - Edit code in the `group` branch
   - Commit and push changes

3. **Monitor CI/CD**
   - Check GitHub Actions tab
   - Ensure all tests pass

### Production Deployment

1. **Merge to Production**
   ```bash
   git checkout production
   git merge group
   git push origin production
   ```

2. **Monitor Deployment**
   - Check GitHub Actions for deployment status
   - Verify deployment in Railway and Vercel

3. **Quick Deploy**
   ```bash
   ./scripts/branch-management.sh deploy
   ```

### Branch Management

Use the provided script for easy branch management:

```bash
# Switch to development
./scripts/branch-management.sh dev

# Switch to production
./scripts/branch-management.sh prod

# Switch to main
./scripts/branch-management.sh main

# Check status
./scripts/branch-management.sh status

# Sync all branches
./scripts/branch-management.sh sync

# Deploy production
./scripts/branch-management.sh deploy
```

## 📊 Monitoring

### GitHub Actions
- **Workflow Runs**: View in Actions tab
- **Logs**: Detailed logs for debugging
- **Artifacts**: Build artifacts and test results

### Deployment Status
- **Railway**: Check backend deployment status
- **Vercel**: Check frontend deployment status
- **Health Checks**: Monitor application health

## 🔍 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check GitHub Actions logs
   - Verify environment variables
   - Test locally first

2. **Deployment Failures**
   - Check Railway/Vercel logs
   - Verify tokens and permissions
   - Check environment variables

3. **Test Failures**
   - Run tests locally
   - Check test database configuration
   - Verify dependencies

### Debug Commands

```bash
# Check branch status
./scripts/branch-management.sh status

# Sync branches
./scripts/branch-management.sh sync

# View recent commits
git log --oneline -10

# Check remote status
git remote -v
git branch -a
```

## 🔒 Security

### Security Features
- **CodeQL Analysis**: Automatic security scanning
- **Secret Management**: Secure environment variables
- **Branch Protection**: Prevent direct pushes to production
- **Dependency Scanning**: Monitor for vulnerabilities

### Best Practices
- Never commit secrets to code
- Use pull requests for production changes
- Monitor security alerts
- Keep dependencies updated

## 📈 Performance

### Optimization
- **Caching**: npm and pip dependencies cached
- **Parallel Jobs**: Backend and frontend tests run in parallel
- **Conditional Jobs**: Only run deployment on production branch
- **Artifact Management**: Efficient storage and retrieval

### Monitoring
- **Build Times**: Track pipeline performance
- **Test Coverage**: Monitor code quality
- **Deployment Frequency**: Track release velocity

## 🎯 Next Steps

1. **Set up Monitoring**
   - Configure application monitoring
   - Set up error tracking (Sentry)
   - Monitor performance metrics

2. **Add Notifications**
   - Slack/Discord integration
   - Email notifications
   - Status page updates

3. **Expand Testing**
   - E2E testing with Playwright
   - Performance testing
   - Security testing

4. **Optimize Pipeline**
   - Parallel job execution
   - Caching strategies
   - Build optimization

---

**Need Help?**
- Check GitHub Actions logs
- Review this documentation
- Check the application's built-in documentation
- Open an issue in the repository

**Version**: 1.0.0  
**Last Updated**: June 2025 