<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Get all users (Admin only)
     * 
     * @route GET /api/users
     * @access Private/Admin
     */
    public function index(Request $request)
    {
        try {
            // Pagination parameters
            $page = (int) $request->input('page', 1);
            $limit = (int) $request->input('limit', 10);
            
            // Build query
            $query = User::query();
            
            // Filter by role
            if ($request->has('role')) {
                $query->where('role', $request->input('role'));
            }
            
            // Filter by active status
            if ($request->has('isActive')) {
                $isActive = $request->input('isActive') === 'true' || $request->input('isActive') === true;
                $query->where('is_active', $isActive);
            }
            
            // Search by name or email
            if ($request->has('search') && $request->input('search')) {
                $search = $request->input('search');
                $query->where(function($q) use ($search) {
                    $q->where('first_name', 'LIKE', "%{$search}%")
                      ->orWhere('last_name', 'LIKE', "%{$search}%")
                      ->orWhere('email', 'LIKE', "%{$search}%");
                });
            }
            
            // Get total count
            $total = $query->count();
            
            // Get paginated results
            $users = $query->latest('created_at')
                          ->skip(($page - 1) * $limit)
                          ->take($limit)
                          ->get();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'users' => UserResource::collection($users),
                    'pagination' => [
                        'page' => $page,
                        'limit' => $limit,
                        'total' => $total,
                        'pages' => (int) ceil($total / $limit),
                    ],
                ],
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch users',
                'error' => config('app.debug') ? $e->getMessage() : 'Server error',
            ], 500);
        }
    }

    /**
     * Get user by ID (Admin only)
     * 
     * @route GET /api/users/{userId}
     * @access Private/Admin
     */
    public function show($userId)
    {
        try {
            $user = User::find($userId);
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found',
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $user,
                ],
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch user',
                'error' => config('app.debug') ? $e->getMessage() : 'Server error',
            ], 500);
        }
    }

    /**
     * Update user by ID (Admin only)
     * 
     * @route PUT /api/users/{userId}
     * @access Private/Admin
     */
    public function update(Request $request, $userId)
    {
        try {
            $user = User::find($userId);
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found',
                ], 404);
            }
            
            // Define allowed fields for admin update
            $allowedFields = [
                'first_name',
                'last_name',
                'phone',
                'role',
                'is_active',
                'address_street',
                'address_city',
                'address_state',
                'address_zip_code',
                'address_country',
                'pref_email_notifications',
                'pref_sms_notifications',
                'pref_newsletter',
            ];
            
            // Build validation rules dynamically
            $rules = [];
            
            if ($request->has('first_name')) {
                $rules['first_name'] = 'string|max:255';
            }
            if ($request->has('last_name')) {
                $rules['last_name'] = 'string|max:255';
            }
            if ($request->has('phone')) {
                $rules['phone'] = 'nullable|string|max:20';
            }
            if ($request->has('role')) {
                $rules['role'] = ['string', Rule::in(['user', 'admin'])];
            }
            if ($request->has('is_active')) {
                $rules['is_active'] = 'boolean';
            }
            if ($request->has('address_street')) {
                $rules['address_street'] = 'nullable|string|max:255';
            }
            if ($request->has('address_city')) {
                $rules['address_city'] = 'nullable|string|max:100';
            }
            if ($request->has('address_state')) {
                $rules['address_state'] = 'nullable|string|max:100';
            }
            if ($request->has('address_zip_code')) {
                $rules['address_zip_code'] = 'nullable|string|max:20';
            }
            if ($request->has('address_country')) {
                $rules['address_country'] = 'nullable|string|max:100';
            }
            if ($request->has('pref_email_notifications')) {
                $rules['pref_email_notifications'] = 'boolean';
            }
            if ($request->has('pref_sms_notifications')) {
                $rules['pref_sms_notifications'] = 'boolean';
            }
            if ($request->has('pref_newsletter')) {
                $rules['pref_newsletter'] = 'boolean';
            }
            
            // Validate the request
            $validator = Validator::make($request->all(), $rules);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }
            
            // Filter and update only allowed fields
            $updates = [];
            foreach ($allowedFields as $field) {
                if ($request->has($field)) {
                    $updates[$field] = $request->input($field);
                }
            }
            
            $user->update($updates);
            
            return response()->json([
                'success' => true,
                'message' => 'User updated successfully',
                'data' => [
                    'user' => $user->fresh(),
                ],
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'User update failed',
                'error' => config('app.debug') ? $e->getMessage() : 'Update error',
            ], 400);
        }
    }

    /**
     * Delete user by ID (Admin only)
     * 
     * @route DELETE /api/users/{userId}
     * @access Private/Admin
     */
    public function destroy($userId)
    {
        try {
            $user = User::find($userId);
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found',
                ], 404);
            }
            
            // Prevent admin from deleting themselves
            if ($user->id === auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You cannot delete your own account',
                ], 403);
            }
            
            $user->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully',
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'User deletion failed',
                'error' => config('app.debug') ? $e->getMessage() : 'Server error',
            ], 500);
        }
    }

    /**
     * Create user by admin
     * 
     * @route POST /api/users/admin/create
     * @access Private/Admin
     */
    public function createByAdmin(Request $request)
    {
        try {
            // Validate the request
            $validator = Validator::make($request->all(), [
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email|max:255',
                'password' => 'nullable|string|min:8',
                'phone' => 'nullable|string|max:20',
                'role' => ['nullable', 'string', Rule::in(['user', 'admin'])],
                'is_active' => 'nullable|boolean',
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }
            
            // Check if user already exists
            $existingUser = User::where('email', $request->input('email'))->first();
            if ($existingUser) {
                return response()->json([
                    'success' => false,
                    'message' => 'User already exists with this email',
                ], 400);
            }
            
            // Create new user with admin-specified settings
            $user = User::create([
                'first_name' => $request->input('first_name'),
                'last_name' => $request->input('last_name'),
                'email' => $request->input('email'),
                'password' => Hash::make($request->input('password', 'TempPass123!')), // Default temporary password
                'phone' => $request->input('phone'),
                'role' => $request->input('role', 'user'),
                'is_active' => $request->input('is_active', true),
                'is_email_verified' => true, // Admin-created users are auto-verified
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'User created successfully by admin.',
                'data' => [
                    'user' => $user,
                ],
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'User creation failed',
                'error' => config('app.debug') ? $e->getMessage() : 'Creation error',
            ], 400);
        }
    }

    /**
     * Promote user to admin (Development only)
     * 
     * @route POST /api/users/promote-admin
     * @access Private
     */
    public function promoteToAdmin(Request $request)
    {
        try {
            if (config('app.env') !== 'local' && config('app.env') !== 'development') {
                return response()->json([
                    'success' => false,
                    'message' => 'This endpoint is only available in development mode',
                ], 403);
            }
            
            $user = User::find(auth()->id());
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found',
                ], 404);
            }
            
            $user->update(['role' => 'admin']);
            
            return response()->json([
                'success' => true,
                'message' => 'User promoted to admin successfully',
                'data' => [
                    'user' => $user->fresh(),
                ],
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to promote user',
                'error' => config('app.debug') ? $e->getMessage() : 'Server error',
            ], 500);
        }
    }
}
