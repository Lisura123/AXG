<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'features' => $this->features,
            'image_url' => $this->image_url,
            'category' => $this->category,
            'subcategory' => $this->subcategory,
            'is_active' => $this->is_active,
            'is_featured' => $this->is_featured,
            'rating' => [
                'average' => (float) $this->rating_average,
                'count' => $this->rating_count,
            ],
            'view_count' => $this->view_count,
            'specifications' => $this->specifications,
            'related_products' => $this->related_products,
            'meta' => [
                'title' => $this->meta_title,
                'description' => $this->meta_description,
                'keywords' => $this->meta_keywords,
            ],
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
