<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Disable foreign key checks
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // Clear existing users
        User::truncate();
        
        // Re-enable foreign key checks
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $users = [
            // Admin User
            [
                'first_name' => 'Admin',
                'last_name' => 'AXG',
                'email' => 'admin@axgbolt.com',
                'password' => Hash::make('AdminPass123!'),
                'phone' => '+1234567890',
                'role' => 'admin',
                'is_email_verified' => true,
                'is_active' => true,
            ],
            // Regular User
            [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'email' => 'user@axgbolt.com',
                'password' => Hash::make('UserPass123!'),
                'phone' => '+9876543210',
                'role' => 'user',
                'is_email_verified' => true,
                'is_active' => true,
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }

        $this->command->info('Users seeded successfully!');
        $this->command->info('');
        $this->command->info('=== USER CREDENTIALS ===');
        $this->command->info('Admin User:');
        $this->command->info('  Email: admin@axgbolt.com');
        $this->command->info('  Password: AdminPass123!');
        $this->command->info('');
        $this->command->info('Regular User:');
        $this->command->info('  Email: user@axgbolt.com');
        $this->command->info('  Password: UserPass123!');
    }
}
