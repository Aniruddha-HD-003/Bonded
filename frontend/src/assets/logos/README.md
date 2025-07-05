# Bonded Logo Assets

This directory contains the custom logo assets for the Bonded social platform.

## Available Logos

### 1. `bonded-logo.svg` - Main Logo
- **Size**: 200x200px
- **Usage**: Main application logo, AppBar, branding
- **Features**: Gradient background, connection lines representing bonds
- **Colors**: Purple gradient (#667eea to #764ba2)

### 2. `bonded-text.svg` - Text Logo
- **Size**: 300x100px
- **Usage**: Text-based branding, headers, documentation
- **Features**: Gradient text with subtitle
- **Colors**: Purple gradient text with gray subtitle

### 3. `favicon.svg` - Favicon
- **Size**: 32x32px
- **Usage**: Browser tab icon, bookmarks
- **Features**: Simplified circular design with "B"
- **Colors**: Purple gradient background

## How to Use

### In React Components
```tsx
import BondedLogo from './assets/logos/bonded-logo.svg';
import BondedText from './assets/logos/bonded-text.svg';

// Usage
<img src={BondedLogo} alt="Bonded Logo" style={{ width: '40px', height: '40px' }} />
```

### In HTML
```html
<img src="/src/assets/logos/bonded-logo.svg" alt="Bonded Logo" />
```

### As Favicon
```html
<link rel="icon" href="/src/assets/logos/favicon.svg" type="image/svg+xml" />
```

## Customization

### Colors
The logos use a purple gradient that matches the app theme:
- Primary: `#667eea`
- Secondary: `#764ba2`

### Sizing
- **Small**: 24x24px (icons, buttons)
- **Medium**: 40x40px (AppBar, navigation)
- **Large**: 80x80px (hero sections, cards)
- **Extra Large**: 200x200px (main logo display)

## File Structure
```
src/assets/logos/
├── bonded-logo.svg      # Main circular logo
├── bonded-text.svg      # Text-based logo
├── favicon.svg          # Browser favicon
└── README.md           # This guide
```

## Design Principles

1. **Consistency**: All logos use the same color palette
2. **Scalability**: SVG format ensures crisp display at any size
3. **Simplicity**: Clean, modern design that works across platforms
4. **Branding**: Represents the "bonded" concept with connection elements 