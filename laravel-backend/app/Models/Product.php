<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'features',
        'image_url',
        'category',
        'subcategory',
        'slug',
        'is_active',
        'is_featured',
        'rating_average',
        'rating_count',
        'view_count',
        'specifications',
        'related_products',
        'meta_title',
        'meta_description',
        'meta_keywords',
    ];

    protected $casts = [
        'features' => 'array',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'rating_average' => 'decimal:2',
        'specifications' => 'array',
        'related_products' => 'array',
        'meta_keywords' => 'array',
    ];

    /**
     * Auto-generate slug when creating product
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->slug)) {
                $base = Str::slug($product->name);
                $slug = $base;
                $suffix = 2;
                while (static::where('slug', $slug)->exists()) {
                    $slug = $base . '-' . $suffix;
                    $suffix++;
                }
                $product->slug = $slug;
            }
        });
    }

    /**
     * Get reviews for this product
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Get approved reviews only
     */
    public function approvedReviews()
    {
        return $this->reviews()->where('is_approved', true);
    }

    /**
     * Update product rating
     */
    public function updateRating()
    {
        $approved = $this->approvedReviews();
        $this->rating_count = $approved->count();
        $this->rating_average = $approved->avg('rating') ?? 0;
        $this->save();
    }

    /**
     * Increment view count
     */
    public function incrementViewCount()
    {
        $this->increment('view_count');
    }
}
