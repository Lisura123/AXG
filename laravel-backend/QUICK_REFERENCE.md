# 🚀 Quick Reference - Common Commands

## Development Servers

### Start All Services (Run in separate terminals)
```bash
# Terminal 1 - Laravel Server
cd laravel-backend
php artisan serve
# or with XAMPP:
/Applications/XAMPP/xamppfiles/bin/php artisan serve --port=8001

# Terminal 2 - Queue Worker
php artisan queue:work

# Terminal 3 - Vite Dev Server (Inertia)
npm run dev
```

---

## Database Commands

### Migrations
```bash
# Run migrations
php artisan migrate

# Rollback last migration
php artisan migrate:rollback

# Fresh start (drop all + migrate)
php artisan migrate:fresh

# Fresh start with seeding
php artisan migrate:fresh --seed

# Check migration status
php artisan migrate:status
```

### Seeders
```bash
# Seed all
php artisan db:seed

# Seed specific seeder
php artisan db:seed --class=CategorySeeder
php artisan db:seed --class=FilamentAdminSeeder
php artisan db:seed --class=ProductSeeder
```

---

## Cache Commands

### Clear Caches
```bash
# Clear all caches
php artisan optimize:clear

# Clear specific caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Create Caches (Production)
```bash
# Cache everything for production
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

---

## Filament Commands

### Create Resources
```bash
# Create Filament resource
php artisan make:filament-resource ProductName

# With view page
php artisan make:filament-resource ProductName --view

# Generate from existing model
php artisan make:filament-resource Product --generate
```

### Create Admin User
```bash
php artisan make:filament-user
```

---

## Code Generation

### Controllers
```bash
# API Controller
php artisan make:controller Api/ProductController

# Web Controller (for Inertia)
php artisan make:controller Web/ProductController

# Resource Controller
php artisan make:controller ProductController --resource
```

### Models
```bash
# Model only
php artisan make:model Product

# Model + Migration
php artisan make:model Product -m

# Model + Migration + Factory + Seeder
php artisan make:model Product -mfs

# Model + all
php artisan make:model Product -a
```

### Events & Listeners
```bash
# Create event
php artisan make:event ProductViewed

# Create listener
php artisan make:listener UpdateProductRating --event=ProductViewed
```

### Jobs
```bash
# Create job
php artisan make:job ProcessProductImage
```

### Notifications
```bash
# Create notification
php artisan make:notification ReviewApproved
```

### Middleware
```bash
# Create middleware
php artisan make:middleware CheckAdmin
```

---

## Queue Commands

### Working with Queues
```bash
# Start queue worker
php artisan queue:work

# With verbose output
php artisan queue:work --verbose

# Process specific queue
php artisan queue:work --queue=high,default

# Process one job
php artisan queue:work --once

# Restart workers
php artisan queue:restart

# Retry failed jobs
php artisan queue:retry all
php artisan queue:retry {id}

# List failed jobs
php artisan queue:failed
```

---

## NPM Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Type checking (TypeScript)
npm run type-check
```

---

## Testing

```bash
# Run all tests
php artisan test

# Run specific test
php artisan test --filter=ProductTest

# With coverage
php artisan test --coverage
```

---

## Useful Artisan Commands

### Maintenance Mode
```bash
# Enable maintenance mode
php artisan down

# Enable with secret access
php artisan down --secret="your-secret"

# Disable maintenance mode
php artisan up
```

### List Routes
```bash
# List all routes
php artisan route:list

# Filter by name
php artisan route:list --name=products

# Filter by path
php artisan route:list --path=api
```

### Tinker (Interactive Console)
```bash
# Start tinker
php artisan tinker

# Example usage in tinker:
# >>> User::count()
# >>> Product::where('is_featured', true)->get()
# >>> Cache::flush()
```

### Storage
```bash
# Create storage link
php artisan storage:link

# Clear storage
php artisan storage:clean
```

---

## Git Commands (Quick Reference)

```bash
# Status
git status

# Add all changes
git add .

# Commit
git commit -m "Added backend enhancements"

# Push
git push origin main

# Pull latest
git pull origin main
```

---

## Access URLs

```
Frontend (React):           http://localhost:5173
Laravel API:                http://localhost:8000/api
Filament Admin:             http://localhost:8000/admin123
Health Check:               http://localhost:8000/up
```

---

## Default Credentials

### Filament Admin
```
Email:    admin@agx.com
Password: admin123
```

### Test User (if seeded)
```
Email:    user@example.com
Password: password
```

---

## Environment Variables (Important)

```env
# Database
DB_CONNECTION=mysql
DB_DATABASE=axg_database

# Queue
QUEUE_CONNECTION=database

# Mail (for testing)
MAIL_MAILER=log

# Cache
CACHE_STORE=file
```

---

## Troubleshooting Quick Fixes

### Problem: Migrations failing
```bash
php artisan migrate:fresh
```

### Problem: Filament not accessible
```bash
php artisan optimize:clear
php artisan db:seed --class=FilamentAdminSeeder
```

### Problem: Changes not reflecting
```bash
php artisan optimize:clear
npm run build
```

### Problem: Queue jobs stuck
```bash
php artisan queue:restart
php artisan queue:work
```

---

## File Permissions (Unix/Mac)

```bash
# Make storage writable
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# Fix ownership (if needed)
chown -R www-data:www-data storage
chown -R www-data:www-data bootstrap/cache
```

---

## Production Deployment Checklist

```bash
# 1. Pull latest code
git pull origin main

# 2. Install dependencies
composer install --optimize-autoloader --no-dev
npm install
npm run build

# 3. Update environment
cp .env.example .env
# Edit .env with production values
php artisan key:generate

# 4. Database
php artisan migrate --force

# 5. Optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# 6. Storage
php artisan storage:link

# 7. Permissions
chmod -R 775 storage bootstrap/cache
```

---

**Save this file for quick reference!** 📌
