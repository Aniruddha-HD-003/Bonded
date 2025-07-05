# 🚀 Quick Reference Card

## 🔄 Branch Management
```bash
# Switch to development (ALWAYS start here)
./scripts/branch-management.sh dev

# Switch to production
./scripts/branch-management.sh prod

# Check current status
./scripts/branch-management.sh status

# Deploy to production (when ready)
./scripts/branch-management.sh deploy
```

## 🛠️ Development Commands
```bash
# Backend
cd backend
python manage.py runserver
python manage.py test
python manage.py migrate

# Frontend
cd frontend
npm start
npm test
npm run build
```

## 📝 Git Workflow
```bash
# Check current branch
git branch --show-current

# Add and commit changes
git add .
git commit -m "descriptive message"
git push origin group

# View recent commits
git log --oneline -5
```

## 🤖 AI Interaction Templates

### Starting Development
```
"I'm working on the Bonded project. I'm currently on the group branch and want to [describe your task]."
```

### Reporting Issues
```
"I'm on the group branch. I found an issue where [describe issue]. Can you help me fix this?"
```

### Feature Development
```
"I'm on the group branch. I want to add a new feature that [describe feature]. Can you help me implement this?"
```

### Code Review
```
"I'm on the group branch. Can you review this code and suggest improvements?"
```

### Deployment
```
"I'm ready to deploy to production. Can you help me prepare and deploy the changes?"
```

## 🚨 Emergency Commands
```bash
# If you're on wrong branch
git stash
./scripts/branch-management.sh dev
git stash pop

# If production breaks
git checkout production
git reset --hard HEAD~1
git push origin production --force
```

## 📊 Monitoring
- **GitHub Actions**: Check CI/CD pipeline status
- **Local Testing**: Run tests before pushing
- **Production**: Monitor deployment status

---

**Remember**: Always develop on `group` branch, test thoroughly, then deploy to `production`! 