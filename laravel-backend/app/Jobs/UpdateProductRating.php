<?php

namespace App\Jobs;

use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;

class UpdateProductRating implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected Product $product;

    /**
     * Create a new job instance.
     */
    public function __construct(Product $product)
    {
        $this->product = $product;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Calculate average rating from approved reviews
        $approvedReviews = $this->product->reviews()
            ->where('is_approved', true)
            ->get();

        if ($approvedReviews->count() > 0) {
            $average = $approvedReviews->avg('rating');
            $count = $approvedReviews->count();

            $this->product->update([
                'rating_average' => round($average, 2),
                'rating_count' => $count,
            ]);

            // Clear cache for this product
            Cache::forget('product_' . $this->product->id);
            Cache::forget('product_slug_' . $this->product->slug);
        }
    }
}
