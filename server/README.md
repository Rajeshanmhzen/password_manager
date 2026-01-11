# 🔧 Password Manager - Backend API

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-4.18+-black?style=for-the-badge&logo=express" alt="Express">
  <img src="https://img.shields.io/badge/MongoDB-6.0+-green?style=for-the-badge&logo=mongodb" alt="MongoDB">
  <img src="https://img.shields.io/badge/JWT-Auth-orange?style=for-the-badge" alt="JWT">
</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Security](#-security)
- [Environment Setup](#-environment-setup)
- [Development](#-development)
- [Deployment](#-deployment)

## 🎯 Overview

RESTful API backend for the Password Manager application built with Node.js and Express. Provides secure authentication, password management, and comprehensive audit logging with enterprise-grade encryption.

## 🛠 Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Encryption:** AES-256-CBC, PBKDF2, bcryptjs
- **Email:** Nodemailer with Gmail SMTP
- **Validation:** Express-validator
- **Security:** CORS, Helmet, Rate limiting

## 📁 Project Structure

```
server/
├── bin/
│   └── www                 # Server startup script
├── controllers/
│   ├── users.js           # User authentication logic
│   └── passwords.js       # Password management logic
├── models/
│   ├── User.js           # User schema
│   ├── Password.js       # Password schema
│   └── auditLog.js       # Audit log schema
├── routes/
│   ├── index.js          # Root routes
│   ├── users.js          # User routes
│   └── passwords.js      # Password routes
├── services/
│   └── mailService.js    # Email service
├── utils/
│   └── auditLogger.js    # Audit logging utility
├── middleware/
│   └── auth.js           # Authentication middleware
├── app.js                # Express app configuration
├── package.json          # Dependencies and scripts
└── .env                  # Environment variables
```

## 🔌 API Endpoints

### Authentication Routes (`/users`)

#### Register User
```http
POST /users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123"
}
```

**Response:**
```json
{
  "message": "User registered successfully. Please verify your email.",
  "userId": "user_id_here"
}
```

#### Login User
```http
POST /users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "OTP sent to your email",
  "tempToken": "temporary_jwt_token"
}
```

#### Verify OTP
```http
POST /users/verify-otp
Content-Type: application/json
Authorization: Bearer <tempToken>

{
  "otp": "123456"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_access_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  }
}
```

#### Change Password
```http
PUT /users/change-password
Content-Type: application/json
Authorization: Bearer <token>

{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

### Password Management Routes (`/passwords`)

#### Get All Passwords
```http
GET /passwords?page=1&limit=10
Authorization: Bearer <token>
```

**Response:**
```json
{
  "passwords": [
    {
      "id": "password_id",
      "website": "example.com",
      "username": "user@example.com",
      "encryptedPassword": "encrypted_data",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### Create Password
```http
POST /passwords
Content-Type: application/json
Authorization: Bearer <token>

{
  "website": "example.com",
  "username": "user@example.com",
  "password": "userPassword123",
  "masterPassword": "userMasterPassword"
}
```

#### Update Password
```http
PUT /passwords/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "website": "updated-example.com",
  "username": "updated@example.com",
  "password": "newPassword123",
  "masterPassword": "userMasterPassword"
}
```

#### Delete Password
```http
DELETE /passwords/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "masterPassword": "userMasterPassword"
}
```

#### View Password (Decrypt)
```http
POST /passwords/:id/view
Content-Type: application/json
Authorization: Bearer <token>

{
  "masterPassword": "userMasterPassword"
}
```

**Response:**
```json
{
  "password": "decryptedPassword123"
}
```

## 🔐 Security

### Encryption Implementation

#### Password Encryption (AES-256-CBC)
```javascript
// Key derivation using PBKDF2
const key = crypto.pbkdf2Sync(masterPassword, salt, 100000, 32, 'sha256');

// Encryption
const cipher = crypto.createCipher('aes-256-cbc', key);
const encrypted = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');
```

#### Master Password Hashing (bcrypt)
```javascript
const saltRounds = 12;
const hashedPassword = await bcrypt.hash(password, saltRounds);
```

### Security Features

- **JWT Authentication** with expiration
- **Master Password Verification** for sensitive operations
- **Rate Limiting** to prevent brute force attacks
- **Input Validation** and sanitization
- **CORS Protection** with allowed origins
- **Audit Logging** for all user actions

### Audit Log Events
- `VIEW_PASSWORD` - Password decryption
- `COPY_PASSWORD` - Password copy action
- `ADD_PASSWORD` - New password creation
- `EDIT_PASSWORD` - Password modification
- `DELETE_PASSWORD` - Password deletion

## ⚙️ Environment Setup

### Required Environment Variables

Create a `.env` file in the server directory:

```env
# Environment Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
DB_KEY=mongodb://localhost:27017/password-manager
# Or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# Gmail Configuration for 2FA emails
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password

# Encryption Configuration
PASSWORD_SECRET=your-encryption-secret-key-minimum-32-characters
ALGORITHM=aes-256-gcm
IV_LENGTH=16

# Frontend URL for CORS (Production)
FRONTEND_URL=https://your-frontend-domain.com
```

### Gmail App Password Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account Settings → Security → App passwords
3. Generate an app password for "Mail"
4. Use this password in `GMAIL_APP_PASSWORD`

## 🚀 Development

### Prerequisites
- Node.js 18+
- MongoDB 6.0+ (local or Atlas)
- Git

### Installation & Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure your environment variables
nano .env

# Start development server
npm run dev
```

### Available Scripts

```bash
# Development with auto-reload
npm run dev

# Production start
npm start

# Production with NODE_ENV
npm run prod
```

### Development Workflow

1. **Database Connection**
   - Ensure MongoDB is running locally or configure Atlas connection
   - Database will be created automatically on first connection

2. **Testing API Endpoints**
   - Use Postman, Insomnia, or curl
   - Base URL: `http://localhost:3000`
   - Include JWT token in Authorization header for protected routes

3. **Debugging**
   - Check console logs for database connection status
   - Monitor audit logs in database
   - Use MongoDB Compass for database inspection

## 🚀 Deployment

### Render Deployment

1. **Prepare for Production**
   ```bash
   # Ensure production dependencies are installed
   npm install --production
   
   # Test production build
   npm run prod
   ```

2. **Environment Variables (Render Dashboard)**
   ```env
   NODE_ENV=production
   PORT=3000
   DB_KEY=mongodb+srv://user:pass@cluster.mongodb.net/db
   JWT_SECRET=your-production-jwt-secret
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-app-password
   PASSWORD_SECRET=your-production-encryption-secret
   FRONTEND_URL=https://your-frontend-domain.com
   ```

3. **Render Configuration**
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Node Version:** 18+

### MongoDB Atlas Setup

1. Create MongoDB Atlas cluster
2. Configure network access (0.0.0.0/0 for Render)
3. Create database user
4. Get connection string
5. Update `DB_KEY` environment variable

### Security Checklist for Production

- [ ] Strong JWT secret (32+ characters)
- [ ] Strong encryption secret (32+ characters)
- [ ] MongoDB Atlas with authentication
- [ ] Gmail app password configured
- [ ] CORS origins properly configured
- [ ] Environment variables secured
- [ ] HTTPS enabled
- [ ] Rate limiting configured

## 📊 Monitoring & Logs

### Application Logs
- Server startup and database connection
- Authentication attempts
- API request/response logs
- Error tracking and stack traces

### Audit Logs (Database)
```javascript
{
  userId: ObjectId,
  action: "VIEW_PASSWORD",
  targetId: ObjectId,
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0...",
  timestamp: ISODate,
  details: {}
}
```

### Performance Monitoring
- Response time tracking
- Database query performance
- Memory usage monitoring
- Error rate tracking

---

<div align="center">
  <p>🔒 Built with security and scalability in mind</p>
  <p>📧 For questions: <a href="mailto:support@example.com">support@example.com</a></p>
</div>