<?php

namespace App\Listeners;

use App\Events\ReviewSubmitted;
use App\Jobs\UpdateProductRating;
use Illuminate\Contracts\Queue\ShouldQueue;

class UpdateProductRatingOnReview implements ShouldQueue
{
    /**
     * Handle the event.
     */
    public function handle(ReviewSubmitted $event): void
    {
        // Dispatch job to update product rating
        UpdateProductRating::dispatch($event->review->product);
    }
}
