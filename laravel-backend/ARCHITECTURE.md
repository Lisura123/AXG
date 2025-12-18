# 🏗️ Backend Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                              │
│  ┌──────────────┐         ┌──────────────┐      ┌──────────────┐  │
│  │   React App  │ ◄─────► │  Inertia.js  │ ◄──► │ Filament UI  │  │
│  │ (Vite/React) │         │   (SSR)      │      │ (Admin Panel)│  │
│  └──────────────┘         └──────────────┘      └──────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      MIDDLEWARE LAYER                                │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐             │
│  │   Sanctum   │  │ Inertia MW   │  │  Cache MW     │             │
│  │ (Auth)      │  │              │  │               │             │
│  └─────────────┘  └──────────────┘  └───────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      ROUTING LAYER                                   │
│  ┌─────────────────┐              ┌──────────────────┐             │
│  │   Web Routes    │              │   API Routes     │             │
│  │  (Inertia SSR)  │              │  (JSON/REST)     │             │
│  └─────────────────┘              └──────────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    CONTROLLER LAYER                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ Web\         │  │ Api\         │  │ Filament     │             │
│  │ Controllers  │  │ Controllers  │  │ Resources    │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     SERVICE LAYER                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   Product    │  │   Review     │  │   User       │             │
│  │   Service    │  │   Service    │  │   Service    │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      EVENT LAYER                                     │
│  ┌──────────────┐              ┌──────────────┐                    │
│  │   Events     │──── fire ───►│  Listeners   │                    │
│  │              │              │              │                    │
│  └──────────────┘              └──────────────┘                    │
│        │                               │                            │
│        │                               ▼                            │
│        │                       ┌──────────────┐                    │
│        └────── dispatch ──────►│     Jobs     │                    │
│                                 │  (Queued)    │                    │
│                                 └──────────────┘                    │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    MODEL/DATABASE LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   Product    │  │   Review     │  │    User      │             │
│  │   Model      │  │   Model      │  │    Model     │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │  Category    │  │   Contact    │  │  Eloquent    │             │
│  │   Model      │  │   Model      │  │  Relations   │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                    │
│  ┌──────────────────────────────────────────────────┐              │
│  │           MySQL Database (axg_database)          │              │
│  └──────────────────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    SUPPORTING SERVICES                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │    Cache     │  │    Queue     │  │   Storage    │             │
│  │   (Redis)    │  │  (Database)  │  │   (Local)    │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │  Notifications│  │     Mail     │  │    Logs      │             │
│  │  (DB/Email)  │  │   (SMTP)     │  │  (Files)     │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Request Flow Examples

### 1. Web Request (Inertia.js)

```
User Browser
     │
     ▼
GET /products
     │
     ▼
Web Route (/routes/web.php)
     │
     ▼
Web\ProductController@index
     │
     ▼
ProductService->getProducts()
     │
     ▼
Product Model (with caching)
     │
     ▼
MySQL Database
     │
     ▼
Inertia Response (JSON + Component)
     │
     ▼
React Component Rendered (SSR)
     │
     ▼
User Browser (HTML)
```

### 2. API Request (REST)

```
Mobile/React App
     │
     ▼
GET /api/products
     │
     ▼
API Route (/routes/api.php)
     │
     ▼
Api\ProductController@index
     │
     ▼
ProductService->getProducts()
     │
     ▼
Product Model
     │
     ▼
ProductResource (Transform)
     │
     ▼
JSON Response
     │
     ▼
Mobile/React App
```

### 3. Admin Panel Request (Filament)

```
Admin Browser
     │
     ▼
GET /admin123/products
     │
     ▼
Filament Middleware
     │
     ▼
ProductResource (Filament)
     │
     ▼
Product Model
     │
     ▼
Filament Table Component
     │
     ▼
Livewire Rendering
     │
     ▼
Admin Browser (HTML)
```

### 4. Background Job Flow

```
User Action (e.g., Review Submitted)
     │
     ▼
ReviewController@store
     │
     ▼
ReviewService->createReview()
     │
     ▼
Review Model->create()
     │
     ▼
Event: ReviewSubmitted (fired)
     │
     ▼
Listener: UpdateProductRatingOnReview
     │
     ▼
Job: UpdateProductRating (dispatched to queue)
     │
     ▼
Queue Worker (background)
     │
     ▼
UpdateProductRating->handle()
     │
     ▼
Product Model->update()
     │
     ▼
Cache->forget()
     │
     ▼
Job Complete
```

