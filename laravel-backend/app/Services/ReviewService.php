<?php

namespace App\Services;

use App\Models\Review;
use App\Models\Product;
use App\Events\ReviewSubmitted;
use App\Notifications\ReviewApproved;
use Illuminate\Support\Facades\Cache;

class ReviewService
{
    /**
     * Create a new review
     */
    public function createReview(array $data): Review
    {
        $review = Review::create($data);

        // Fire event
        event(new ReviewSubmitted($review));

        return $review;
    }

    /**
     * Approve a review
     */
    public function approveReview(Review $review): void
    {
        $review->update(['is_approved' => true]);

        // Notify the user
        $review->user->notify(new ReviewApproved($review));

        // Clear product cache
        Cache::forget("product_{$review->product_id}");
        Cache::forget("product_slug_{$review->product->slug}");
    }

    /**
     * Get reviews for a product
     */
    public function getProductReviews(Product $product, int $perPage = 10)
    {
        return $product->reviews()
            ->where('is_approved', true)
            ->with('user:id,first_name,last_name,avatar')
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Calculate product rating
     */
    public function calculateProductRating(Product $product): array
    {
        $approvedReviews = $product->reviews()
            ->where('is_approved', true)
            ->get();

        $count = $approvedReviews->count();
        $average = $count > 0 ? $approvedReviews->avg('rating') : 0;

        return [
            'average' => round($average, 2),
            'count' => $count,
            'distribution' => $this->getRatingDistribution($approvedReviews),
        ];
    }

    /**
     * Get rating distribution
     */
    protected function getRatingDistribution($reviews): array
    {
        $distribution = [1 => 0, 2 => 0, 3 => 0, 4 => 0, 5 => 0];

        foreach ($reviews as $review) {
            $distribution[$review->rating]++;
        }

        return $distribution;
    }

    /**
     * Report a review
     */
    public function reportReview(Review $review, string $reason): void
    {
        $review->update([
            'is_reported' => true,
            'report_reason' => $reason,
        ]);

        // You can send notification to admins here
    }
}
