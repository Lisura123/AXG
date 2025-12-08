<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'has_submenu',
        'submenu',
        'is_active',
    ];

    protected $casts = [
        'has_submenu' => 'boolean',
        'submenu' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Get products in this category
     */
    public function products()
    {
        return $this->hasMany(Product::class, 'category', 'name');
    }
}
