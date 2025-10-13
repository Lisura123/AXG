const Product = require("../models/Product");
const Category = require("../models/Category");

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query
    const query = { isActive: true };

    // Handle multiple categories (comma-separated)
    if (req.query.categories) {
      const categoryList = req.query.categories
        .split(",")
        .map((cat) => cat.trim());
      query.category = { $in: categoryList };
    } else if (req.query.category) {
      query.category = new RegExp(req.query.category, "i");
    }

    if (req.query.subcategory) {
      query.subcategory = new RegExp(req.query.subcategory, "i");
    }

    if (req.query.isFeatured !== undefined) {
      query.isFeatured = req.query.isFeatured === "true";
    }

    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
        { category: { $regex: req.query.search, $options: "i" } },
        { subcategory: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const products = await Product.find(query)
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("relatedProducts", "name imageURL slug");

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error:
        process.env.NODE_ENV === "development" ? error.message : "Server error",
    });
  }
};

// @desc    Get product by ID or slug
// @route   GET /api/products/:identifier
// @access  Public
const getProduct = async (req, res) => {
  try {
    const { identifier } = req.params;

    // Try to find by ID first, then by slug
    let product = await Product.findById(identifier).populate(
      "relatedProducts",
      "name imageURL slug"
    );

    if (!product) {
      product = await Product.findOne({ slug: identifier }).populate(
        "relatedProducts",
        "name imageURL slug"
      );
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Increment view count
    await product.incrementViewCount();

    res.json({
      success: true,
      data: { product },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error:
        process.env.NODE_ENV === "development" ? error.message : "Server error",
    });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    console.log("🚀 CREATE PRODUCT FUNCTION CALLED");
    console.log("Create Product Request - Body keys:", Object.keys(req.body));

    const {
      name,
      description,
      features,
      imageURL,
      category,
      subcategory,
      isActive,
      isFeatured,
      price,
      stock,
      sku,
      tags,
      specifications,
      metaDescription,
      relatedProducts,
    } = req.body;

    console.log("ImageURL value:", imageURL);
    console.log("ImageURL type:", typeof imageURL);
    console.log("ImageURL length:", imageURL?.length);
    console.log(
      "ImageURL starts with data:image/:",
      imageURL?.startsWith("data:image/")
    );

    // Test the validator logic
    if (imageURL) {
      const validatorResult = imageURL.startsWith("data:image/");
      console.log("Manual validator test result:", validatorResult);
    }

    // Auto-create category if it doesn't exist
    await ensureCategoryExists(category, subcategory);

    const product = new Product({
      name,
      description,
      features,
      imageURL: imageURL && imageURL.trim() !== "" ? imageURL : undefined, // Only set if not empty
      category,
      subcategory,
      isActive: isActive !== undefined ? isActive : true,
      isFeatured: isFeatured !== undefined ? isFeatured : false,
      price,
      stock,
      sku,
      tags,
      specifications,
      metaDescription,
      relatedProducts,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: { product },
    });
  } catch (error) {
    console.log("Create Product Error:", error);
    console.log("Error name:", error.name);
    console.log("Error code:", error.code);
    console.log("Error message:", error.message);
    console.log("Full error object:", JSON.stringify(error, null, 2));

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Product with this SKU or slug already exists",
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors,
      });
    }

    // Handle cast errors (invalid ObjectId, etc.)
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: `Invalid ${error.path}: ${error.value}`,
      });
    }

    console.error("Product creation error:", error);
    res.status(400).json({
      success: false,
      message: "Product creation failed",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Creation error",
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    console.log("Update Product Request - ID:", req.params.id);
    console.log("Update Product Request - Body keys:", Object.keys(req.body));

    const allowedUpdates = [
      "name",
      "description",
      "features",
      "imageURL",
      "category",
      "subcategory",
      "isActive",
      "isFeatured",
      "price",
      "stock",
      "sku",
      "tags",
      "specifications",
      "metaDescription",
      "relatedProducts",
    ];

    const updates = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        // Don't include imageURL if it's empty or undefined (preserve existing image)
        if (
          key === "imageURL" &&
          (!req.body[key] || req.body[key].trim() === "")
        ) {
          return; // Skip empty imageURL
        }
        updates[key] = req.body[key];
      }
    });

    console.log("Filtered updates:", Object.keys(updates));
    console.log("ImageURL value:", updates.imageURL);
    console.log("ImageURL type:", typeof updates.imageURL);
    console.log("ImageURL length:", updates.imageURL?.length);
    console.log(
      "Updates content:",
      JSON.stringify(updates, null, 2).substring(0, 500) + "..."
    );

    // Auto-create category if it doesn't exist and category is being updated
    if (updates.category) {
      await ensureCategoryExists(updates.category, updates.subcategory);
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate("relatedProducts", "name imageURL slug");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      data: { product },
    });
  } catch (error) {
    console.log("Update Product Error:", error);
    console.log("Error name:", error.name);
    console.log("Error code:", error.code);
    console.log("Error message:", error.message);
    console.log("Full error object:", JSON.stringify(error, null, 2));

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Product with this SKU or slug already exists",
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors,
      });
    }

    // Handle cast errors (invalid ObjectId, etc.)
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: `Invalid ${error.path}: ${error.value}`,
      });
    }

    console.error("Product update error:", error);
    res.status(400).json({
      success: false,
      message: "Product update failed",
      error:
        process.env.NODE_ENV === "development" ? error.message : "Update error",
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Product deletion failed",
      error:
        process.env.NODE_ENV === "development" ? error.message : "Server error",
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    const products = await Product.findFeatured(limit);

    res.json({
      success: true,
      data: { products },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch featured products",
      error:
        process.env.NODE_ENV === "development" ? error.message : "Server error",
    });
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
const searchProducts = async (req, res) => {
  try {
    const { q, category, subcategory, isFeatured } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const options = {
      category: category || null,
      subcategory: subcategory || null,
      isFeatured: isFeatured ? isFeatured === "true" : undefined,
    };

    const products = await Product.searchProducts(q, options)
      .skip(skip)
      .limit(limit);

    const total = await Product.searchProducts(q, options).countDocuments();

    res.json({
      success: true,
      data: {
        products,
        searchTerm: q,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Search failed",
      error:
        process.env.NODE_ENV === "development" ? error.message : "Server error",
    });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { subcategory } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const products = await Product.findByCategory(category, subcategory)
      .skip(skip)
      .limit(limit);

    const query = { category, isActive: true };
    if (subcategory) query.subcategory = subcategory;

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: {
        products,
        category,
        subcategory: subcategory || null,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products by category",
      error:
        process.env.NODE_ENV === "development" ? error.message : "Server error",
    });
  }
};

// @desc    Get all categories
// @route   GET /api/products/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({
      name: 1,
    });

    res.json({
      success: true,
      data: { categories },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error:
        process.env.NODE_ENV === "development" ? error.message : "Server error",
    });
  }
};

