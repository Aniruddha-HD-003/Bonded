# Bonded Frontend v1.4.0

A modern, responsive React frontend for the Bonded social platform - a private social networking application designed for groups of friends to share memories, plan events, and stay connected in a secure environment.

## 🚀 Features

### 🏠 Group-Based Social Networking
- **Multi-group membership** - Join multiple groups with unique usernames per group
- **Group isolation** - Complete separation of data between groups
- **Member management** - View and manage group members with roles
- **Group selector** - Switch between different groups seamlessly

### 📝 Content Creation & Interaction
- **Posts** - Share text, photos, and videos with your group members
- **Media Upload** - Support for images (JPG, PNG, GIF, WebP) and videos (MP4, AVI, MOV, WebM)
- **File Validation** - Automatic file type and size validation (50MB max)
- **Media Preview** - Real-time preview before posting
- **Events** - Plan trips, goals, and meetings with different event types
- **Comments** - Engage with posts through threaded comments
- **Reactions** - React with emojis (like, love, laugh, wow, sad, angry)
- **Real-time updates** - Automatic refresh after content creation

### 🔐 Security & Authentication
- **JWT Authentication** - Secure token-based authentication
- **Group-based login** - Login with group name, username, and password
- **Credential management** - Change username and password securely
- **Session persistence** - Automatic login state management
- **Protected routes** - Authentication-gated content access

### 🎨 Modern UI/UX
- **Futuristic design** - Gradient backgrounds and glassmorphism effects
- **Responsive layout** - Optimized for desktop, tablet, and mobile
- **Material-UI components** - Professional, accessible components
- **Dark theme** - Eye-friendly interface with consistent styling
- **Interactive elements** - Hover effects and smooth transitions

### 📚 Built-in Documentation
- **Comprehensive help system** - Accessible via the app interface
- **API reference** - Complete endpoint documentation
- **Feature guides** - Step-by-step usage instructions

## 🏗️ Architecture

### Technology Stack
- **React 19.1.0** - Modern UI library with hooks
- **TypeScript 4.9.5** - Type safety and better development experience
- **Material-UI 7.1.2** - Professional component library
- **React Router 7.6.2** - Client-side routing
- **Axios 1.10.0** - HTTP client for API communication
- **Context API** - State management for authentication and groups

### Project Structure
```
src/
├── components/          # Reusable UI components
│   └── BondedLogo.tsx  # Application logo component
├── config/             # Configuration files
│   └── api.ts         # API client configuration
├── assets/            # Static assets
│   └── logos/         # Logo files
├── App.tsx            # Main application component
├── index.tsx          # Application entry point
└── index.css          # Global styles
```

### Key Components

#### Authentication System
- **Login** - Group-based authentication with credential validation
- **Credential Change** - Secure username and password updates
- **AuthGate** - Route protection and session management
- **Logout** - Secure session termination

#### Group Management
- **GroupProvider** - Context for group state management
- **GroupSelector** - Interface for switching between groups
- **Dashboard** - Main group interface with posts, events, and members

#### Content Management
- **Posts** - Text content creation and display
- **Events** - Event planning and management
- **Comments** - Post interaction system
- **Reactions** - Emoji-based reactions

## 🚀 Getting Started

### Prerequisites
- Node.js 16.0.0 or higher
- npm 8.0.0 or higher
- Backend API server running (see backend documentation)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd bonded/frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure API endpoint**
Create or update `src/config/api.ts` with your backend URL:
```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
```

4. **Start development server**
```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000).

## 📦 Available Scripts

### Development
- **`npm start`** - Runs the app in development mode with hot reload
- **`npm test`** - Launches the test runner in interactive watch mode
- **`npm run test:coverage`** - Runs tests with coverage report
- **`npm run lint`** - Checks code for linting errors
- **`npm run lint:fix`** - Automatically fixes linting issues
- **`npm run type-check`** - Performs TypeScript type checking

### Production
- **`npm run build`** - Creates optimized production build
- **`npm run build:production`** - Production build without source maps
- **`npm run analyze`** - Analyzes bundle size and serves build

### Maintenance
- **`npm run eject`** - Ejects from Create React App (one-way operation)

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:8000/api

# Environment
REACT_APP_ENVIRONMENT=development
REACT_APP_VERSION=1.4.0

# Optional: Analytics
REACT_APP_GA_TRACKING_ID=your-ga-tracking-id
```

