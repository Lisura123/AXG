<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class FilamentAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Filament admin user
        User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@agx.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'is_active' => true,
            'is_email_verified' => true,
            'phone' => '+1234567890',
        ]);
    }
}
