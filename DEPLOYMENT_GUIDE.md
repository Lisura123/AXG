# AXG Photo - Server Deployment Guide

## Server Information
- **IP Address:** 13.214.196.58
- **Domain:** axgphoto.com
- **SSH Connection:** `ssh -i PEMFILE ubuntu@13.214.196.58`
- **User:** ubuntu

## Prerequisites on Server
1. PHP 8.2+
2. MySQL
3. Composer
4. Node.js & npm
5. Nginx or Apache
6. Git

## Deployment Steps

### 1. Connect to Server
```bash
ssh -i /path/to/your/PEMFILE ubuntu@13.214.196.58
```

### 2. Install Required Software (if not already installed)
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install PHP 8.2 and extensions
sudo apt install -y php8.2 php8.2-cli php8.2-fpm php8.2-mysql php8.2-xml php8.2-mbstring php8.2-curl php8.2-zip php8.2-bcmath php8.2-gd

# Install MySQL
sudo apt install -y mysql-server

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Node.js & npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Install Git
sudo apt install -y git
```

### 3. Clone Repository
```bash
cd /var/www
sudo git clone https://github.com/adx-cameralk/agx-photo.git axgphoto
sudo chown -R ubuntu:ubuntu axgphoto
cd axgphoto
```

### 4. Setup Laravel Backend
```bash
cd laravel-backend

# Install PHP dependencies
composer install --optimize-autoloader --no-dev

# Copy and configure .env file
cp .env.example .env
nano .env
```

**Configure .env file:**
```env
APP_NAME="AXG Photo"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://axgphoto.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=axg_database
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=info@axgphoto.com
MAIL_PASSWORD=wyqmdwiknmxwfjuo
MAIL_FROM_ADDRESS="info@axgphoto.com"
MAIL_FROM_NAME="AXG Photo"

# Email configuration for contact form
EMAIL_USER=info@axgphoto.com
EMAIL_PASS=wyqmdwiknmxwfjuo
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

```bash
# Generate application key
php artisan key:generate

# Set permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

# Create database
sudo mysql -u root -p
```

**In MySQL prompt:**
```sql
CREATE DATABASE axg_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'axg_user'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON axg_database.* TO 'axg_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

```bash
# Run migrations and seeders
php artisan migrate --force
php artisan db:seed --class=CategorySeeder --force
php artisan db:seed --class=UserSeeder --force
```

### 5. Build Frontend
```bash
cd /var/www/axgphoto

# Install dependencies
npm install

# Update API base URL for production
nano src/lib/api.ts
```

**Change API_BASE_URL to:**
```typescript
const API_BASE_URL = 'https://axgphoto.com/api';
```

```bash
# Build production frontend
npm run build

# Copy built files to Laravel public directory
cp -r dist/* laravel-backend/public/
```

### 6. Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/axgphoto.com
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name axgphoto.com www.axgphoto.com;
    root /var/www/axgphoto/laravel-backend/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php index.html;

    charset utf-8;

    # Handle API requests
    location /api {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Handle uploaded images
    location /uploads {
        try_files $uri =404;
    }

    # Handle all other requests (frontend routing)
    location / {
        try_files $uri $uri/ /index.html;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.html;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/axgphoto.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. Install SSL Certificate (Let's Encrypt)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d axgphoto.com -d www.axgphoto.com
```

### 8. Set up Auto-deployment (Optional)
Create a deployment script:
```bash
nano /home/ubuntu/deploy-axg.sh
```

```bash
#!/bin/bash
cd /var/www/axgphoto
sudo -u ubuntu git pull office main
cd laravel-backend
composer install --optimize-autoloader --no-dev
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
cd ..
npm install
npm run build
cp -r dist/* laravel-backend/public/
sudo systemctl restart nginx
echo "Deployment completed!"
```

```bash
chmod +x /home/ubuntu/deploy-axg.sh
```

## Quick Deployment from Local Machine

You can also deploy directly from your local machine:

```bash
# Build frontend locally
npm run build

# Copy files to server
scp -i PEMFILE -r dist/* ubuntu@13.214.196.58:/var/www/axgphoto/laravel-backend/public/
scp -i PEMFILE -r laravel-backend ubuntu@13.214.196.58:/var/www/axgphoto/

# SSH and run Laravel setup
ssh -i PEMFILE ubuntu@13.214.196.58 "cd /var/www/axgphoto/laravel-backend && composer install --optimize-autoloader --no-dev && php artisan migrate --force && php artisan config:cache"
```

## Troubleshooting

### Check Nginx logs
```bash
sudo tail -f /var/log/nginx/error.log
```

### Check Laravel logs
```bash
tail -f /var/www/axgphoto/laravel-backend/storage/logs/laravel.log
```

### Fix permissions
```bash
cd /var/www/axgphoto/laravel-backend
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

### Clear caches
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

## Admin Access
- Email: admin@axgbolt.com
- Password: AdminPass123!

Or:
- Email: www.lisurasigera@gmail.com
- Password: AdminPass123!

## Important Notes
1. Always backup database before deployment
2. Never commit `.env` file to Git
3. Keep your PEM file secure
4. Use strong passwords for production
5. Enable firewall: `sudo ufw allow 22,80,443/tcp`
