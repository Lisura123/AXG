<?php

namespace App\Services;

use App\Models\Product;
use App\Events\ProductViewed;
use Illuminate\Support\Facades\Cache;
use Illuminate\Database\Eloquent\Collection;

class ProductService
{
    /**
     * Get featured products with caching
     */
    public function getFeaturedProducts(int $limit = 6): Collection
    {
        return Cache::remember('featured_products', 3600, function () use ($limit) {
            return Product::where('is_featured', true)
                ->where('is_active', true)
                ->latest()
                ->limit($limit)
                ->get();
        });
    }

    /**
     * Get product by slug with caching
     */
    public function getProductBySlug(string $slug): ?Product
    {
        return Cache::remember("product_slug_{$slug}", 3600, function () use ($slug) {
            return Product::where('slug', $slug)
                ->where('is_active', true)
                ->first();
        });
    }

    /**
     * Record product view
     */
    public function recordView(Product $product, ?int $userId = null): void
    {
        // Fire event for analytics
        event(new ProductViewed($product, $userId));
        
        // Increment view count (can be moved to listener for better performance)
        $product->increment('view_count');
    }

    /**
     * Get related products
     */
    public function getRelatedProducts(Product $product, int $limit = 4): Collection
    {
        return Cache::remember("related_products_{$product->id}", 3600, function () use ($product, $limit) {
            return Product::where('category', $product->category)
                ->where('id', '!=', $product->id)
                ->where('is_active', true)
                ->inRandomOrder()
                ->limit($limit)
                ->get();
        });
    }

    /**
     * Search products
     */
    public function search(string $query, ?string $category = null, int $perPage = 12)
    {
        $productsQuery = Product::where('is_active', true)
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('description', 'like', "%{$query}%")
                  ->orWhere('features', 'like', "%{$query}%");
            });

        if ($category && $category !== 'all') {
            $productsQuery->where('category', $category);
        }

        return $productsQuery->paginate($perPage);
    }

    /**
     * Clear product cache
     */
    public function clearCache(Product $product): void
    {
        Cache::forget("product_{$product->id}");
        Cache::forget("product_slug_{$product->slug}");
        Cache::forget("related_products_{$product->id}");
        Cache::forget('featured_products');
    }
}
