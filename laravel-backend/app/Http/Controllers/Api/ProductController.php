<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;

class ProductController extends Controller
{
    /**
     * @desc    Get all products
     * @route   GET /api/products
     * @access  Public
     */
    public function index(Request $request)
    {
        try {
            $page = (int) ($request->query('page', 1));
            $limit = (int) ($request->query('limit', 12));
            $skip = ($page - 1) * $limit;

            // Build query
            $query = Product::where('is_active', true);

            // Handle multiple categories (comma-separated)
            if ($request->query('categories')) {
                $categoryList = array_map('trim', explode(',', $request->query('categories')));
                $query->whereIn('category', $categoryList);
            } elseif ($request->query('category')) {
                $query->where('category', 'like', '%' . $request->query('category') . '%');
            }

            if ($request->query('subcategory')) {
                $query->where('subcategory', 'like', '%' . $request->query('subcategory') . '%');
            }

            if ($request->query('isFeatured') !== null) {
                $query->where('is_featured', $request->query('isFeatured') === 'true');
            }

            if ($request->query('search')) {
                $searchTerm = $request->query('search');
                $query->where(function($q) use ($searchTerm) {
                    $q->where('name', 'like', '%' . $searchTerm . '%')
                      ->orWhere('description', 'like', '%' . $searchTerm . '%')
                      ->orWhere('category', 'like', '%' . $searchTerm . '%')
                      ->orWhere('subcategory', 'like', '%' . $searchTerm . '%');
                });
            }

            // Get total count
            $total = $query->count();

            // Get products
            $products = $query->orderByDesc('is_featured')
                             ->orderByDesc('created_at')
                             ->skip($skip)
                             ->take($limit)
                             ->get();

            // Transform related_products from array to objects for each product
            $products->transform(function($product) {
                if ($product->related_products && is_array($product->related_products)) {
                    $relatedProducts = Product::whereIn('id', $product->related_products)
                        ->select('id', 'name', 'image_url', 'slug')
                        ->get();
                    $product->relatedProducts = $relatedProducts;
                }
                return $product;
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'products' => $products,
                    'pagination' => [
                        'page' => $page,
                        'limit' => $limit,
                        'total' => $total,
                        'pages' => ceil($total / $limit),
                    ],
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch products',
                'error' => config('app.debug') ? $e->getMessage() : 'Server error',
            ], 500);
        }
    }

