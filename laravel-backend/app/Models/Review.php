<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'user_id',
        'rating',
        'title',
        'comment',
        'is_approved',
        'is_helpful',
        'is_reported',
        'report_reason',
        'admin_response',
        'tags',
        'images',
        'verified_purchase',
    ];

    protected $casts = [
        'is_approved' => 'boolean',
        'is_reported' => 'boolean',
        'tags' => 'array',
        'images' => 'array',
        'verified_purchase' => 'boolean',
        'is_helpful' => 'integer',
    ];

    /**
     * Get the product this review belongs to
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the user who wrote this review
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Approve review and update product rating
     */
    public function approve()
    {
        $this->is_approved = true;
        $this->save();
        $this->product->updateRating();
    }

    /**
     * Reject review and update product rating
     */
    public function reject()
    {
        $this->is_approved = false;
        $this->save();
        $this->product->updateRating();
    }

    /**
     * Mark review as helpful (increment counter)
     */
    public function markHelpful()
    {
        $this->is_helpful = ($this->is_helpful ?? 0) + 1;
        return $this->save();
    }

    /**
     * Get rating statistics for a product
     */
    public static function getProductRatingStats($productId)
    {
        $stats = self::where('product_id', $productId)
            ->where('is_approved', true)
            ->selectRaw('
                AVG(rating) as average_rating,
                COUNT(*) as total_reviews,
                SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
                SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
                SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
                SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
                SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
            ')
            ->first();

        if (!$stats || $stats->total_reviews == 0) {
            return [
                'averageRating' => 0,
                'totalReviews' => 0,
                'ratingDistribution' => [
                    '5' => 0,
                    '4' => 0,
                    '3' => 0,
                    '2' => 0,
                    '1' => 0,
                ],
            ];
        }

        return [
            'averageRating' => round($stats->average_rating, 1),
            'totalReviews' => (int)$stats->total_reviews,
            'ratingDistribution' => [
                '5' => (int)$stats->five_star,
                '4' => (int)$stats->four_star,
                '3' => (int)$stats->three_star,
                '2' => (int)$stats->two_star,
                '1' => (int)$stats->one_star,
            ],
        ];
    }
}
