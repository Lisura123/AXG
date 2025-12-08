<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing categories
        Category::truncate();

        $categories = [
            [
                'name' => 'Batteries',
                'has_submenu' => false,
                'submenu' => [],
                'is_active' => true,
            ],
            [
                'name' => 'Chargers',
                'has_submenu' => false,
                'submenu' => [],
                'is_active' => true,
            ],
            [
                'name' => 'Card Readers',
                'has_submenu' => false,
                'submenu' => [],
                'is_active' => true,
            ],
            [
                'name' => 'Lens Filters',
                'has_submenu' => true,
                'submenu' => [
                    ['name' => '58mm', 'category' => '58mm'],
                    ['name' => '67mm', 'category' => '67mm'],
                    ['name' => '77mm', 'category' => '77mm'],
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Camera Backpacks',
                'has_submenu' => false,
                'submenu' => [],
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        $this->command->info('Categories seeded successfully!');
    }
}
