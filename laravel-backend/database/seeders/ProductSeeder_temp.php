<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Disable foreign key checks
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // Clear existing products
        Product::truncate();
        
        // Re-enable foreign key checks
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $products = [
            // Batteries Category
            [
                'name' => 'LP-E6NH Rechargeable Battery for Canon',
                'slug' => 'SLUG_PLACEHOLDER',
                'description' => 'High-capacity lithium-ion battery compatible with Canon EOS R5, R6, 5D Mark IV, 6D Mark II, 7D Mark II, 80D, and 90D cameras. Features advanced battery management system for optimal performance and safety.',
                'features' => json_encode([
                    '2130mAh high capacity',
                    'Advanced battery management system',
                    'Compatible with Canon cameras',
                    'Overcharge and overdischarge protection',
                    'Temperature monitoring',
                    'Long-lasting performance',
                ]),
                'image_url' => 'https://example.com/images/lp-e6nh-battery.jpg',
                'category' => 'Batteries',
                'subcategory' => 'Camera Batteries',
                'is_active' => true,
                'is_featured' => true,
                'specifications' => json_encode([
                    'Battery Type' => 'Lithium-ion',
                    'Capacity' => '2130mAh',
                    'Voltage' => '7.2V',
                    'Compatibility' => 'Canon EOS R5, R6, 5D IV, 6D II, 7D II, 80D, 90D',
                    'Warranty' => '1 Year',
                ]),
                'meta_description' => 'High-capacity LP-E6NH battery for Canon cameras. Advanced safety features and long-lasting performance.',
            ],
            [
                'name' => 'NP-FZ100 Battery for Sony Alpha Cameras',
                'slug' => 'SLUG_PLACEHOLDER',
                'description' => 'Premium replacement battery for Sony Alpha series cameras including A7 III, A7R III, A7R IV, A9, and A6600. Delivers exceptional shooting time and reliability for professional photographers.',
                'features' => json_encode([
                    '2280mAh ultra-high capacity',
                    'Premium lithium-ion cells',
                    'Sony Alpha compatibility',
                    'Extended shooting time',
                    'Built-in safety circuits',
                    'No memory effect',
                ]),
                'image_url' => 'https://example.com/images/np-fz100-battery.jpg',
                'category' => 'Batteries',
                'subcategory' => 'Camera Batteries',
                'is_active' => true,
                'is_featured' => true,
                'specifications' => json_encode([
                    'Battery Type' => 'Lithium-ion',
                    'Capacity' => '2280mAh',
                    'Voltage' => '7.2V',
                    'Compatibility' => 'Sony A7III, A7RII, A7RIV, A9, A6600',
                    'Warranty' => '1 Year',
                ]),
                'meta_description' => 'Premium NP-FZ100 battery for Sony Alpha cameras. Ultra-high capacity for extended shooting sessions.',
            ],

            // Chargers Category
            [
                'name' => 'Dual USB-C Fast Charger for Canon LP-E6N/LP-E6NH',
                'slug' => 'SLUG_PLACEHOLDER',
                'description' => 'Advanced dual-slot USB-C charger for Canon LP-E6N and LP-E6NH batteries. Features intelligent charging with LED indicators, overcharge protection, and fast charging capability.',
                'features' => json_encode([
                    'Dual-slot simultaneous charging',
                    'USB-C input for modern devices',
                    'LED charging indicators',
                    'Intelligent charging control',
                    'Overcharge protection',
                    'Compact portable design',
                ]),
                'image_url' => 'https://example.com/images/dual-usb-c-charger.jpg',
                'category' => 'Chargers',
                'subcategory' => 'USB-C Chargers',
                'is_active' => true,
                'is_featured' => true,
                'specifications' => json_encode([
                    'Input' => 'USB-C 5V/3A',
                    'Output' => 'DC 8.4V/1.2A x2',
                    'Compatibility' => 'Canon LP-E6N, LP-E6NH batteries',
                    'Charging Time' => '3-4 hours (dual)',
                    'Dimensions' => '110 x 70 x 25mm',
                ]),
                'meta_description' => 'Dual USB-C fast charger for Canon batteries. Intelligent charging with safety protection.',
            ],

            // Card Readers Category
            [
                'name' => 'Professional USB-C Multi-Card Reader',
                'slug' => 'SLUG_PLACEHOLDER',
                'description' => 'High-speed professional card reader supporting SD, microSD, CF, and XQD cards. Perfect for photographers and videographers who need fast and reliable data transfer.',
                'features' => json_encode([
                    'USB-C 3.2 Gen 2 interface',
                    'Supports multiple card formats',
                    'SuperSpeed data transfer',
                    'Plug-and-play operation',
                    'Durable aluminum construction',
                    'LED activity indicator',
                ]),
                'image_url' => 'https://example.com/images/professional-card-reader.jpg',
                'category' => 'Card Readers',
                'subcategory' => 'USB-C Card Readers',
                'is_active' => true,
                'is_featured' => true,
                'specifications' => json_encode([
                    'Interface' => 'USB-C 3.2 Gen 2',
                    'Card Support' => 'SD, SDHC, SDXC, microSD, CF, XQD',
                    'Transfer Speed' => 'Up to 10Gbps',
                    'Material' => 'Aluminum alloy',
                    'Compatibility' => 'Windows, Mac, Linux',
                ]),
                'meta_description' => 'Professional USB-C multi-card reader. High-speed data transfer for multiple card formats.',
            ],

            // Lens Filters Category
            [
                'name' => 'Premium UV Protection Filter 77mm',
                'slug' => 'SLUG_PLACEHOLDER',
                'description' => 'Professional-grade UV filter with multi-coating technology. Protects your lens from UV rays, dust, and scratches while maintaining optical clarity and color accuracy.',
                'features' => json_encode([
                    '16-layer multi-coating',
                    'Premium optical glass',
                    'UV ray protection',
                    'Scratch and dust protection',
                    'Color-neutral performance',
                    'Ultra-slim frame design',
                ]),
                'image_url' => 'https://example.com/images/uv-filter-77mm.jpg',
                'category' => 'Lens Filters',
                'subcategory' => 'UV Filters',
                'is_active' => true,
                'is_featured' => false,
                'specifications' => json_encode([
                    'Filter Size' => '77mm',
                    'Filter Type' => 'UV Protection',
                    'Coating' => '16-layer multi-coating',
                    'Material' => 'Premium optical glass',
                    'Frame' => 'Ultra-slim aluminum',
                ]),
                'meta_description' => '77mm UV protection filter with 16-layer multi-coating. Premium lens protection and optical clarity.',
            ],

            [
                'name' => 'Circular Polarizing Filter 67mm',
                'slug' => 'SLUG_PLACEHOLDER',
                'description' => 'High-quality circular polarizing filter that reduces reflections, increases contrast, and enhances color saturation. Essential for landscape and outdoor photography.',
                'features' => json_encode([
                    'Reduces reflections and glare',
                    'Enhances color saturation',
                    'Increases contrast',
                    'Rotatable polarizing element',
                    'Multi-coated optical glass',
                    'Slim profile design',
                ]),
                'image_url' => 'https://example.com/images/cpl-filter-67mm.jpg',
                'category' => 'Lens Filters',
                'subcategory' => 'Polarizing Filters',
                'is_active' => true,
                'is_featured' => false,
                'specifications' => json_encode([
                    'Filter Size' => '67mm',
                    'Filter Type' => 'Circular Polarizing',
                    'Polarization' => 'Circular',
                    'Material' => 'Multi-coated optical glass',
                    'Frame' => 'Aluminum with rotation ring',
                ]),
                'meta_description' => '67mm circular polarizing filter. Reduces reflections and enhances colors for stunning photography.',
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }

        $this->command->info('Products seeded successfully!');
    }
}