### 5. Notification Flow

```
Admin Approves Review
     │
     ▼
ReviewService->approveReview()
     │
     ▼
Review->update(['is_approved' => true])
     │
     ▼
User->notify(new ReviewApproved)
     │
     ▼
Notification Queued
     │
     ▼
Queue Worker
     │
     ├─► Send Email (SMTP)
     │
     └─► Store in Database
     │
     ▼
User Receives Notification
```

---

## Component Relationships

### Models & Relationships

```
User
 ├─► hasMany(Review)
 └─► belongsToMany(Product) [wishlist]

Product
 ├─► hasMany(Review)
 ├─► belongsTo(Category)
 └─► belongsToMany(User) [wishlist]

Review
 ├─► belongsTo(Product)
 └─► belongsTo(User)

Category
 └─► hasMany(Product)
```

---

## File Organization

```
app/
├── Events/                    # Domain Events
│   ├── ProductViewed.php
│   └── ReviewSubmitted.php
│
├── Filament/                  # Admin Panel
│   └── Resources/
│       ├── Products/
│       ├── Reviews/
│       ├── Users/
│       └── Categories/
│
├── Http/
│   ├── Controllers/
│   │   ├── Api/              # API Endpoints
│   │   └── Web/              # Inertia Pages
│   ├── Middleware/           # Request Processing
│   └── Resources/            # API Transformers
│
├── Jobs/                      # Background Tasks
│   ├── ProcessProductImage.php
│   ├── SendWelcomeEmail.php
│   └── UpdateProductRating.php
│
├── Listeners/                 # Event Handlers
│   ├── TrackProductView.php
│   └── UpdateProductRatingOnReview.php
│
├── Models/                    # Eloquent Models
│   ├── Product.php
│   ├── Review.php
│   ├── User.php
│   └── Category.php
│
├── Notifications/             # User Notifications
│   ├── ReviewApproved.php
│   └── WelcomeUser.php
│
├── Providers/                 # Service Providers
│   ├── EventServiceProvider.php
│   └── Filament/
│
└── Services/                  # Business Logic
    ├── ProductService.php
    └── ReviewService.php
```

---

## Technology Stack

### Backend
- **Framework:** Laravel 12.x
- **PHP Version:** 8.2+
- **Database:** MySQL
- **Authentication:** Laravel Sanctum
- **Admin Panel:** Filament PHP v4
- **SSR:** Inertia.js

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** React Context API

### DevOps
- **Queue:** Database Driver
- **Cache:** File/Redis
- **Mail:** SMTP/Log
- **Storage:** Local Filesystem

---

## Design Patterns Used

1. **Repository Pattern** - Service Layer
2. **Observer Pattern** - Events & Listeners
3. **Job Queue Pattern** - Background Processing
4. **Resource Pattern** - API Responses
5. **Middleware Pattern** - Request Filtering
6. **Provider Pattern** - Service Registration
7. **Factory Pattern** - Model Factories
8. **Strategy Pattern** - Notification Channels

---

## Performance Optimizations

### Implemented
- ✅ Query Result Caching
- ✅ Route Caching
- ✅ Config Caching
- ✅ View Caching
- ✅ Eager Loading Relationships
- ✅ Database Indexing
- ✅ Queue Processing
- ✅ Response Caching Middleware

### Recommended
- 🔄 Redis for Caching
- 🔄 Database Query Optimization
- 🔄 Image Optimization
- 🔄 CDN for Static Assets
- 🔄 Database Read Replicas
- 🔄 Load Balancing

---

## Security Measures

- ✅ CSRF Protection
- ✅ SQL Injection Prevention (Eloquent)
- ✅ XSS Protection
- ✅ Mass Assignment Protection
- ✅ Authentication (Sanctum)
- ✅ Authorization (Policies)
- ✅ Rate Limiting
- ✅ Input Validation
- ✅ Password Hashing (Bcrypt)
- ✅ HTTPS Ready

---

**This architecture follows SOLID principles and Laravel best practices!**
