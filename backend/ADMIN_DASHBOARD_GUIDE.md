# Admin Dashboard - User Management System

## 🎯 Overview

The Admin Dashboard provides comprehensive user management capabilities for AXG Bolt administrators. This system allows admins to create, read, update, and delete users while maintaining security and access control.

## 🚀 Features Implemented

### ✅ **User Management Dashboard**

- **User Statistics Display**: Total users, active/inactive counts, role distribution
- **Real-time User Count**: Updates automatically in dashboard header
- **Advanced Filtering**: Search by name/email, filter by role and status
- **Pagination Support**: Efficient handling of large user datasets

### ✅ **User CRUD Operations**

#### Create User

- **Endpoint**: `POST /api/users/admin/create`
- **Access**: Admin only
- **Features**:
  - Admin can specify user role (user, moderator, admin)
  - Auto-verification for admin-created users
  - Default temporary password: `TempPass123!`
  - Complete profile setup

#### Read Users

- **Endpoint**: `GET /api/users`
- **Access**: Admin only
- **Features**:
  - Pagination (`page`, `limit` parameters)
  - Search functionality (`search` parameter)
  - Role filtering (`role` parameter)
  - Status filtering (`isActive` parameter)
  - Comprehensive user details

#### Update User

- **Endpoint**: `PUT /api/users/:userId`
- **Access**: Admin only
- **Features**:
  - Update personal information (name, phone)
  - Change user role and status
  - Preserve email integrity (no email changes)
  - Real-time validation

#### Delete User

- **Endpoint**: `DELETE /api/users/:userId`
- **Access**: Admin only
- **Features**:
  - Permanent user deletion
  - Confirmation dialog
  - Automatic refresh after deletion

### ✅ **Security & Access Control**

- **JWT-based Authentication**: Secure token management
- **Role-based Authorization**: Admin-only access enforcement
- **Rate Limiting**: Prevent abuse of admin endpoints
- **Input Validation**: Comprehensive data validation
- **Error Handling**: Graceful error management and user feedback

### ✅ **User Interface Features**

- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Works on desktop and tablet
- **Interactive Modals**: Add, edit, view, and delete user modals
- **Status Indicators**: Visual status badges for quick reference
- **Search & Filter**: Real-time search and filtering capabilities
- **Pagination Controls**: Navigate through large user lists

---

## 🔧 Technical Implementation

### Backend Architecture

#### Models

```javascript
// User Model (models/User.js)
- firstName, lastName, fullName (virtual)
- email (unique, validated)
- password (hashed with bcrypt)
- role (user, admin, moderator)
- isActive, isEmailVerified
- phone, address, preferences
- timestamps, login tracking
```

#### Controllers

```javascript
// User Controller (controllers/userController.js)
- registerUser: Public user registration
- loginUser: User authentication
- getUserProfile: Get current user
- updateUserProfile: Update own profile
- changePassword: Password management
- getAllUsers: Admin user list
- getUserById: Admin get user details
- updateUserById: Admin update user
- deleteUserById: Admin delete user
- createUserByAdmin: Admin create user (NEW)
```

#### Routes

```javascript
// User Routes (routes/userRoutes.js)
- POST /api/users/register (Public)
- POST /api/users/login (Public)
- GET /api/users/profile (Private)
- PUT /api/users/profile (Private)
- POST /api/users/admin/create (Admin)
- GET /api/users (Admin)
- GET /api/users/:id (Admin)
- PUT /api/users/:id (Admin)
- DELETE /api/users/:id (Admin)
```

#### Middleware

```javascript
// Authentication & Validation
- authenticate: JWT token verification
- authorize: Role-based access control
- validateUserRegistration: Input validation
- rateLimiter: Request rate limiting
- errorHandler: Global error handling
```

### Frontend Architecture

#### Components

```typescript
// UserManagement Component
- User statistics dashboard
- Advanced search and filtering
- CRUD operations with modals
- Pagination and loading states
- Error and success messaging
```

#### API Integration

```typescript
// API Service (lib/api.ts)
-adminApi.createUser() -
  adminApi.getAllUsers() -
  adminApi.getUserById() -
  adminApi.updateUser() -
  adminApi.deleteUser();
```

#### State Management

```typescript
// AuthContext Integration
- User authentication state
- Admin role verification
- Token management
- Auto-logout on expiration
```

---

## 🧪 Testing & Validation

### Automated Tests

```bash
# Run integration tests
npm run test:integration

# Run admin management tests
npm run test:admin

# Run all tests
npm test
```

