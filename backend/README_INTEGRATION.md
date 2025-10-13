# AXG Bolt Backend-Frontend Integration

## 🎉 Integration Complete!

### 👥 User Accounts Created

#### Admin User

- **Email:** `admin@axgbolt.com`
- **Password:** `AdminPass123!`
- **Role:** `admin`
- **Permissions:** Full system access, user management

#### Regular User

- **Email:** `user@axgbolt.com`
- **Password:** `UserPass123!`
- **Role:** `user`
- **Permissions:** Basic user features, profile management

---

## 🚀 Backend API Features

### Authentication Endpoints

- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/forgot-password` - Password reset request
- `POST /api/users/reset-password` - Password reset
- `GET /api/users/verify-email/:token` - Email verification

### User Management Endpoints

- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password

### Admin Endpoints (Admin Only)

- `GET /api/users` - Get all users (with pagination & filtering)
- `GET /api/users/:userId` - Get user by ID
- `PUT /api/users/:userId` - Update user by ID
- `DELETE /api/users/:userId` - Delete user

---

## 🔧 Frontend Integration

### AuthContext Setup

- JWT token management
- User state management
- Role-based access control
- Auto-logout on token expiration

### API Service (api.ts)

- Centralized API calls
- Token authentication
- Error handling
- Type-safe interfaces

### Auth Test Component

- Login/logout functionality
- User profile display
- Role-based UI elements
- Test credentials helper

---

## 🛡️ Security Features

### Authentication & Authorization

- ✅ JWT-based authentication
- ✅ Role-based access control (admin, user, moderator)
- ✅ Account lockout after failed attempts
- ✅ Password strength requirements
- ✅ Email verification system

### Security Middleware

- ✅ Rate limiting (different limits for auth endpoints)
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ Helmet security headers
- ✅ Password hashing with bcrypt

### User Management

- ✅ Admin user creation and management
- ✅ Profile management
- ✅ Password reset functionality
- ✅ Account activation/deactivation
- ✅ User preferences and settings

---

## 🧪 Testing

### Run Integration Tests

\`\`\`bash

# Test backend-frontend integration

npm run test:integration

# Or run directly

node scripts/testIntegration.js
\`\`\`

### Manual Testing

1. **Health Check:** `http://localhost:8070`
2. **Admin Login:** Use admin credentials to test admin features
3. **User Login:** Use user credentials to test user features
4. **Role Access:** Verify users can't access admin endpoints

---

## 🚀 Usage Instructions

### 1. Start Backend Server

\`\`\`bash
cd backend
npm run dev

# Server runs on http://localhost:8070

\`\`\`

### 2. Frontend Integration

Import and use the auth context in your React components:

\`\`\`tsx
import { useAuth } from '../contexts/AuthContext';
import { authApi, adminApi } from '../lib/api';

function MyComponent() {
const { user, isAdmin, signIn, signOut } = useAuth();

// Use authentication methods
const handleLogin = async () => {
const result = await signIn(email, password);
if (result.success) {
console.log('Logged in successfully');
}
};

// Make API calls
const fetchUserProfile = async () => {
const profile = await authApi.getProfile();
console.log(profile);
};
}
\`\`\`

### 3. Test Authentication

Use the `AuthTestComponent` to test login/logout functionality:

\`\`\`tsx
import AuthTestComponent from './components/AuthTestComponent';

function App() {
return (
<div className="App">
<AuthTestComponent />
</div>
);
}
\`\`\`

---

## 📋 API Request Examples

### Login Request

\`\`\`bash
curl -X POST http://localhost:8070/api/users/login \\
-H "Content-Type: application/json" \\
-d '{
"email": "admin@axgbolt.com",
"password": "AdminPass123!"
}'
\`\`\`

### Protected Request

\`\`\`bash
curl -X GET http://localhost:8070/api/users/profile \\
-H "Authorization: Bearer YOUR_JWT_TOKEN"
\`\`\`

### Admin Request

\`\`\`bash
curl -X GET "http://localhost:8070/api/users?page=1&limit=10" \\
-H "Authorization: Bearer ADMIN_JWT_TOKEN"
\`\`\`

---

## 🔄 Next Steps

### Database Management

- User seeding script available: `npm run seed`
- MongoDB integration working
- User roles and permissions implemented

### Frontend Development

- AuthContext ready for use
- API service configured
- Type definitions available
- Error handling implemented

### Production Deployment

- Environment variables configured
- Security middleware enabled
- Error handling implemented
- Rate limiting active

---

## 🎯 Key Benefits

1. **🔐 Enterprise Security:** JWT authentication, role-based access, account lockouts
2. **🚀 Developer Experience:** Type-safe APIs, centralized auth management
3. **🛡️ Protection:** Rate limiting, input validation, secure password handling
4. **📱 Frontend Ready:** React Context, API service, error handling
5. **⚡ Performance:** Efficient token management, optimized queries
6. **🔧 Maintainable:** Clean code structure, comprehensive documentation

The backend and frontend are now fully integrated with complete user authentication and management capabilities!
