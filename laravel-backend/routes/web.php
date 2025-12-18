<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This Laravel backend serves as an API only.
| The frontend React app runs separately on Vite dev server.
| All API routes are in routes/api.php
|
*/

// Simple health check route
Route::get('/', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'AXG Photo API is running',
        'version' => '1.0.0',
        'endpoints' => [
            'admin' => url('/admin123'),
            'api' => url('/api'),
        ]
    ]);
});

// Redirect to admin panel
Route::get('/admin', function () {
    return redirect('/admin123');
});

