# Backend Setup & Enhancement Guide

## 🚀 Quick Start

### Prerequisites
- PHP 8.2 or higher
- MySQL/MariaDB
- Composer
- Node.js & NPM
- XAMPP (if on macOS/Windows)

### Installation

1. **Navigate to Laravel backend:**
```bash
cd laravel-backend
```

2. **Install PHP dependencies:**
```bash
# If using XAMPP on macOS
/Applications/XAMPP/xamppfiles/bin/php composer.phar install

# Or if composer is globally installed
composer install
```

3. **Install Node dependencies:**
```bash
npm install
```

4. **Setup environment:**
```bash
cp .env.example .env
php artisan key:generate
```

5. **Configure database in `.env`:**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=agx_photo
DB_USERNAME=root
DB_PASSWORD=
```

6. **Run migrations and seeders:**
```bash
php artisan migrate
php artisan db:seed
```

7. **Link storage:**
```bash
php artisan storage:link
```

## 🎯 What's Been Enhanced

### ✅ Filament Admin Panel
- **URL:** `http://localhost:8000/admin123`
- **Credentials:** admin@agx.com / admin123
- Resources for Products, Reviews, Users, Categories

### ✅ Inertia.js Integration
- Server-side rendering support
- React frontend with Laravel backend
- Web controllers for HomeController, ProductController, ReviewController

### ✅ Laravel Architecture Improvements
- **Events:** ProductViewed, ReviewSubmitted
- **Listeners:** UpdateProductRatingOnReview, TrackProductView
- **Jobs:** UpdateProductRating, SendWelcomeEmail, ProcessProductImage
- **Notifications:** ReviewApproved, WelcomeUser
- **Services:** ProductService, ReviewService
- **Resources:** ProductResource, ReviewResource
- **Middleware:** CacheResponse, TrackUserActivity

## 🔧 Running the Application

### Development Mode

**Terminal 1 - Laravel Server:**
```bash
cd laravel-backend
php artisan serve
```

**Terminal 2 - Queue Worker:**
```bash
cd laravel-backend
php artisan queue:work
```

**Terminal 3 - Vite Dev Server (for Inertia):**
```bash
cd laravel-backend
npm run dev
```

**Terminal 4 - Frontend (if separate):**
```bash
cd ..  # go to root
npm run dev
```

### Production Build

```bash
# Build frontend assets
npm run build

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 📊 Available Endpoints

### Web Routes (Inertia.js)
- `GET /` - Home page
- `GET /about` - About page
- `GET /contact` - Contact page
- `GET /products` - Products listing
- `GET /products/{slug}` - Product detail
- `POST /reviews` - Submit review (auth required)
- `GET /profile` - User profile (auth required)

### API Routes
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/products` - Products list
- `GET /api/products/{id}` - Product detail
- `GET /api/reviews/product/{id}` - Product reviews
- And more... (see `routes/api.php`)

### Admin Routes
- `GET /admin123` - Filament admin panel
- `GET /admin123/products` - Manage products
- `GET /admin123/reviews` - Manage reviews
- `GET /admin123/users` - Manage users
- `GET /admin123/categories` - Manage categories

## 🗄️ Database Seeding

### Seed All Data
```bash
php artisan db:seed
```

### Seed Specific Seeder
```bash
php artisan db:seed --class=CategorySeeder
php artisan db:seed --class=FilamentAdminSeeder
php artisan db:seed --class=ProductSeeder
php artisan db:seed --class=UserSeeder
```

### Fresh Migration with Seed
```bash
php artisan migrate:fresh --seed
```

## 🔐 Authentication

### For Web (Inertia)
- Session-based authentication
- Uses Laravel Sanctum

### For API
- Token-based authentication
- Use `/api/login` to get token
- Add `Authorization: Bearer {token}` header

## 📝 Testing

### Run PHPUnit Tests
```bash
php artisan test
```

### Run Specific Test
```bash
php artisan test --filter=ProductTest
```

## 🛠️ Artisan Commands

### Clear All Caches
```bash
php artisan optimize:clear
```

### Generate IDE Helper (optional)
```bash
composer require --dev barryvdh/laravel-ide-helper
php artisan ide-helper:generate
php artisan ide-helper:models
```

### Create New Resources
```bash
# Create Filament Resource
php artisan make:filament-resource ProductName

# Create Controller
php artisan make:controller ProductController

# Create Model
php artisan make:model Product -mfs
# -m = migration, -f = factory, -s = seeder

# Create Event
php artisan make:event EventName

# Create Listener
php artisan make:listener ListenerName --event=EventName

# Create Job
php artisan make:job JobName

# Create Notification
php artisan make:notification NotificationName
```

## 📦 Key Packages

### Production Dependencies
- `filament/filament`: "^4.0" - Admin panel
- `inertiajs/inertia-laravel`: "^2.0" - Inertia.js
- `laravel/sanctum`: "^4.2" - API authentication
- `laravel/framework`: "^12.0" - Laravel core

### Development Dependencies
- `laravel/breeze`: "^2.3" - Authentication scaffolding
- `laravel/pail`: "^1.2" - Log viewer
- `phpunit/phpunit`: "^11.5" - Testing

## ⚙️ Configuration Files

### Important Configuration
- `config/filament.php` - Filament settings
- `config/inertia.php` - Inertia settings
- `config/sanctum.php` - API authentication
- `config/queue.php` - Queue configuration
- `config/cache.php` - Cache configuration

### Middleware Configuration
Located in `bootstrap/app.php`:
- Admin middleware
- Cache response middleware
- Activity tracking middleware
- Inertia middleware

## 🔍 Troubleshooting

### Filament Not Accessible
```bash
# Clear cache
php artisan optimize:clear

# Ensure admin user exists
php artisan db:seed --class=FilamentAdminSeeder
```

### Queue Jobs Not Processing
```bash
# Check queue connection in .env
QUEUE_CONNECTION=database

# Run queue worker
php artisan queue:work

# For development, use --tries=1 for faster debugging
php artisan queue:work --tries=1
```

### Inertia Pages Not Loading
```bash
# Rebuild frontend
npm run build

# Clear all caches
php artisan optimize:clear
```

### Migration Errors
```bash
# Rollback last migration
php artisan migrate:rollback

# Fresh start
php artisan migrate:fresh --seed
```

## 📚 Additional Resources

- [Laravel Documentation](https://laravel.com/docs/12.x)
- [Filament Documentation](https://filamentphp.com/docs/4.x)
- [Inertia.js Documentation](https://inertiajs.com/)
- [Laravel Sanctum](https://laravel.com/docs/12.x/sanctum)

## 🎉 Features Summary

✅ Filament v4 Admin Panel with full CRUD
✅ Inertia.js SSR integration
✅ Event-driven architecture
✅ Background job processing
✅ Notification system
✅ Service layer pattern
✅ API Resources for clean responses
✅ Advanced middleware
✅ Caching strategy
✅ Comprehensive seeders
✅ Security best practices

---

**Need Help?** Check the `BACKEND_ENHANCEMENTS.md` for detailed documentation.
