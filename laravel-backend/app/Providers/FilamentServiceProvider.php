<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class FilamentServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Patch Illuminate\Support\Number::format to not require intl
        if (!extension_loaded('intl')) {
            require_once __DIR__ . '/../Support/NumberPatch.php';
        }
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
