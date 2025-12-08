<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\UserController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::get('/verify-email/{token}', [AuthController::class, 'verifyEmail']);

// Product routes (public)
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/featured', [ProductController::class, 'getFeatured']);
Route::get('/products/search', [ProductController::class, 'search']);
Route::get('/products/image/{filename}', [ProductController::class, 'getImage']);
Route::get('/products/category/{category}', [ProductController::class, 'getByCategory']);
Route::get('/products/{identifier}', [ProductController::class, 'show']);

// Categories (public)
Route::get('/categories', [ProductController::class, 'getCategories']);

// Reviews (public)
Route::get('/reviews', [ReviewController::class, 'index']);
Route::get('/reviews/product/{productId}', [ReviewController::class, 'getProductReviews']);
Route::post('/reviews/{id}/helpful', [ReviewController::class, 'markHelpful']);

// Contact (public)
Route::post('/contacts', [ContactController::class, 'store']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/change-password', [AuthController::class, 'changePassword']);
    
    // Admin routes (must come before other routes with similar patterns)
    Route::middleware('admin')->group(function () {
        // Product management
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);
        Route::get('/products/admin/all', [ProductController::class, 'getAllAdmin']);
        Route::post('/products/upload-image', [ProductController::class, 'uploadImage']);
        Route::post('/categories', [ProductController::class, 'createCategory']);
        
        // Review management (admin routes must be before /reviews/{id})
        Route::get('/reviews/admin', [ReviewController::class, 'adminIndex']);
        Route::put('/reviews/{id}/status', [ReviewController::class, 'updateStatus']);
        Route::delete('/reviews/{id}/admin', [ReviewController::class, 'adminDelete']);
        
        // User management
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{userId}', [UserController::class, 'show']);
        Route::put('/users/{userId}', [UserController::class, 'update']);
        Route::delete('/users/{userId}', [UserController::class, 'destroy']);
        Route::post('/users/create', [UserController::class, 'createByAdmin']);
        
        // Contact management
        Route::get('/contacts', [ContactController::class, 'index']);
        Route::get('/contacts/{id}', [ContactController::class, 'show']);
        Route::put('/contacts/{id}', [ContactController::class, 'update']);
        Route::delete('/contacts/{id}', [ContactController::class, 'destroy']);
    });
    
    // Review routes (authenticated users) - must be after admin routes
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::get('/reviews/my-reviews', [ReviewController::class, 'getUserReviews']);
    Route::get('/reviews/{id}', [ReviewController::class, 'show']);
    Route::put('/reviews/{id}', [ReviewController::class, 'update']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);
    Route::post('/reviews/{id}/report', [ReviewController::class, 'report']);
    
    // Development only - promote to admin
    Route::post('/users/promote-admin', [UserController::class, 'promoteToAdmin']);
});
