# 🔐 Password Manager

<div align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/MongoDB-6.0+-green?style=for-the-badge&logo=mongodb" alt="MongoDB">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License">
</div>

<div align="center">
  <h3>🌐 <a href="https://password-manager-22du.onrender.com/">Live Demo</a></h3>
  <p>A secure, full-stack password management application with enterprise-grade encryption</p>
</div>

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Security](#-security)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔒 Security Features
- **AES-256-CBC Encryption** with PBKDF2 key derivation (100k iterations)
- **Two-Factor Authentication (2FA)** via email OTP
- **Master Password Protection** for all sensitive operations
- **Auto-hide Passwords** after 10 seconds
- **Copy Protection** to prevent unauthorized access
- **Comprehensive Audit Logging** for compliance

### 🚀 Core Functionality
- **Password CRUD Operations** (Create, Read, Update, Delete)
- **Secure Password Generation** with customizable criteria
- **Real-time Search & Filtering**
- **Pagination** for large datasets
- **Responsive Design** for all devices
- **Email Notifications** via Gmail SMTP

### 📊 User Experience
- **Modern UI/UX** with shadcn/ui components
- **Dark/Light Theme** support
- **Real-time Validation** and feedback
- **Progressive Web App** capabilities

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service

### DevOps & Deployment
- **Render** - Cloud hosting platform
- **MongoDB Atlas** - Cloud database
- **Gmail SMTP** - Email delivery
- **Git** - Version control

## 🏗 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │────│  Express API    │────│   MongoDB       │
│                 │    │                 │    │                 │
│ • Components    │    │ • Controllers   │    │ • Users         │
│ • Pages         │    │ • Services      │    │ • Passwords     │
│ • Utils         │    │ • Middleware    │    │ • Audit Logs    │
│ • Hooks         │    │ • Routes        │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Security Layer
```
┌───────────────────────────────────────────────────────────┐
│                     Security Pipeline                       │
├───────────────────────────────────────────────────────────┤
│ JWT Auth → Master Password → AES Encryption → Audit Log    │
└───────────────────────────────────────────────────────────┘
```

## 🔐 Security

### Encryption Standards
- **AES-256-CBC** encryption for password storage
- **PBKDF2** key derivation with 100,000 iterations
- **bcrypt** for master password hashing
- **JWT** tokens for session management

### Security Measures
- Input validation and sanitization
- CORS protection
- Rate limiting
- SQL injection prevention
- XSS protection
- CSRF protection

### Compliance
- Comprehensive audit logging
- Data encryption at rest
- Secure communication (HTTPS)
- Privacy-focused design

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 6.0+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd password-manager
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   
   # Configure your environment variables
   ```

4. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev
   
   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 📁 Project Structure

```
password-manager/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   └── hooks/         # Custom React hooks
│   ├── public/            # Static assets
│   └── README.md          # Frontend documentation
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   ├── middleware/       # Custom middleware
│   └── README.md         # Backend documentation
├── docs/                 # Additional documentation
└── README.md            # Main project documentation
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /users/register` - User registration
- `POST /users/login` - User login
- `POST /users/verify-otp` - OTP verification
- `PUT /users/change-password` - Change master password

### Password Management
- `GET /passwords` - Get user passwords (paginated)
- `POST /passwords` - Create new password
- `PUT /passwords/:id` - Update password
- `DELETE /passwords/:id` - Delete password

### Security Features
- `POST /passwords/:id/view` - View password (with audit)
- `POST /passwords/:id/copy` - Copy password (with audit)

For detailed API documentation, see [server/README.md](./server/README.md)

## 🚀 Deployment

### Production Deployment (Render)

1. **Backend Deployment**
   - Connect GitHub repository to Render
   - Set environment variables
   - Deploy with `npm start`

2. **Frontend Deployment**
   - Build with `npm run build`
   - Deploy static files
   - Configure API endpoints

3. **Environment Variables**
   ```env
   NODE_ENV=production
   DB_KEY=mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GMAIL_USER=your_email
   GMAIL_APP_PASSWORD=your_app_password
   PASSWORD_SECRET=encryption_secret
   FRONTEND_URL=your_frontend_url
   ```

For detailed deployment instructions, see deployment guides in respective README files.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Lucide](https://lucide.dev/) for the icon set
- [Render](https://render.com/) for hosting platform
- [MongoDB Atlas](https://www.mongodb.com/atlas) for database hosting

---

<div align="center">
  <p>Made with ❤️ for secure password management</p>
  <p>⭐ Star this repository if you found it helpful!</p>
</div>