// @desc    Create new category
// @route   POST /api/products/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    const { name, hasSubmenu, submenu, isActive } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    // Create new category
    const category = new Category({
      name,
      hasSubmenu: hasSubmenu || false,
      submenu: submenu || [],
      isActive: isActive !== undefined ? isActive : true,
    });

    await category.save();

    res.status(201).json({
      success: true,
      data: { category },
      message: "Category created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create category",
      error:
        process.env.NODE_ENV === "development" ? error.message : "Server error",
    });
  }
};

// @desc    Admin - Get all products (including inactive)
// @route   GET /api/products/admin/all
// @access  Private/Admin
const getAllProductsAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};

    if (req.query.category) {
      query.category = new RegExp(req.query.category, "i");
    }

    if (req.query.subcategory) {
      query.subcategory = new RegExp(req.query.subcategory, "i");
    }

    if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === "true";
    }

    if (req.query.isFeatured !== undefined) {
      query.isFeatured = req.query.isFeatured === "true";
    }

    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
        { category: { $regex: req.query.search, $options: "i" } },
        { sku: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("relatedProducts", "name imageURL slug");

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error:
        process.env.NODE_ENV === "development" ? error.message : "Server error",
    });
  }
};

// Helper function to ensure category exists
const ensureCategoryExists = async (categoryName, subcategoryName) => {
  try {
    let category = await Category.findOne({ name: categoryName });

    if (!category) {
      category = new Category({
        name: categoryName,
        hasSubmenu: !!subcategoryName,
        submenu: subcategoryName
          ? [{ name: subcategoryName, category: subcategoryName }]
          : [],
      });
      await category.save();
    } else if (
      subcategoryName &&
      !category.submenu.some((sub) => sub.name === subcategoryName)
    ) {
      category.hasSubmenu = true;
      category.submenu.push({
        name: subcategoryName,
        category: subcategoryName,
      });
      await category.save();
    }
  } catch (error) {
    console.error("Error ensuring category exists:", error);
  }
};

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  searchProducts,
  getProductsByCategory,
  getCategories,
  createCategory,
  getAllProductsAdmin,
};
