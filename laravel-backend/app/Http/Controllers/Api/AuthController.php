<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        // Handle both camelCase and snake_case field names
        $data = $request->all();
        
        // Convert camelCase to snake_case if needed
        if (isset($data['firstName'])) {
            $data['first_name'] = $data['firstName'];
        }
        if (isset($data['lastName'])) {
            $data['last_name'] = $data['lastName'];
        }
        
        $validator = Validator::make($data, [
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            // Store plain password for auto-login
            $plainPassword = $data['password'];
            
            $user = User::create([
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => $data['email'],
                'password' => $plainPassword,
                'phone' => $data['phone'] ?? null,
            ]);

            // Generate email verification token (optional, can fail silently)
            try {
                $verificationToken = $user->generateEmailVerificationToken();
            } catch (\Exception $e) {
                \Log::warning('Failed to generate verification token: ' . $e->getMessage());
                $verificationToken = null;
            }
            
            // Auto-login by creating token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'User registered successfully.',
                'data' => [
                    'user' => new UserResource($user),
                    'token' => $token,
                ],
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Registration error: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Registration failed',
                'error' => $e->getMessage(),
                'trace' => env('APP_DEBUG') ? $e->getTraceAsString() : null,
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                if ($user) {
                    $user->incrementLoginAttempts();
                }
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid email or password',
                ], 401);
            }

            if ($user->isLocked()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Account is temporarily locked. Try again later.',
                ], 401);
            }

            if (!$user->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Account is deactivated. Please contact support.',
                ], 401);
            }

            if ($user->login_attempts > 0) {
                $user->resetLoginAttempts();
            }

            $user->last_login = now();
            $user->save();

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'data' => [
                    'user' => new UserResource($user),
                    'token' => $token,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Login failed',
                'error' => env('APP_DEBUG') ? $e->getMessage() : 'Login error',
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);
    }

    public function profile(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => ['user' => $request->user()],
        ]);
    }

    public function updateProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|string|max:50',
            'last_name' => 'sometimes|string|max:50',
            'phone' => 'sometimes|nullable|string|max:20',
            'avatar' => 'sometimes|nullable|string',
            'address_street' => 'sometimes|nullable|string',
            'address_city' => 'sometimes|nullable|string',
            'address_state' => 'sometimes|nullable|string',
            'address_zip_code' => 'sometimes|nullable|string',
            'address_country' => 'sometimes|nullable|string',
            'pref_email_notifications' => 'sometimes|boolean',
            'pref_sms_notifications' => 'sometimes|boolean',
            'pref_newsletter' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            $user = $request->user();
            $user->update($request->only([
                'first_name', 'last_name', 'phone', 'avatar',
                'address_street', 'address_city', 'address_state',
                'address_zip_code', 'address_country',
                'pref_email_notifications', 'pref_sms_notifications', 'pref_newsletter'
            ]));

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => ['user' => $user->fresh()],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Profile update failed',
                'error' => env('APP_DEBUG') ? $e->getMessage() : 'Update error',
            ], 400);
        }
    }

    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|different:current_password',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Validation failed', 'errors' => $validator->errors()], 400);
        }

        try {
            $user = $request->user();
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json(['success' => false, 'message' => 'Current password is incorrect'], 400);
            }

            $user->password = $request->new_password;
            $user->save();

            return response()->json(['success' => true, 'message' => 'Password changed successfully']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Password change failed', 'error' => env('APP_DEBUG') ? $e->getMessage() : 'Update error'], 500);
        }
    }

    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), ['email' => 'required|email']);
        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Validation failed', 'errors' => $validator->errors()], 400);
        }

        try {
            $user = User::where('email', $request->email)->first();
            if (!$user) {
                return response()->json(['success' => true, 'message' => 'If the email exists, a password reset link has been sent.']);
            }

            $resetToken = $user->generatePasswordResetToken();
            return response()->json(['success' => true, 'message' => 'If the email exists, a password reset link has been sent.', 'reset_token' => env('APP_ENV') === 'local' ? $resetToken : null]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Password reset request failed', 'error' => env('APP_DEBUG') ? $e->getMessage() : 'Server error'], 500);
        }
    }

    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), ['token' => 'required|string', 'password' => 'required|string|min:8']);
        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Validation failed', 'errors' => $validator->errors()], 400);
        }

        try {
            $hashedToken = hash('sha256', $request->token);
            $user = User::where('password_reset_token', $hashedToken)->where('password_reset_expires', '>', now())->first();

            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Invalid or expired reset token'], 400);
            }

            $user->password = $request->password;
            $user->password_reset_token = null;
            $user->password_reset_expires = null;
            $user->save();

            return response()->json(['success' => true, 'message' => 'Password reset successfully']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Password reset failed', 'error' => env('APP_DEBUG') ? $e->getMessage() : 'Server error'], 500);
        }
    }

    public function verifyEmail($token)
    {
        try {
            $hashedToken = hash('sha256', $token);
            $user = User::where('email_verification_token', $hashedToken)->where('email_verification_expires', '>', now())->first();

            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Invalid or expired verification token'], 400);
            }

            $user->is_email_verified = true;
            $user->email_verified_at = now();
            $user->email_verification_token = null;
            $user->email_verification_expires = null;
            $user->save();

            return response()->json(['success' => true, 'message' => 'Email verified successfully']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Email verification failed', 'error' => env('APP_DEBUG') ? $e->getMessage() : 'Server error'], 500);
        }
    }
}