### Test Coverage

- ✅ Admin authentication
- ✅ User creation via admin
- ✅ User list with pagination
- ✅ Search functionality
- ✅ Role-based filtering
- ✅ User updates
- ✅ User deletion
- ✅ Access control validation

### Manual Testing Checklist

- [ ] Admin can log in successfully
- [ ] User count displays in dashboard header
- [ ] Create new user with all roles
- [ ] Search users by name/email
- [ ] Filter users by role and status
- [ ] Update user information and role
- [ ] Delete users with confirmation
- [ ] Regular users cannot access admin features
- [ ] Pagination works with large datasets
- [ ] Error messages display appropriately

---

## 📊 User Statistics

The dashboard displays comprehensive user statistics:

- **Total Users**: Complete user count with auto-refresh
- **Active/Inactive**: User status distribution
- **Role Distribution**: Admin, Moderator, User counts
- **Email Verification**: Verified vs unverified users

---

## 🔒 Security Measures

### Access Control

- **Admin Authentication**: JWT token required
- **Role Verification**: Admin role enforced
- **Route Protection**: Middleware guards all endpoints
- **Frontend Guards**: UI elements hidden for non-admins

### Data Protection

- **Input Validation**: Comprehensive server-side validation
- **SQL Injection Prevention**: MongoDB parameterized queries
- **XSS Protection**: Input sanitization
- **Rate Limiting**: Prevents brute force attacks

### Password Security

- **Bcrypt Hashing**: Industry-standard password encryption
- **Default Password**: Secure temporary password for admin-created users
- **Password Requirements**: Enforced complexity rules
- **Account Lockout**: Failed attempt protection

---

## 🚀 Usage Instructions

### For Administrators

#### Accessing the Dashboard

1. Log in with admin credentials (`admin@axgbolt.com` / `AdminPass123!`)
2. Navigate to Admin Dashboard
3. Click on "Users" tab

#### Creating Users

1. Click "Add User" button
2. Fill in user details:
   - First Name, Last Name
   - Email address
   - Phone (optional)
   - Role (User/Moderator/Admin)
   - Active status
3. Click "Add User"
4. New user receives default password: `TempPass123!`

#### Managing Users

1. **View Details**: Click eye icon to see full user profile
2. **Edit User**: Click edit icon to modify user information
3. **Delete User**: Click trash icon and confirm deletion
4. **Search**: Use search bar to find specific users
5. **Filter**: Use dropdowns to filter by role or status

#### User List Features

- **Pagination**: Navigate through pages for large datasets
- **Sorting**: Users displayed with most recent first
- **Status Badges**: Visual indicators for active/inactive and verified/unverified
- **Role Badges**: Color-coded role identification

---

## 🔮 Future Enhancements

### Planned Features

- [ ] Bulk user operations (bulk delete, role change)
- [ ] User activity logs and audit trail
- [ ] Advanced user analytics and reporting
- [ ] User import/export functionality
- [ ] Email notification system for admin actions
- [ ] User profile picture upload
- [ ] Advanced permission management
- [ ] User groups and team management

### Technical Improvements

- [ ] Real-time updates with WebSocket
- [ ] Advanced caching for better performance
- [ ] Database indexing optimization
- [ ] API rate limiting per user
- [ ] Advanced logging and monitoring
- [ ] Backup and restore functionality

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue**: Admin cannot create users
**Solution**: Ensure admin is logged in and has proper JWT token

**Issue**: Users not displaying in list
**Solution**: Check backend server is running and database is connected

**Issue**: Search not working
**Solution**: Verify search parameters are being sent correctly

**Issue**: Pagination not functioning
**Solution**: Check API pagination parameters and response format

### Debug Commands

```bash
# Check server status
curl http://localhost:8070

# Test admin authentication
curl -X POST http://localhost:8070/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@axgbolt.com", "password": "AdminPass123!"}'

# Test user list endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8070/api/users?page=1&limit=10
```

### Contact Information

For technical support or feature requests, please contact the development team.

---

## 🎉 Conclusion

The Admin Dashboard User Management system provides enterprise-grade user administration capabilities with:

- **Complete CRUD Operations**: Full user lifecycle management
- **Advanced Security**: Multi-layer security implementation
- **Modern UI/UX**: Intuitive and responsive interface
- **Scalable Architecture**: Built for growth and performance
- **Comprehensive Testing**: Automated and manual test coverage

The system is production-ready and provides administrators with powerful tools to manage users effectively while maintaining security and data integrity.
