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

// Redirect root to the public website
Route::get('/', function () {
    return redirect()->away('https://www.axgphoto.com');
});

// Redirect to admin panel
Route::get('/admin', function () {
    return redirect('/admin123');
});

