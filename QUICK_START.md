# Quick Start Guide - AXG Photo Laravel Backend

## Prerequisites

✅ XAMPP installed with MySQL running  
✅ PHP 8.2+ (included in XAMPP)  
✅ Node.js and npm (for frontend)

## Start the Application

### 1. Start MySQL

Ensure XAMPP MySQL is running:
```bash
# Open XAMPP Control Panel and start MySQL
# Or via terminal:
sudo /Applications/XAMPP/xamppfiles/xampp startmysql
```

### 2. Start Laravel Backend

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/AXG-main/laravel-backend
/Applications/XAMPP/xamppfiles/bin/php artisan serve --host=127.0.0.1 --port=8001
```

Backend API running at: **http://localhost:8001/api**

### 3. Start React Frontend

In a new terminal:
```bash
cd /Applications/XAMPP/xamppfiles/htdocs/AXG-main
npm run dev
```

Frontend running at: **http://localhost:5173**

## Test Login

Open http://localhost:5173 and login with:

**Admin Account:**
- Email: `admin@axgbolt.com`
- Password: `AdminPass123!`

**Regular User:**
- Email: `user@axgbolt.com`
- Password: `UserPass123!`

## Common Commands

### Backend Commands

```bash
# Navigate to Laravel directory
cd /Applications/XAMPP/xamppfiles/htdocs/AXG-main/laravel-backend

# Run migrations
/Applications/XAMPP/xamppfiles/bin/php artisan migrate

# Seed database
/Applications/XAMPP/xamppfiles/bin/php artisan db:seed

# Reset database (fresh migration + seed)
/Applications/XAMPP/xamppfiles/bin/php artisan migrate:fresh --seed

# Clear cache
/Applications/XAMPP/xamppfiles/bin/php artisan cache:clear
/Applications/XAMPP/xamppfiles/bin/php artisan config:clear

# View routes
/Applications/XAMPP/xamppfiles/bin/php artisan route:list
```

### Frontend Commands

```bash
# Navigate to project root
cd /Applications/XAMPP/xamppfiles/htdocs/AXG-main

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Database Access

**PHPMyAdmin:** http://localhost/phpmyadmin  
**Database Name:** `axg_database`  
**Username:** `root`  
**Password:** (empty)

## API Testing

### Test Registration

```bash
curl -X POST http://localhost:8001/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "password": "Password123!",
    "phone": "+1234567890"
  }'
```

### Test Login

```bash
curl -X POST http://localhost:8001/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@axgbolt.com",
    "password": "AdminPass123!"
  }'
```

### Test Get Products

```bash
curl http://localhost:8001/api/products
```

## Troubleshooting

### Backend Not Starting

**Error: "Address already in use"**
```bash
# Use different port
/Applications/XAMPP/xamppfiles/bin/php artisan serve --port=8002
# Update frontend API URL in src/lib/api.ts
```

**Error: "Could not find driver"**
```bash
# Enable MySQL extension in php.ini
# Uncomment: extension=mysqli
# Uncomment: extension=pdo_mysql
```

### Database Connection Failed

```bash
# Check MySQL is running
sudo /Applications/XAMPP/xamppfiles/xampp status

# Verify database exists
/Applications/XAMPP/xamppfiles/bin/mysql -u root -e "SHOW DATABASES;"

# Recreate database if needed
/Applications/XAMPP/xamppfiles/bin/mysql -u root -e "DROP DATABASE IF EXISTS axg_database; CREATE DATABASE axg_database;"
cd /Applications/XAMPP/xamppfiles/htdocs/AXG-main/laravel-backend
/Applications/XAMPP/xamppfiles/bin/php artisan migrate:fresh --seed
```

### CORS Errors

Update `laravel-backend/config/cors.php`:
```php
'allowed_origins' => [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    // Add your frontend URL
],
```

### Frontend Not Connecting

Check API URL in `src/lib/api.ts`:
```typescript
const API_BASE_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:8001"
}/api`;
```

## File Structure

```
AXG-main/
├── laravel-backend/          # Laravel API backend
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   ├── Models/
│   │   └── Http/Middleware/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/api.php
│   └── .env
├── src/                      # React frontend
│   ├── components/
│   ├── pages/
│   ├── lib/
│   │   ├── api.ts           # API configuration
│   │   └── reviewApi.ts     # Review API
│   └── contexts/
├── composer.phar             # Composer package manager
└── package.json              # NPM dependencies
```

## Environment Variables

### Laravel (.env in laravel-backend/)
```env
APP_NAME="AXG Photo"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:5173

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=axg_database
DB_USERNAME=root
DB_PASSWORD=
```

### React (create .env in project root if needed)
```env
VITE_API_URL=http://localhost:8001
```

## Default Data

After seeding, you'll have:

- **5 Categories** (Batteries, Chargers, Card Readers, Lens Filters, Camera Backpacks)
- **6 Products** (Various camera accessories)
- **2 Users** (1 admin, 1 regular user)
- **0 Reviews** (create via frontend)
- **0 Contacts** (submit via contact form)

## Development Workflow

1. **Make Changes:**
   - Backend: Edit files in `laravel-backend/`
   - Frontend: Edit files in `src/`

2. **Test Changes:**
   - Backend automatically reloads with `artisan serve`
   - Frontend hot-reloads with Vite

3. **Database Changes:**
   ```bash
   # Create new migration
   /Applications/XAMPP/xamppfiles/bin/php artisan make:migration create_new_table
   
   # Edit migration file, then run
   /Applications/XAMPP/xamppfiles/bin/php artisan migrate
   ```

4. **Add New Endpoint:**
   - Create method in controller
   - Add route in `routes/api.php`
   - Update frontend API client

## Production Deployment

See `MIGRATION_SUMMARY.md` for complete deployment checklist.

## Need Help?

- Laravel Docs: https://laravel.com/docs
- React Docs: https://react.dev
- Check logs: `laravel-backend/storage/logs/laravel.log`
- Database: http://localhost/phpmyadmin

---

**Migration Status:** ✅ Complete  
**Node.js Backend:** ❌ Removed  
**Laravel Backend:** ✅ Active on port 8001  
**React Frontend:** ✅ Updated to use Laravel API
