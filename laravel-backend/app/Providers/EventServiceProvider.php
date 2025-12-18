<?php

namespace App\Providers;

use App\Events\ProductViewed;
use App\Events\ReviewSubmitted;
use App\Listeners\TrackProductView;
use App\Listeners\UpdateProductRatingOnReview;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        ReviewSubmitted::class => [
            UpdateProductRatingOnReview::class,
        ],
        ProductViewed::class => [
            TrackProductView::class,
        ],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        //
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
