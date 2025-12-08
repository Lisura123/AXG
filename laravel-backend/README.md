# AXG Photo Laravel Backend

This is the Laravel backend for the AXG Photo e-commerce application, converted from the original Node.js/Express backend.

## Database Setup

**Database Name:** `axg_database`  
**Database Type:** MySQL (via PHPMyAdmin in XAMPP)

## Requirements

- PHP 8.2+ (included with XAMPP)
- MySQL (included with XAMPP)
- Composer (installed in project root as `composer.phar`)

## Installation

1. **Install Dependencies:**
   ```bash
   cd laravel-backend
   /Applications/XAMPP/xamppfiles/bin/php ../composer.phar install
   ```

2. **Configure Environment:**
   - Database is already configured for `axg_database` in `.env`

3. **Run Migrations:**
   ```bash
   /Applications/XAMPP/xamppfiles/bin/php artisan migrate
   ```

4. **Seed Database:**
   ```bash
   /Applications/XAMPP/xamppfiles/bin/php artisan db:seed
   ```

## Running the Server

Start the Laravel development server:

```bash
/Applications/XAMPP/xamppfiles/bin/php artisan serve --host=127.0.0.1 --port=8001
```

The API will be available at: `http://localhost:8001/api`

## Default Users

After seeding:

**Admin Account:**
- Email: `admin@axgbolt.com`
- Password: `AdminPass123!`

**Regular User:**
- Email: `user@axgbolt.com`
- Password: `UserPass123!`

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout (auth required)
- `GET /api/profile` - Get profile (auth required)
- `PUT /api/profile` - Update profile (auth required)
- `PUT /api/change-password` - Change password (auth required)
- `POST /api/forgot-password` - Request password reset
- `POST /api/reset-password` - Reset password with token
- `GET /api/verify-email/{token}` - Verify email

### Products (Public)
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get single product
- `GET /api/products/featured` - Get featured products
- `GET /api/products/search` - Search products
- `GET /api/products/category/{category}` - Get products by category

### Products (Admin Only)
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin only)

### Reviews
- `GET /api/reviews/product/{productId}` - Get product reviews
- `POST /api/reviews` - Create review (auth required)
- `PUT /api/reviews/{id}` - Update review (owner)
- `DELETE /api/reviews/{id}` - Delete review (owner)
- `POST /api/reviews/{id}/helpful` - Mark helpful
- `POST /api/reviews/{id}/report` - Report review
- `PUT /api/reviews/{id}/status` - Approve/reject (admin)

### Contact
- `POST /api/contacts` - Submit contact form
- `GET /api/contacts` - Get all (admin only)
- `PUT /api/contacts/{id}` - Update (admin only)
- `DELETE /api/contacts/{id}` - Delete (admin only)

### Users (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user
- `POST /api/users/create` - Create user

## Authentication

Uses **Laravel Sanctum** for API tokens. Include in requests:

```
Authorization: Bearer {token}
```

## CORS Configuration

Configured for:
- `http://localhost:5173` (Vite dev)
- `http://127.0.0.1:5173`
- `http://localhost:3000`

## Conversion Summary

Converted from Node.js/Express/MongoDB to Laravel/MySQL:

- ✅ MongoDB → MySQL database
- ✅ Mongoose → Eloquent ORM
- ✅ JWT → Laravel Sanctum
- ✅ express-validator → Laravel Validation
- ✅ Express routes → Laravel routes
- ✅ All controllers converted
- ✅ All models converted
- ✅ Middleware implemented
- ✅ Database seeded with sample data
- ✅ Frontend API endpoints updated

## File Structure

```
laravel-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       ├── AuthController.php
│   │   │       ├── ProductController.php
│   │   │       ├── ReviewController.php
│   │   │       ├── ContactController.php
│   │   │       └── UserController.php
│   │   └── Middleware/
│   │       └── AdminMiddleware.php
│   └── Models/
│       ├── User.php
│       ├── Product.php
│       ├── Category.php
│       ├── Review.php
│       └── Contact.php
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
│   └── api.php
└── config/
    ├── cors.php
    └── sanctum.php
```

## Troubleshooting

- **Database connection error:** Ensure XAMPP MySQL is running
- **Port already in use:** Change port in serve command
- **CORS errors:** Verify frontend URL in `config/cors.php`
- **Permission errors:** Check storage/ and bootstrap/cache/ permissions
