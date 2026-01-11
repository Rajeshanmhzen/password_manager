# 🎨 Password Manager - Frontend

<div align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Vite-4.4+-purple?style=for-the-badge&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/TailwindCSS-3.3+-blue?style=for-the-badge&logo=tailwindcss" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Features](#-features)
- [Components](#-components)
- [Environment Setup](#-environment-setup)
- [Development](#-development)
- [Build & Deployment](#-build--deployment)

## 🎯 Overview

Modern React frontend for the Password Manager application. Built with Vite for fast development, TailwindCSS for styling, and shadcn/ui for beautiful components. Features responsive design, real-time validation, and comprehensive security measures.

## 🛠 Tech Stack

- **Framework:** React 18 with Hooks
- **Build Tool:** Vite (Fast HMR & optimized builds)
- **Styling:** TailwindCSS + shadcn/ui components
- **HTTP Client:** Axios with interceptors
- **Routing:** React Router DOM
- **Icons:** Lucide React
- **State Management:** React Context + useState/useEffect
- **Form Handling:** Custom hooks with validation
- **Security:** Copy protection, auto-hide passwords

## 📁 Project Structure

```
client/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   │   ├── button.jsx
│   │   │   ├── input.jsx
│   │   │   ├── dialog.jsx
│   │   │   └── ...
│   │   └── common/          # Shared components
│   │       ├── Header.jsx
│   │       ├── Footer.jsx
│   │       └── LoadingSpinner.jsx
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── VerifyOTP.jsx
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── PasswordItem.jsx
│   │   │   ├── AddPassword.jsx
│   │   │   ├── EditPassword.jsx
│   │   │   └── ChangePassword.jsx
│   │   ├── AppRoutes.jsx    # Route configuration
│   │   └── NotFound.jsx
│   ├── utils/
│   │   ├── GetURL.js        # API URL configuration
│   │   ├── api.js           # Axios configuration
│   │   └── helpers.js       # Utility functions
│   ├── hooks/
│   │   ├── useAuth.js       # Authentication hook
│   │   └── useLocalStorage.js
│   ├── styles/
│   │   └── globals.css      # Global styles
│   ├── App.jsx              # Main app component
│   └── main.jsx            # React entry point
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## ✨ Features

### 🔐 Security Features
- **Master Password Dialogs** for sensitive operations
- **Auto-hide Passwords** after 10 seconds
- **Copy Protection** prevents text selection
- **JWT Token Management** with automatic refresh
- **Secure Form Validation** with real-time feedback

### 🎨 User Interface
- **Responsive Design** works on all devices
- **Modern UI Components** using shadcn/ui
- **Dark/Light Theme** support (configurable)
- **Loading States** and error handling
- **Toast Notifications** for user feedback

### 🚀 Performance
- **Fast Development** with Vite HMR
- **Optimized Builds** with code splitting
- **Lazy Loading** for route components
- **Efficient Re-renders** with React optimization

### 📱 User Experience
- **Intuitive Navigation** with React Router
- **Form Validation** with instant feedback
- **Search & Filter** functionality
- **Pagination** for large datasets
- **Keyboard Shortcuts** for power users

## 🧩 Components

### Core Components

#### Authentication Components
```jsx
// Login.jsx - User authentication
<LoginForm onSubmit={handleLogin} />

// Register.jsx - User registration
<RegisterForm onSubmit={handleRegister} />

// VerifyOTP.jsx - Two-factor authentication
<OTPInput onVerify={handleOTPVerify} />
```

#### Dashboard Components
```jsx
// Dashboard.jsx - Main password management interface
<PasswordList 
  passwords={passwords}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onView={handleView}
/>

// PasswordItem.jsx - Individual password display
<PasswordItem 
  password={passwordData}
  onMasterPasswordVerify={handleVerify}
  autoHideTimeout={10000}
/>

// AddPassword.jsx - New password creation
<AddPasswordForm 
  onSubmit={handleAddPassword}
  onCancel={handleCancel}
/>
```

#### UI Components (shadcn/ui)
```jsx
// Reusable UI components
<Button variant="default" size="lg">Save Password</Button>
<Input type="password" placeholder="Enter password" />
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>...</DialogContent>
</Dialog>
```

### Custom Hooks

#### useAuth Hook
```jsx
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  const login = async (credentials) => {
    // Login logic
  };
  
  const logout = () => {
    // Logout logic
  };
  
  return { user, token, login, logout, isAuthenticated: !!token };
};
```

#### useLocalStorage Hook
```jsx
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  
  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };
  
  return [storedValue, setValue];
};
```

## ⚙️ Environment Setup

### API Configuration

The frontend uses a utility function to determine the API URL:

```javascript
// src/utils/GetURL.js
export const getURL = () => {
  return !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://your-backend-api.onrender.com";
};
```

### Optional Environment Variables

Create a `.env` file in the client directory (optional):

```env
# Development
VITE_API_URL=http://localhost:3000

# Production (automatically handled by GetURL.js)
VITE_API_URL=https://your-backend-api.onrender.com

# Feature flags
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_PWA=true
```

## 🚀 Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend API running

### Installation & Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
# Development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type check (if using TypeScript)
npm run type-check
```

### Development Workflow

1. **Start Development Server**
   ```bash
   npm run dev
   # Server runs on http://localhost:5173
   ```

2. **Component Development**
   - Create components in appropriate directories
   - Use shadcn/ui components for consistency
   - Follow React best practices

3. **Styling Guidelines**
   - Use TailwindCSS utility classes
   - Follow mobile-first responsive design
   - Maintain consistent spacing and colors

4. **State Management**
   - Use React Context for global state
   - Local state with useState for component-specific data
   - Custom hooks for reusable logic

### Code Style Guidelines

#### Component Structure
```jsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const ComponentName = ({ prop1, prop2 }) => {
  // Hooks
  const { user } = useAuth();
  const [state, setState] = useState(initialValue);
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // Event handlers
  const handleEvent = () => {
    // Handler logic
  };
  
  // Render
  return (
    <div className="container mx-auto p-4">
      {/* Component JSX */}
    </div>
  );
};

export default ComponentName;
```

#### TailwindCSS Best Practices
```jsx
// Good: Semantic class grouping
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  
// Good: Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Good: State-based styling
<button className={`px-4 py-2 rounded ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
```

## 🏗 Build & Deployment

### Production Build

```bash
# Create optimized production build
npm run build

# Output directory: dist/
# - Minified JavaScript and CSS
# - Optimized images and assets
# - Service worker (if PWA enabled)
```

### Deployment Options

#### 1. Render (Recommended)
```bash
# Build settings in Render dashboard:
Build Command: npm install && npm run build
Publish Directory: dist
Node Version: 18+
```

#### 2. Netlify
```bash
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 3. Vercel
```bash
# vercel.json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

### Performance Optimization

#### Bundle Analysis
```bash
# Analyze bundle size
npm run build -- --analyze

# Or use bundle analyzer
npm install -g webpack-bundle-analyzer
npx webpack-bundle-analyzer dist/assets
```

#### Optimization Techniques
- **Code Splitting:** Automatic with Vite
- **Tree Shaking:** Dead code elimination
- **Asset Optimization:** Image compression and lazy loading
- **Caching:** Browser caching with versioned assets

### Security Considerations

#### Content Security Policy
```html
<!-- Add to index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;">
```

#### Environment Variables Security
- Never expose sensitive data in frontend environment variables
- Use `VITE_` prefix for public environment variables
- Backend API handles all sensitive operations

## 📊 Performance Metrics

### Target Metrics
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1
- **First Input Delay:** < 100ms

### Monitoring Tools
- Lighthouse CI for performance audits
- Web Vitals for real user metrics
- Bundle analyzer for size optimization

---

<div align="center">
  <p>🎨 Crafted with modern web technologies</p>
  <p>🚀 Optimized for performance and user experience</p>
</div>