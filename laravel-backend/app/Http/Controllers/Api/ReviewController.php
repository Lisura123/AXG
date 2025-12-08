<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    /**
     * Get all reviews with filters (admin) or product reviews (public)
     */
    public function index(Request $request)
    {
        try {
            $page = $request->input('page', 1);
            $limit = $request->input('limit', 10);
            $sortBy = $request->input('sortBy', 'created_at');
            $sortOrder = $request->input('sortOrder', 'desc');
            
            $query = Review::query();

            // Apply filters
            if ($request->has('productId')) {
                $query->where('product_id', $request->productId);
                // Public access only shows approved reviews
                if (!$request->user() || !$request->user()->isAdmin()) {
                    $query->where('is_approved', true);
                }
            }

            if ($request->has('userId')) {
                $query->where('user_id', $request->userId);
            }

            if ($request->has('isApproved')) {
                $query->where('is_approved', $request->isApproved === 'true');
            }

            if ($request->has('isReported')) {
                $query->where('is_reported', $request->isReported === 'true');
            }

            if ($request->has('rating')) {
                $query->where('rating', (int)$request->rating);
            }

            // Get total count before pagination
            $total = $query->count();
            
            // Apply sorting and pagination
            $reviews = $query->with(['user:id,first_name,last_name,email', 'product:id,name,image_url,slug'])
                ->orderBy($sortBy, $sortOrder)
                ->skip(($page - 1) * $limit)
                ->take($limit)
                ->get();

            $totalPages = ceil($total / $limit);

            $response = [
                'success' => true,
                'data' => [
                    'reviews' => $reviews,
                    'pagination' => [
                        'page' => (int)$page,
                        'pages' => (int)$totalPages,
                        'total' => $total,
                        'limit' => (int)$limit,
                    ],
                ],
            ];

            // Add rating stats if filtering by product
            if ($request->has('productId')) {
                $response['data']['ratingStats'] = $this->getProductRatingStats($request->productId);
            }

            // Add admin stats if user is admin
            if ($request->user() && $request->user()->isAdmin()) {
                $response['data']['stats'] = [
                    'total' => Review::count(),
                    'pending' => Review::where('is_approved', false)->count(),
                    'approved' => Review::where('is_approved', true)->count(),
                    'reported' => Review::where('is_reported', true)->count(),
                ];
            }

            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch reviews',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get reviews for a specific product (public endpoint)
     */
    public function getProductReviews(Request $request, $productId)
    {
        try {
            $page = $request->input('page', 1);
            $limit = $request->input('limit', 10);
            $sortBy = $request->input('sortBy', 'created_at');
            $sortOrder = $request->input('sortOrder', 'desc');
            $rating = $request->input('rating');

            $query = Review::where('product_id', $productId)
                ->where('is_approved', true);

            if ($rating) {
                $query->where('rating', (int)$rating);
            }

            $total = $query->count();

            $reviews = $query->with(['user:id,first_name,last_name'])
                ->orderBy($sortBy, $sortOrder)
                ->skip(($page - 1) * $limit)
                ->take($limit)
                ->get();

            $totalPages = ceil($total / $limit);

            $ratingStats = $this->getProductRatingStats($productId);

            return response()->json([
                'success' => true,
                'data' => [
                    'reviews' => $reviews,
                    'pagination' => [
                        'page' => (int)$page,
                        'pages' => (int)$totalPages,
                        'total' => $total,
                        'limit' => (int)$limit,
                    ],
                    'ratingStats' => $ratingStats,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch reviews',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get authenticated user's reviews
     */
    public function getUserReviews(Request $request)
    {
        try {
            $userId = $request->user()->id;
            $page = $request->input('page', 1);
            $limit = $request->input('limit', 10);

            $total = Review::where('user_id', $userId)->count();

            $reviews = Review::where('user_id', $userId)
                ->with(['product:id,name,image_url,slug'])
                ->orderBy('created_at', 'desc')
                ->skip(($page - 1) * $limit)
                ->take($limit)
                ->get();

            $totalPages = ceil($total / $limit);

            return response()->json([
                'success' => true,
                'data' => [
                    'reviews' => $reviews,
                    'pagination' => [
                        'page' => (int)$page,
                        'pages' => (int)$totalPages,
                        'total' => $total,
                        'limit' => (int)$limit,
                    ],
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch reviews',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created review (authenticated users)
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'productId' => 'required|exists:products,id',
                'rating' => 'required|integer|min:1|max:5',
                'title' => 'required|string|max:100',
                'comment' => 'required|string|max:1000',
                'images' => 'nullable|array',
                'images.*.url' => 'required|string',
                'images.*.caption' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 400);
            }

            $userId = $request->user()->id;
            $productId = $request->productId;

            // Check if product exists
            $product = Product::find($productId);
            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found',
                ], 404);
            }

            // Check if user already reviewed this product
            $existingReview = Review::where('product_id', $productId)
                ->where('user_id', $userId)
                ->first();

            if ($existingReview) {
                return response()->json([
                    'success' => false,
                    'message' => 'You have already reviewed this product',
                ], 400);
            }

            // Filter images to only include those with URLs
            $images = [];
            if ($request->has('images') && is_array($request->images)) {
                $images = array_filter($request->images, function($img) {
                    return isset($img['url']) && !empty($img['url']);
                });
                $images = array_values($images); // Re-index array
            }

            // Create review
            $review = Review::create([
                'product_id' => $productId,
                'user_id' => $userId,
                'rating' => (int)$request->rating,
                'title' => trim($request->title),
                'comment' => trim($request->comment),
                'images' => $images,
                'is_approved' => false,
            ]);

            // Load user relationship
            $review->load(['user:id,first_name,last_name']);

            return response()->json([
                'success' => true,
                'message' => 'Review submitted successfully. It will be visible after approval.',
                'data' => $review,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create review',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified review
     */
    public function show(string $id)
    {
        try {
            $review = Review::with(['user:id,first_name,last_name,email', 'product:id,name,image_url,slug'])
                ->find($id);

            if (!$review) {
                return response()->json([
                    'success' => false,
                    'message' => 'Review not found',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $review,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch review',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update user's own review
     */
    public function update(Request $request, string $id)
    {
        try {
            $userId = $request->user()->id;

            $review = Review::where('id', $id)
                ->where('user_id', $userId)
                ->first();

            if (!$review) {
                return response()->json([
                    'success' => false,
                    'message' => 'Review not found or unauthorized',
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'rating' => 'sometimes|integer|min:1|max:5',
                'title' => 'sometimes|string|max:100',
                'comment' => 'sometimes|string|max:1000',
                'images' => 'nullable|array',
                'images.*.url' => 'required|string',
                'images.*.caption' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 400);
            }

            // Update fields if provided
            if ($request->has('rating')) {
                $review->rating = (int)$request->rating;
            }
            if ($request->has('title')) {
                $review->title = trim($request->title);
            }
            if ($request->has('comment')) {
                $review->comment = trim($request->comment);
            }
            if ($request->has('images')) {
                $images = array_filter($request->images, function($img) {
                    return isset($img['url']) && !empty($img['url']);
                });
                $review->images = array_values($images);
            }

            // Reset approval status for updated reviews
            $review->is_approved = false;
            $review->save();

            $review->load(['user:id,first_name,last_name']);

            return response()->json([
                'success' => true,
                'message' => 'Review updated successfully. It will be re-reviewed for approval.',
                'data' => $review,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update review',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete user's own review
     */
    public function destroy(Request $request, string $id)
    {
        try {
            $userId = $request->user()->id;

            $review = Review::where('id', $id)
                ->where('user_id', $userId)
                ->first();

            if (!$review) {
                return response()->json([
                    'success' => false,
                    'message' => 'Review not found or unauthorized',
                ], 404);
            }

            $review->delete();

            return response()->json([
                'success' => true,
                'message' => 'Review deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete review',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Mark review as helpful
     */
    public function markHelpful(Request $request, string $id)
    {
        try {
            $review = Review::find($id);

            if (!$review) {
                return response()->json([
                    'success' => false,
                    'message' => 'Review not found',
                ], 404);
            }

            $review->is_helpful = ($review->is_helpful ?? 0) + 1;
            $review->save();

            return response()->json([
                'success' => true,
                'message' => 'Review marked as helpful',
                'data' => ['helpfulCount' => $review->is_helpful],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark review as helpful',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Report a review
     */
    public function report(Request $request, string $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'reason' => 'required|string|max:500',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Report reason is required',
                    'errors' => $validator->errors(),
                ], 400);
            }

            $review = Review::find($id);

            if (!$review) {
                return response()->json([
                    'success' => false,
                    'message' => 'Review not found',
                ], 404);
            }

            $review->is_reported = true;
            $review->report_reason = trim($request->reason);
            $review->save();

            return response()->json([
                'success' => true,
                'message' => 'Review reported successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to report review',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Admin: Update review status (approve/reject)
     */
    public function updateStatus(Request $request, string $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'is_approved' => 'sometimes|boolean',
                'isApproved' => 'sometimes|boolean',
                'admin_response' => 'sometimes|string|max:500',
                'adminResponse' => 'sometimes|string|max:500',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 400);
            }

            $review = Review::find($id);

            if (!$review) {
                return response()->json([
                    'success' => false,
                    'message' => 'Review not found',
                ], 404);
            }

            // Accept both snake_case and camelCase
            if ($request->has('is_approved')) {
                $review->is_approved = $request->is_approved;
            } elseif ($request->has('isApproved')) {
                $review->is_approved = $request->isApproved;
            }
            
            if ($request->has('admin_response')) {
                $review->admin_response = trim($request->admin_response);
            } elseif ($request->has('adminResponse')) {
                $review->admin_response = trim($request->adminResponse);
            }

            $review->save();
            $review->load(['user:id,first_name,last_name,email', 'product:id,name,image_url,slug']);

            $status = $review->is_approved ? 'approved' : 'rejected';

            return response()->json([
                'success' => true,
                'message' => "Review {$status} successfully",
                'data' => $review,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update review status',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Admin: Delete any review
     */
    public function adminDelete(string $id)
    {
        try {
            $review = Review::find($id);

            if (!$review) {
                return response()->json([
                    'success' => false,
                    'message' => 'Review not found',
                ], 404);
            }

            $review->delete();

            return response()->json([
                'success' => true,
                'message' => 'Review deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete review',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get product rating statistics
     */
    private function getProductRatingStats($productId)
    {
        $stats = Review::where('product_id', $productId)
            ->where('is_approved', true)
            ->selectRaw('
                AVG(rating) as average_rating,
                COUNT(*) as total_reviews,
                SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
                SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
                SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
                SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
                SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
            ')
            ->first();

        if (!$stats || $stats->total_reviews == 0) {
            return [
                'averageRating' => 0,
                'totalReviews' => 0,
                'ratingDistribution' => [
                    '5' => 0,
                    '4' => 0,
                    '3' => 0,
                    '2' => 0,
                    '1' => 0,
                ],
            ];
        }

        return [
            'averageRating' => round($stats->average_rating, 1),
            'totalReviews' => (int)$stats->total_reviews,
            'ratingDistribution' => [
                '5' => (int)$stats->five_star,
                '4' => (int)$stats->four_star,
                '3' => (int)$stats->three_star,
                '2' => (int)$stats->two_star,
                '1' => (int)$stats->one_star,
            ],
        ];
    }

    /**
     * Admin: Get all reviews with filters and statistics
     */
    public function adminIndex(Request $request)
    {
        // This is a dedicated admin endpoint that calls the existing index method
        // The index method already has admin stats logic
        return $this->index($request);
    }
}