### API Configuration

The application uses Axios for API communication with automatic token management:

```typescript
// Automatic token injection
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Automatic logout on 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 🎨 UI/UX Features

### Design System
- **Color Palette** - Purple and blue gradients with white text
- **Typography** - Material-UI typography scale
- **Spacing** - Consistent 8px grid system
- **Shadows** - Subtle elevation effects
- **Borders** - Rounded corners and glassmorphism

### Responsive Design
- **Mobile-first** approach
- **Breakpoints** - xs, sm, md, lg, xl
- **Flexible layouts** - Grid and flexbox systems
- **Touch-friendly** - Appropriate button sizes and spacing

### Accessibility
- **ARIA labels** - Screen reader support
- **Keyboard navigation** - Full keyboard accessibility
- **Color contrast** - WCAG AA compliant
- **Focus management** - Clear focus indicators

## 🔐 Security Features

### Authentication Flow
1. **Group Registration** - Create new groups with member credentials
2. **Credential Setup** - Initial username/password configuration
3. **Group Login** - Authenticate with group context
4. **Token Management** - Automatic JWT token handling
5. **Session Persistence** - Remember login state across sessions

### Data Protection
- **HTTPS only** - Secure communication in production
- **Token expiration** - Automatic token refresh handling
- **XSS protection** - React's built-in XSS protection
- **CSRF protection** - Backend CSRF token validation

## 📱 User Experience

### Onboarding Flow
1. **Welcome Page** - Application introduction and features
2. **Group Registration** - Create or join existing groups
3. **Credential Setup** - Set personal username and password
4. **Group Selection** - Choose active group for interaction
5. **Dashboard** - Main application interface

### Navigation
- **Intuitive routing** - Clear navigation structure
- **Breadcrumbs** - Context-aware navigation
- **Quick actions** - Easy access to common features
- **Search functionality** - Find content quickly

### Real-time Features
- **Auto-refresh** - Content updates automatically
- **Optimistic updates** - Immediate UI feedback
- **Error handling** - Graceful error recovery
- **Loading states** - Clear loading indicators

## 🧪 Testing

### Test Structure
```bash
npm test                    # Run tests in watch mode
npm run test:coverage      # Generate coverage report
npm run type-check         # TypeScript validation
```

### Testing Strategy
- **Unit tests** - Component and utility testing
- **Integration tests** - API interaction testing
- **E2E tests** - User flow testing
- **Accessibility tests** - Screen reader compatibility

## 🚀 Deployment

### Production Build
```bash
npm run build:production
```

### Deployment Options
- **Vercel** - Optimized for React applications
- **Netlify** - Static site hosting with CI/CD
- **AWS S3 + CloudFront** - Scalable static hosting
- **GitHub Pages** - Free hosting for open source

### Environment Setup
1. Set production environment variables
2. Configure API endpoint for production
3. Enable HTTPS and security headers
4. Set up monitoring and analytics

## 📊 Performance

### Optimization Features
- **Code splitting** - Automatic route-based splitting
- **Lazy loading** - Component-level lazy loading
- **Bundle optimization** - Tree shaking and minification
- **Image optimization** - Compressed and responsive images
- **Caching** - Browser and CDN caching strategies

### Monitoring
- **Core Web Vitals** - Performance metrics tracking
- **Error tracking** - Automatic error reporting
- **User analytics** - Usage pattern analysis
- **Performance budgets** - Bundle size monitoring

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

### Code Standards
- **TypeScript** - Strict type checking enabled
- **ESLint** - Code quality enforcement
- **Prettier** - Consistent code formatting
- **Conventional commits** - Standardized commit messages

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Documentation
- **Built-in help** - Access via the application interface
- **API documentation** - Complete endpoint reference
- **Component library** - Material-UI documentation

### Troubleshooting
- **Common issues** - Check the troubleshooting guide
- **Performance** - Monitor Core Web Vitals
- **Security** - Review security best practices

### Community
- **Issues** - Report bugs and feature requests
- **Discussions** - Community support and ideas
- **Contributions** - Help improve the project

---

**Bonded Frontend v1.4.0** - Building stronger connections through private social spaces with rich media sharing.
