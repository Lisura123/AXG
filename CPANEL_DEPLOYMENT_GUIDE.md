# AXG Photography Equipment - cPanel Deployment Guide

## 🚀 Frontend Deployment (React App)

### Step 1: Build the Frontend

```bash
# In the root directory
npm run build
```

### Step 2: Upload to cPanel

1. Upload ALL contents from the `dist/` folder to your `public_html/` directory
2. Make sure `.htaccess` file is uploaded to `public_html/`
3. Ensure all assets (images, CSS, JS) are uploaded

### Step 3: File Structure in cPanel

```
public_html/
├── index.html
├── .htaccess
├── assets/
│   ├── [css files]
│   └── [js files]
└── [other static files]
```

## 🔧 Backend Deployment (Node.js API)

### Step 1: Create API Directory

1. In cPanel File Manager, create folder: `public_html/api/`
2. Upload ALL backend files to this directory

### Step 2: Backend Files to Upload

```
public_html/api/
├── server.js
├── package.json (rename from package-production.json)
├── .env (with production settings)
├── controllers/
├── models/
├── middleware/
├── routes/
├── config/
└── uploads/
```

### Step 3: Set up Node.js in cPanel

1. Go to cPanel → "Node.js"
2. Click "Create Application"
3. Set:
   - Node.js version: 16+ or latest LTS
   - Application mode: Production
   - Application root: `/public_html/api`
   - Application URL: Leave empty (we'll use domain root)
   - Application startup file: `server.js`
   - Application port: 3000

### Step 4: Install Dependencies

```bash
# In cPanel Terminal or SSH
cd public_html/api
npm install --production
```

### Step 5: Environment Variables

Set these in cPanel Node.js app settings:

- `NODE_ENV=production`
- `PORT=3000`
- Copy other variables from `.env` file

## 📧 Email Configuration (cPanel)

### Step 1: Create Email Account

1. Go to cPanel → "Email Accounts"
2. Create: `info@axgphoto.com`
3. Set strong password

### Step 2: Update Backend .env

```env
EMAIL_USER=info@axgphoto.com
EMAIL_PASS=your_cpanel_email_password
SMTP_HOST=mail.axgphoto.com
SMTP_PORT=587
```

## 🔐 SSL Certificate

1. Go to cPanel → "SSL/TLS"
2. Enable "Let's Encrypt" for your domain
3. Force HTTPS redirect

## 🌐 Domain Configuration

### DNS Settings

Ensure these point to your cPanel server:

- A Record: `axgphoto.com` → Your server IP
- A Record: `www.axgphoto.com` → Your server IP

### .htaccess Rules

The provided `.htaccess` handles:

- React Router (client-side routing)
- HTTPS redirect
- API routing (`/api/*` requests)
- Asset caching
- Security headers

## ✅ Testing Checklist

After deployment, test:

- [ ] Homepage loads correctly
- [ ] Navigation works (React Router)
- [ ] User registration/login
- [ ] Admin dashboard access
- [ ] Product management
- [ ] Contact form (email sending)
- [ ] Password reset functionality
- [ ] Image uploads
- [ ] Review system

## 🔍 Troubleshooting

### Common Issues:

1. **500 Error**: Check Node.js app logs in cPanel
2. **404 for API**: Verify API directory structure
3. **CORS Errors**: Check allowed origins in server.js
4. **Email Not Sending**: Verify SMTP settings
5. **Images Not Loading**: Check file permissions (755)

### Useful Commands:

```bash
# Restart Node.js app
pm2 restart all

# Check logs
pm2 logs

# Check app status
pm2 status
```

## 📞 Support

For issues, check:

1. cPanel Error Logs
2. Node.js Application Logs
3. Browser Developer Console
4. Network Tab for API calls

## 🔄 Future Updates

To update the application:

1. Build new frontend: `npm run build`
2. Upload new `dist/` contents to `public_html/`
3. Upload backend changes to `public_html/api/`
4. Restart Node.js app in cPanel
