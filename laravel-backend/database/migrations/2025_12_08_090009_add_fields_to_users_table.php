<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('first_name', 50)->after('id');
            $table->string('last_name', 50)->after('first_name');
            $table->dropColumn('name');
            $table->string('phone', 20)->nullable()->after('email');
            $table->enum('role', ['user', 'admin', 'moderator'])->default('user')->after('password');
            $table->boolean('is_active')->default(true)->after('role');
            $table->boolean('is_email_verified')->default(false)->after('is_active');
            $table->string('avatar')->nullable()->after('is_email_verified');
            
            // Address fields
            $table->string('address_street')->nullable()->after('avatar');
            $table->string('address_city')->nullable()->after('address_street');
            $table->string('address_state')->nullable()->after('address_city');
            $table->string('address_zip_code')->nullable()->after('address_state');
            $table->string('address_country')->default('USA')->after('address_zip_code');
            
            // Preferences
            $table->boolean('pref_email_notifications')->default(true)->after('address_country');
            $table->boolean('pref_sms_notifications')->default(false)->after('pref_email_notifications');
            $table->boolean('pref_newsletter')->default(false)->after('pref_sms_notifications');
            
            // Security fields
            $table->timestamp('last_login')->nullable()->after('pref_newsletter');
            $table->integer('login_attempts')->default(0)->after('last_login');
            $table->timestamp('lock_until')->nullable()->after('login_attempts');
            $table->string('password_reset_token')->nullable()->after('lock_until');
            $table->timestamp('password_reset_expires')->nullable()->after('password_reset_token');
            $table->string('email_verification_token')->nullable()->after('password_reset_expires');
            $table->timestamp('email_verification_expires')->nullable()->after('email_verification_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('name')->after('id');
            $table->dropColumn([
                'first_name', 'last_name', 'phone', 'role', 'is_active', 
                'is_email_verified', 'avatar', 'address_street', 'address_city',
                'address_state', 'address_zip_code', 'address_country',
                'pref_email_notifications', 'pref_sms_notifications', 'pref_newsletter',
                'last_login', 'login_attempts', 'lock_until',
                'password_reset_token', 'password_reset_expires',
                'email_verification_token', 'email_verification_expires'
            ]);
        });
    }
};
