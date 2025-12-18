<?php

namespace App\Events;

use App\Models\Product;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProductViewed
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Product $product;
    public ?int $userId;

    /**
     * Create a new event instance.
     */
    public function __construct(Product $product, ?int $userId = null)
    {
        $this->product = $product;
        $this->userId = $userId;
    }
}
