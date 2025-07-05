# 🚀 Development Workflow Guide

This guide explains how to work with the Bonded codebase using the `group` (development) and `production` (deployment) branches, and how to effectively interact with AI assistance for development.

## 📋 Branch Strategy

### Branch Overview
- **`group` branch**: Development branch for all new features, bug fixes, and testing
- **`production` branch**: Deployment branch that automatically deploys to Render
- **`main` branch**: Repository overview and documentation

### Workflow Rules
1. **ALWAYS develop on `group` branch first**
2. **NEVER push directly to `production` branch**
3. **Only merge `group` → `production` when code is thoroughly tested**
4. **Use pull requests for production deployments**

## 🔄 Development Workflow

### 1. Start Development
```bash
# Switch to development branch
./scripts/branch-management.sh dev

# Verify you're on the right branch
git branch --show-current  # Should show 'group'
```

### 2. Make Changes
- Edit code in your preferred editor
- Test changes locally
- Commit with descriptive messages

### 3. Test and Validate
```bash
# Run backend tests
cd backend
python manage.py test

# Run frontend tests
cd frontend
npm test

# Build frontend to check for errors
npm run build
```

### 4. Push to Development
```bash
git add .
git commit -m "descriptive commit message"
git push origin group
```

### 5. Monitor CI/CD
- Check GitHub Actions tab
- Ensure all tests pass
- Verify build success

### 6. Deploy to Production (When Ready)
```bash
# Method 1: Using the script
./scripts/branch-management.sh deploy

# Method 2: Manual merge
git checkout production
git merge group
git push origin production
```

## 🤖 AI Development Assistant Guidelines

### How to Interact with AI for Development

#### 1. **Always Start with Context**
```
"I'm working on the Bonded project. I'm currently on the [group/production] branch and want to [describe your task]."
```

#### 2. **Specify Your Current State**
- Tell me which branch you're on
- Mention if you're in development or production mode
- Share any recent changes or issues

#### 3. **Clear Task Descriptions**
Instead of: "Fix the login bug"
Use: "I'm on the group branch. The login form is not validating user credentials properly. Can you help me debug this issue?"

#### 4. **Request Specific Actions**
- "Can you help me implement a new feature?"
- "Can you review this code and suggest improvements?"
- "Can you help me fix this error?"
- "Can you help me test this functionality?"

#### 5. **Follow Up After Changes**
- "The changes look good, can you help me test them?"
- "I've made the changes, what's the next step?"
- "Can you help me prepare this for production deployment?"

### AI Assistant Capabilities

#### What I Can Help With:
1. **Code Development**
   - Write new features
   - Fix bugs and errors
   - Refactor existing code
   - Add tests

2. **Code Review**
   - Review your changes
   - Suggest improvements
   - Identify potential issues
   - Optimize performance

3. **Testing**
   - Help write tests
   - Debug test failures
   - Set up testing environments
   - Validate functionality

4. **Deployment**
   - Help prepare for production
   - Review deployment configurations
   - Troubleshoot deployment issues
   - Monitor deployment status

5. **Documentation**
   - Update README files
   - Write API documentation
   - Create setup guides
   - Document new features

#### What I Need from You:
1. **Current Context**: Which branch, what you're working on
2. **Specific Requirements**: Clear description of what you want to achieve
3. **Error Details**: Full error messages and stack traces
4. **Environment Info**: OS, Node.js version, Python version, etc.

## 🛠️ Common Development Tasks

### Adding a New Feature
1. **Start**: `./scripts/branch-management.sh dev`
2. **Tell AI**: "I want to add a new feature that [describe feature]. I'm on the group branch."
3. **Develop**: Work with AI to implement the feature
4. **Test**: Run tests and validate functionality
5. **Commit**: `git add . && git commit -m "Add [feature name]"`
6. **Push**: `git push origin group`
7. **Monitor**: Check GitHub Actions for test results

### Fixing a Bug
1. **Start**: `./scripts/branch-management.sh dev`
2. **Tell AI**: "I found a bug where [describe bug]. I'm on the group branch."
3. **Debug**: Work with AI to identify and fix the issue
4. **Test**: Verify the fix works
5. **Commit**: `git add . && git commit -m "Fix [bug description]"`
6. **Push**: `git push origin group`

### Preparing for Production
1. **Test**: Ensure all tests pass on group branch
2. **Review**: Have AI review your changes
3. **Deploy**: `./scripts/branch-management.sh deploy`
4. **Monitor**: Check deployment status in GitHub Actions

## 🔧 Useful Commands

### Branch Management
```bash
# Switch to development
./scripts/branch-management.sh dev

# Switch to production
./scripts/branch-management.sh prod

# Check status
./scripts/branch-management.sh status

# Sync all branches
./scripts/branch-management.sh sync

# Deploy production
./scripts/branch-management.sh deploy
```

### Development Commands
```bash
# Backend development
cd backend
python manage.py runserver
python manage.py test
python manage.py migrate

# Frontend development
cd frontend
npm start
npm test
npm run build
```

### Git Commands
```bash
# Check current branch
git branch --show-current

# Check status
git status

# View recent commits
git log --oneline -5

# Stash changes
git stash
git stash pop
```

## 🚨 Emergency Procedures

### If Production Breaks
1. **Don't panic** - The group branch is safe
2. **Revert production**: `git checkout production && git reset --hard HEAD~1`
3. **Fix in development**: Work on the group branch
4. **Test thoroughly**: Ensure the fix works
5. **Deploy when ready**: Use the normal deployment process

### If You're on Wrong Branch
```bash
# If you accidentally made changes on production
git stash
./scripts/branch-management.sh dev
git stash pop

# If you need to switch branches
./scripts/branch-management.sh dev  # or prod
```

## 📞 Getting Help

### When to Ask AI for Help
- **Code issues**: Errors, bugs, implementation problems
- **Feature development**: New features, improvements
- **Testing**: Test failures, test writing
- **Deployment**: Deployment issues, configuration
- **Code review**: Before pushing to production

### How to Ask Effectively
1. **Be specific**: Describe exactly what you need
2. **Provide context**: Current branch, recent changes
3. **Share errors**: Full error messages and logs
4. **Ask follow-ups**: "What's next?" or "How do I test this?"

### Example Interactions
```
You: "I'm on the group branch working on a new user profile feature. I want to add a profile picture upload. Can you help me implement this?"

AI: [Provides implementation guidance]

You: "The implementation looks good. Can you help me write tests for this feature?"

AI: [Provides test code]

You: "Tests are passing. Should I deploy this to production now?"

AI: [Reviews and provides deployment guidance]
```

## 🎯 Best Practices

### Development
- Always work on the `group` branch
- Test thoroughly before pushing
- Write descriptive commit messages
- Keep commits small and focused

### Communication with AI
- Provide clear context
- Be specific about requirements
- Ask follow-up questions
- Share error details

### Production Deployment
- Only deploy tested code
- Monitor deployment status
- Have a rollback plan
- Document changes

---

**Remember**: The `group` branch is your safe development space. Only move code to `production` when you're confident it works correctly! 