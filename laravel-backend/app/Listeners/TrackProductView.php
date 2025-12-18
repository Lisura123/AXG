<?php

namespace App\Listeners;

use App\Events\ProductViewed;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Cache;

class TrackProductView implements ShouldQueue
{
    /**
     * Handle the event.
     */
    public function handle(ProductViewed $event): void
    {
        // Track product views for analytics
        $cacheKey = 'product_views_' . $event->product->id . '_' . date('Y-m-d');
        
        Cache::increment($cacheKey);
        
        // Set cache to expire after 30 days
        Cache::put($cacheKey, Cache::get($cacheKey, 0), now()->addDays(30));
    }
}
