<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'phone',
        'role',
        'is_active',
        'is_email_verified',
        'last_login',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'password_reset_token',
        'email_verification_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'is_email_verified' => 'boolean',
            'last_login' => 'datetime',
            'lock_until' => 'datetime',
            'password_reset_expires' => 'datetime',
            'email_verification_expires' => 'datetime',
        ];
    }

    /**
     * Get the user's full name (for Filament compatibility)
     */
    public function getNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }

    /**
     * Filament requires this method for user name
     */
    public function getFilamentName(): string
    {
        return $this->name;
    }

    /**
     * Get reviews written by this user
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Generate email verification token
     */
    public function generateEmailVerificationToken()
    {
        $token = Str::random(64);
        $this->email_verification_token = hash('sha256', $token);
        $this->email_verification_expires = now()->addHours(24);
        $this->save();
        return $token;
    }

    /**
     * Generate password reset token
     */
    public function generatePasswordResetToken()
    {
        $token = Str::random(64);
        $this->password_reset_token = hash('sha256', $token);
        $this->password_reset_expires = now()->addHours(1);
        $this->save();
        return $token;
    }

    /**
     * Check if user is admin
     */
    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    /**
     * Check if user is moderator
     */
    public function isModerator()
    {
        return $this->role === 'moderator';
    }

    /**
     * Increment login attempts
     */
    public function incrementLoginAttempts()
    {
        $this->login_attempts++;
        if ($this->login_attempts >= 5) {
            $this->lock_until = now()->addMinutes(30);
        }
        $this->save();
    }

    /**
     * Reset login attempts
     */
    public function resetLoginAttempts()
    {
        $this->login_attempts = 0;
        $this->lock_until = null;
        $this->save();
    }

    /**
     * Check if account is locked
     */
    public function isLocked()
    {
        return $this->lock_until && $this->lock_until->isFuture();
    }
}
