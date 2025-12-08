<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use App\Models\Product;

class ProductsFromAssetsSeeder extends Seeder
{
    public function run(): void
    {
        // The assets are located in the project root public folder, not laravel-backend/public
        $assetsDir = base_path('../public/assets/images');

        if (!File::exists($assetsDir)) {
            $this->command->warn("Directory not found: {$assetsDir}");
            return;
        }

        $files = collect(File::allFiles($assetsDir))
            ->filter(function ($file) {
                $ext = strtolower($file->getExtension());
                return in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'gif']);
            })
            ->values();

        if ($files->isEmpty()) {
            $this->command->warn('No image files found in assets directory.');
            return;
        }

        $count = 0;
        foreach ($files as $file) {
            $relativePath = str_replace(public_path(), '', $file->getPathname());
            // Ensure leading slash (e.g., /assets/images/...)
            if (!Str::startsWith($relativePath, '/')) {
                $relativePath = '/' . $relativePath;
            }

            // Derive a simple product name from filename
            $filename = pathinfo($file->getFilename(), PATHINFO_FILENAME);
            $name = Str::of($filename)
                ->replace(['_', '-', '.'], ' ')
                ->trim()
                ->title();

            // Use top-level folder name as category (e.g., categories)
            $segments = collect(explode(DIRECTORY_SEPARATOR, $file->getPath()))->filter();
            $category = $segments->last(); // images subfolder (e.g., categories)

            // Avoid duplicates by image_url
            $existing = Product::where('image_url', $relativePath)->first();
            if ($existing) {
                continue;
            }

            $product = new Product();
            $product->name = $name ?: 'Product ' . Str::uuid()->toString();
            $product->description = 'Auto-imported product from assets/images.';
            $product->features = [];
            $product->image_url = $relativePath;
            $product->category = $category ?: 'General';
            $product->subcategory = null;
            $product->is_active = true;
            $product->is_featured = false;
            // Only set fields that exist in current schema
            if (property_exists($product, 'price')) { $product->price = null; }
            if (property_exists($product, 'stock')) { $product->stock = null; }
            if (property_exists($product, 'sku')) { $product->sku = null; }
            if (property_exists($product, 'tags')) { $product->tags = []; }
            if (property_exists($product, 'specifications')) { $product->specifications = []; }
            if (property_exists($product, 'meta_description')) { $product->meta_description = null; }
            if (property_exists($product, 'related_products')) { $product->related_products = []; }
            $product->save();

            $count++;
        }

        $this->command->info("Imported {$count} products from public/assets/images.");
    }
}