    /**
     * @desc    Upload product image (stores in public/uploads) and return URL
     * @route   POST /api/products/upload-image
     * @access  Private/Admin
     */
    public function uploadImage(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'image' => 'required|image|mimes:jpeg,jpg,png,webp,gif|max:5120',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 400);
            }

            $file = $request->file('image');
            $uploadsPath = public_path('uploads');

            if (!File::exists($uploadsPath)) {
                File::makeDirectory($uploadsPath, 0755, true);
            }

            $ext = strtolower($file->getClientOriginalExtension());
            $safeName = Str::uuid()->toString() . '.' . $ext;
            $file->move($uploadsPath, $safeName);

            // Return a path usable by the frontend; they pass it through getImageUrl
            // which maps /uploads/* to /api/products/image/{filename}
            $publicPath = '/uploads/' . $safeName;

            return response()->json([
                'success' => true,
                'message' => 'Image uploaded successfully',
                'data' => [
                    'imageUrl' => $publicPath,
                    'filename' => $safeName,
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Image upload failed',
                'error' => config('app.debug') ? $e->getMessage() : 'Server error',
            ], 500);
        }
    }

    /**
     * @desc    Serve uploaded product images from public/uploads
     * @route   GET /api/products/image/{filename}
     * @access  Public
     */
    public function getImage(string $filename)
    {
        $path = public_path('uploads/' . $filename);
        if (!File::exists($path)) {
            return response()->json([
                'success' => false,
                'message' => 'Image not found',
            ], 404);
        }

        $mime = File::mimeType($path) ?: 'application/octet-stream';
        return response()->file($path, [
            'Content-Type' => $mime,
            'Cache-Control' => 'public, max-age=31536000',
        ]);
    }
    /**
     * @desc    Get product by ID or slug
     * @route   GET /api/products/:identifier
     * @access  Public
     */
    public function show(string $identifier)
    {
        try {
            // Try to find by ID first, then by slug
            $product = Product::find($identifier);

            if (!$product) {
                $product = Product::where('slug', $identifier)->first();
            }

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found',
                ], 404);
            }

            // Increment view count
            $product->incrementViewCount();

            // Load related products
            if ($product->related_products && is_array($product->related_products)) {
                $relatedProducts = Product::whereIn('id', $product->related_products)
                    ->select('id', 'name', 'image_url', 'slug')
                    ->get();
                $product->relatedProducts = $relatedProducts;
            }

            return response()->json([
                'success' => true,
                'data' => ['product' => $product],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch product',
                'error' => config('app.debug') ? $e->getMessage() : 'Server error',
            ], 500);
        }
    }

    /**
     * @desc    Create product
     * @route   POST /api/products
     * @access  Private/Admin
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'features' => 'nullable|array',
                'image_url' => 'nullable|string',
                'imageURL' => 'nullable|string',
                'images' => 'nullable|array',
                'category' => 'required|string|max:255',
                'subcategory' => 'nullable|string|max:255',
                'is_active' => 'nullable|boolean',
                'isActive' => 'nullable|boolean',
                'is_featured' => 'nullable|boolean',
                'isFeatured' => 'nullable|boolean',
                'specifications' => 'nullable|array',
                'related_products' => 'nullable|array',
                'meta_title' => 'nullable|string',
                'meta_description' => 'nullable|string',
                'meta_keywords' => 'nullable|array',
            ]);

            if ($validator->fails()) {
                $errors = collect($validator->errors())->map(function($messages, $field) {
                    return [
                        'field' => $field,
                        'message' => $messages[0]
                    ];
                })->values();

                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $errors,
                ], 400);
            }

            // Auto-create category if it doesn't exist
            $this->ensureCategoryExists($request->category, $request->subcategory);

            $product = new Product();
            $product->name = $request->name;
            $product->description = $request->description;
            $product->features = $request->features;
            // Accept both image_url and imageURL from frontend
            $imageUrl = $request->input('image_url') ?? $request->input('imageURL');
            $product->image_url = $imageUrl && trim($imageUrl) !== '' ? $imageUrl : null;
            // Additional images (thumbnails)
            $product->images = $request->input('images', []);
            $product->category = $request->category;
            $product->subcategory = $request->subcategory;
            // Accept both snake_case and camelCase booleans
            $isActive = $request->input('is_active');
            if ($isActive === null) { $isActive = $request->input('isActive'); }
            $product->is_active = $isActive === null ? true : (bool)$isActive;
            $isFeatured = $request->input('is_featured');
            if ($isFeatured === null) { $isFeatured = $request->input('isFeatured'); }
            $product->is_featured = $isFeatured === null ? false : (bool)$isFeatured;
            $product->specifications = $request->specifications;
            $product->related_products = $request->related_products;
            $product->meta_title = $request->meta_title;
            $product->meta_description = $request->meta_description;
            $product->meta_keywords = $request->meta_keywords;
            
            $product->save();

            return response()->json([
                'success' => true,
                'message' => 'Product created successfully',
                'data' => ['product' => $product],
            ], 201);
        } catch (\Illuminate\Database\QueryException $e) {
            // Handle duplicate key errors
            if ($e->getCode() === '23000') {
                return response()->json([
                    'success' => false,
                    'message' => 'Product with this SKU or slug already exists',
                ], 400);
            }

            return response()->json([
                'success' => false,
                'message' => 'Product creation failed',
                'error' => config('app.debug') ? $e->getMessage() : 'Creation error',
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Product creation failed',
                'error' => config('app.debug') ? $e->getMessage() : 'Creation error',
            ], 400);
        }
    }

    /**
     * @desc    Update product
     * @route   PUT /api/products/:id
     * @access  Private/Admin
     */
    public function update(Request $request, string $id)
    {
        try {
            $product = Product::find($id);

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found',
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'features' => 'nullable|array',
                'image_url' => 'nullable|string',
                'imageURL' => 'nullable|string',
                'images' => 'nullable|array',
                'category' => 'nullable|string|max:255',
                'subcategory' => 'nullable|string|max:255',
                'is_active' => 'nullable|boolean',
                'isActive' => 'nullable|boolean',
                'is_featured' => 'nullable|boolean',
                'isFeatured' => 'nullable|boolean',
                'specifications' => 'nullable|array',
                'related_products' => 'nullable|array',
                'meta_title' => 'nullable|string',
                'meta_description' => 'nullable|string',
                'meta_keywords' => 'nullable|array',
            ]);

            if ($validator->fails()) {
                $errors = collect($validator->errors())->map(function($messages, $field) {
                    return [
                        'field' => $field,
                        'message' => $messages[0]
                    ];
                })->values();

                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $errors,
                ], 400);
            }

            // Map incoming fields (accept camelCase and snake_case)
            $map = [
                'name' => 'name',
                'description' => 'description',
                'features' => 'features',
                'image_url' => 'image_url',
                'imageURL' => 'image_url',
                'images' => 'images',
                'category' => 'category',
                'subcategory' => 'subcategory',
                'is_active' => 'is_active',
                'isActive' => 'is_active',
                'is_featured' => 'is_featured',
                'isFeatured' => 'is_featured',
                'specifications' => 'specifications',
                'related_products' => 'related_products',
                'meta_title' => 'meta_title',
                'meta_description' => 'meta_description',
                'meta_keywords' => 'meta_keywords',
            ];

            foreach ($map as $inputKey => $modelField) {
                if ($request->has($inputKey)) {
                    if ($modelField === 'image_url') {
                        $val = $request->input($inputKey);
                        if (!$val || trim($val) === '') { continue; }
                        $product->image_url = $val;
                    } elseif (in_array($modelField, ['is_active', 'is_featured'])) {
                        $product->$modelField = (bool)$request->input($inputKey);
                    } else {
                        $product->$modelField = $request->input($inputKey);
                    }
                }
            }

            // Auto-create category if it doesn't exist and category is being updated
            if ($request->has('category')) {
                $this->ensureCategoryExists($request->category, $request->subcategory);
            }

            $product->save();

            // Load related products
            if ($product->related_products && is_array($product->related_products)) {
                $relatedProducts = Product::whereIn('id', $product->related_products)
                    ->select('id', 'name', 'image_url', 'slug')
                    ->get();
                $product->relatedProducts = $relatedProducts;
            }

            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
                'data' => ['product' => $product],
            ]);
        } catch (\Illuminate\Database\QueryException $e) {
            // Handle duplicate key errors
            if ($e->getCode() === '23000') {
                return response()->json([
                    'success' => false,
                    'message' => 'Product with this SKU or slug already exists',
                ], 400);
            }

            return response()->json([
                'success' => false,
                'message' => 'Product update failed',
                'error' => config('app.debug') ? $e->getMessage() : 'Update error',
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Product update failed',
                'error' => config('app.debug') ? $e->getMessage() : 'Update error',
            ], 400);
        }
    }

    /**
     * @desc    Delete product
     * @route   DELETE /api/products/:id
     * @access  Private/Admin
     */
    public function destroy(string $id)
    {
        try {
            $product = Product::find($id);

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found',
                ], 404);
            }

            $product->delete();

            return response()->json([
                'success' => true,
                'message' => 'Product deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Product deletion failed',
                'error' => config('app.debug') ? $e->getMessage() : 'Server error',
            ], 500);
        }
    }

    /**
     * @desc    Get all products for admin (includes inactive)
     * @route   GET /api/products/admin/all
     * @access  Private/Admin
     */
    public function getAllAdmin(Request $request)
    {
        try {
            $page = (int) ($request->query('page', 1));
            $limit = (int) ($request->query('limit', 10));
            $skip = ($page - 1) * $limit;

            // Build query (include inactive products for admin)
            $query = Product::query();

            // Filter by category
            if ($request->query('category')) {
                $query->where('category', $request->query('category'));
            }

            // Filter by active status
            if ($request->query('isActive') !== null) {
                $isActive = $request->query('isActive') === 'true' || $request->query('isActive') === true;
                $query->where('is_active', $isActive);
            }

            // Filter by featured status
            if ($request->query('isFeatured') !== null) {
                $isFeatured = $request->query('isFeatured') === 'true' || $request->query('isFeatured') === true;
                $query->where('is_featured', $isFeatured);
            }

            // Search
            if ($request->query('search')) {
                $searchTerm = $request->query('search');
                $query->where(function($q) use ($searchTerm) {
                    $q->where('name', 'like', '%' . $searchTerm . '%')
                      ->orWhere('description', 'like', '%' . $searchTerm . '%')
                      ->orWhere('category', 'like', '%' . $searchTerm . '%');
                });
            }

            // Get total count
            $total = $query->count();

            // Get products
            $products = $query->orderByDesc('created_at')
                             ->skip($skip)
                             ->take($limit)
                             ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'products' => $products,
                    'pagination' => [
                        'page' => $page,
                        'limit' => $limit,
                        'total' => $total,
                        'pages' => (int) ceil($total / $limit),
                    ],
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('GetAllAdmin error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch products',
                'error' => config('app.debug') ? $e->getMessage() : 'Server error',
            ], 500);
        }
    }

    /**
     * @desc    Get featured products
     * @route   GET /api/products/featured
     * @access  Public
     */
    public function getFeaturedProducts(Request $request)
    {
        try {
            $limit = (int) ($request->query('limit', 8));

            $products = Product::where('is_active', true)
                              ->where('is_featured', true)
                              ->orderByDesc('created_at')
                              ->take($limit)
                              ->get();

            return response()->json([
                'success' => true,
                'data' => ['products' => $products],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch featured products',
                'error' => config('app.debug') ? $e->getMessage() : 'Server error',
            ], 500);
        }
    }

    /**
     * @desc    Search products
     * @route   GET /api/products/search
     * @access  Public
     */
    public function searchProducts(Request $request)
    {
        try {
            $q = $request->query('q');
            $category = $request->query('category');
            $subcategory = $request->query('subcategory');
            $isFeatured = $request->query('isFeatured');
            $page = (int) ($request->query('page', 1));
            $limit = (int) ($request->query('limit', 12));
            $skip = ($page - 1) * $limit;

            if (!$q) {
                return response()->json([
                    'success' => false,
                    'message' => 'Search query is required',
                ], 400);
            }

            $query = Product::where('is_active', true)
                           ->where(function($query) use ($q) {
                               $query->where('name', 'like', '%' . $q . '%')
                                     ->orWhere('description', 'like', '%' . $q . '%')
                                     ->orWhere('category', 'like', '%' . $q . '%')
                                     ->orWhere('subcategory', 'like', '%' . $q . '%');
                           });

            if ($category) {
                $query->where('category', 'like', '%' . $category . '%');
            }

            if ($subcategory) {
                $query->where('subcategory', 'like', '%' . $subcategory . '%');
            }

            if ($isFeatured !== null) {
                $query->where('is_featured', $isFeatured === 'true');
            }

            $total = $query->count();
            $products = $query->skip($skip)->take($limit)->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'products' => $products,
                    'searchTerm' => $q,
                    'pagination' => [
                        'page' => $page,
                        'limit' => $limit,
                        'total' => $total,
                        'pages' => ceil($total / $limit),
                    ],
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Search failed',
                'error' => config('app.debug') ? $e->getMessage() : 'Server error',
            ], 500);
        }
    }

    /**
     * @desc    Get products by category
     * @route   GET /api/products/category/:category
     * @access  Public
     */
    public function getProductsByCategory(Request $request, string $category)
    {
        try {
            $subcategory = $request->query('subcategory');
            $page = (int) ($request->query('page', 1));
            $limit = (int) ($request->query('limit', 12));
            $skip = ($page - 1) * $limit;

            $query = Product::where('is_active', true)
                           ->where('category', $category);

            if ($subcategory) {
                $query->where('subcategory', $subcategory);
            }

            $total = $query->count();
            $products = $query->skip($skip)->take($limit)->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'products' => $products,
                    'category' => $category,
                    'subcategory' => $subcategory,
                    'pagination' => [
                        'page' => $page,
                        'limit' => $limit,
                        'total' => $total,
                        'pages' => ceil($total / $limit),
                    ],
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch products by category',
                'error' => config('app.debug') ? $e->getMessage() : 'Server error',
            ], 500);
        }
    }

    /**
     * @desc    Get all categories
     * @route   GET /api/products/categories
     * @access  Public
     */
    public function getCategories()
    {
        try {
            $categories = Category::where('is_active', true)
                                 ->orderBy('name')
                                 ->get();

            return response()->json([
                'success' => true,
                'data' => ['categories' => $categories],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch categories',
                'error' => config('app.debug') ? $e->getMessage() : 'Server error',
            ], 500);
        }
    }

    /**
     * @desc    Create new category
     * @route   POST /api/products/categories
     * @access  Private/Admin
     */
    public function createCategory(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'has_submenu' => 'nullable|boolean',
                'submenu' => 'nullable|array',
                'is_active' => 'nullable|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 400);
            }

            // Check if category already exists
            $existingCategory = Category::whereRaw('LOWER(name) = ?', [strtolower($request->name)])->first();

            if ($existingCategory) {
                return response()->json([
                    'success' => false,
                    'message' => 'Category already exists',
                ], 400);
            }

            $category = new Category();
            $category->name = $request->name;
            $category->has_submenu = $request->has_submenu ?? false;
            $category->submenu = $request->submenu ?? [];
            $category->is_active = $request->is_active ?? true;
            $category->save();

            return response()->json([
                'success' => true,
                'data' => ['category' => $category],
                'message' => 'Category created successfully',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create category',
                'error' => config('app.debug') ? $e->getMessage() : 'Server error',
            ], 500);
        }
    }

    /**
     * @desc    Admin - Get all products (including inactive)
     * @route   GET /api/products/admin/all
     * @access  Private/Admin
     */
    public function getAllProductsAdmin(Request $request)
    {
        try {
            $page = (int) ($request->query('page', 1));
            $limit = (int) ($request->query('limit', 10));
            $skip = ($page - 1) * $limit;

            $query = Product::query();

            if ($request->query('category')) {
                $query->where('category', 'like', '%' . $request->query('category') . '%');
            }

            if ($request->query('subcategory')) {
                $query->where('subcategory', 'like', '%' . $request->query('subcategory') . '%');
            }

            if ($request->query('isActive') !== null) {
                $query->where('is_active', $request->query('isActive') === 'true');
            }

            if ($request->query('isFeatured') !== null) {
                $query->where('is_featured', $request->query('isFeatured') === 'true');
            }

            if ($request->query('search')) {
                $searchTerm = $request->query('search');
                $query->where(function($q) use ($searchTerm) {
                    $q->where('name', 'like', '%' . $searchTerm . '%')
                      ->orWhere('description', 'like', '%' . $searchTerm . '%')
                      ->orWhere('category', 'like', '%' . $searchTerm . '%');
                });
            }

            $total = $query->count();
            $products = $query->orderByDesc('created_at')
                             ->skip($skip)
                             ->take($limit)
                             ->get();

            // Transform related_products from array to objects for each product
            $products->transform(function($product) {
                if ($product->related_products && is_array($product->related_products)) {
                    $relatedProducts = Product::whereIn('id', $product->related_products)
                        ->select('id', 'name', 'image_url', 'slug')
                        ->get();
                    $product->relatedProducts = $relatedProducts;
                }
                return $product;
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'products' => $products,
                    'pagination' => [
                        'page' => $page,
                        'limit' => $limit,
                        'total' => $total,
                        'pages' => ceil($total / $limit),
                    ],
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch products',
                'error' => config('app.debug') ? $e->getMessage() : 'Server error',
            ], 500);
        }
    }

    /**
     * Helper function to ensure category exists
     */
    private function ensureCategoryExists($categoryName, $subcategoryName = null)
    {
        try {
            $category = Category::where('name', $categoryName)->first();

            if (!$category) {
                $category = new Category();
                $category->name = $categoryName;
                $category->has_submenu = !empty($subcategoryName);
                $category->submenu = $subcategoryName ? [['name' => $subcategoryName, 'category' => $subcategoryName]] : [];
                $category->save();
            } elseif ($subcategoryName) {
                // Check if subcategory already exists in submenu
                $submenu = $category->submenu ?? [];
                $subcategoryExists = false;
                
                foreach ($submenu as $sub) {
                    if (isset($sub['name']) && $sub['name'] === $subcategoryName) {
                        $subcategoryExists = true;
                        break;
                    }
                }

                if (!$subcategoryExists) {
                    $category->has_submenu = true;
                    $submenu[] = ['name' => $subcategoryName, 'category' => $subcategoryName];
                    $category->submenu = $submenu;
                    $category->save();
                }
            }
        } catch (\Exception $e) {
            \Log::error('Error ensuring category exists: ' . $e->getMessage());
        }
    }
}
