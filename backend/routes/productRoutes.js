const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const {
  validateProductCreation,
  validateProductUpdate,
} = require("../middleware/validation");
const rateLimiter = require("../middleware/rateLimiter");
const { upload, handleUploadError } = require("../middleware/upload");
const {
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
} = require("../controllers/productController");

// Public Routes
// @route GET /api/products
router.get("/", rateLimiter.productLimiter, getAllProducts);

// @route GET /api/products/featured
router.get("/featured", rateLimiter.productLimiter, getFeaturedProducts);

// @route GET /api/products/search
router.get("/search", rateLimiter.productLimiter, searchProducts);

// @route GET /api/products/categories
router.get("/categories", rateLimiter.productLimiter, getCategories);

// @route POST /api/products/categories (Admin only)
router.post(
  "/categories",
  rateLimiter.authLimiter,
  authenticate,
  authorize("admin"),
  createCategory
);

// @route GET /api/products/category/:category
router.get(
  "/category/:category",
  rateLimiter.productLimiter,
  getProductsByCategory
);

// Admin Routes
// @route GET /api/products/admin/all
router.get(
  "/admin/all",
  rateLimiter.authLimiter,
  authenticate,
  authorize("admin"),
  getAllProductsAdmin
);

// @route POST /api/products/upload-image
router.post(
  "/upload-image",
  rateLimiter.authLimiter,
  authenticate,
  authorize("admin"),
  upload.single("image"),
  handleUploadError,
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image file provided",
        });
      }

      const imageUrl = `/uploads/${req.file.filename}`;

      res.json({
        success: true,
        message: "Image uploaded successfully",
        data: {
          imageUrl: imageUrl,
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
        },
      });
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({
        success: false,
        message: "Image upload failed",
      });
    }
  }
);

// @route OPTIONS /api/products/image/:filename - Handle CORS preflight
router.options("/image/:filename", (req, res) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    process.env.NODE_ENV === "production"
      ? "https://your-frontend-domain.com"
      : "http://localhost:5173"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", "false");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.status(200).end();
});

// @route GET /api/products/image/:filename
router.get("/image/:filename", (req, res) => {
  try {
    const path = require("path");
    const fs = require("fs");

    const filename = req.params.filename;
    const imagePath = path.join(__dirname, "../uploads", filename);

    // Set comprehensive CORS headers first (for both success and error responses)
    res.setHeader(
      "Access-Control-Allow-Origin",
      process.env.NODE_ENV === "production"
        ? "https://your-frontend-domain.com"
        : "http://localhost:5173"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", "false");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // Determine content type based on file extension
    const ext = path.extname(filename).toLowerCase();
    let contentType = "image/jpeg"; // default

    switch (ext) {
      case ".png":
        contentType = "image/png";
        break;
      case ".jpg":
      case ".jpeg":
        contentType = "image/jpeg";
        break;
      case ".gif":
        contentType = "image/gif";
        break;
      case ".webp":
        contentType = "image/webp";
        break;
      case ".svg":
        contentType = "image/svg+xml";
        break;
    }

    // Set additional headers for successful response
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=31536000"); // Cache for 1 year

    // Send file
    res.sendFile(imagePath);
  } catch (error) {
    console.error("Image serving error:", error);
    res.status(500).json({
      success: false,
      message: "Error serving image",
    });
  }
});

// @route POST /api/products
router.post(
  "/",
  rateLimiter.authLimiter,
  authenticate,
  authorize("admin"),
  validateProductCreation,
  createProduct
);

// @route PUT /api/products/:id
router.put(
  "/:id",
  rateLimiter.authLimiter,
  authenticate,
  authorize("admin"),
  validateProductUpdate,
  updateProduct
);

// @route DELETE /api/products/:id
router.delete(
  "/:id",
  rateLimiter.authLimiter,
  authenticate,
  authorize("admin"),
  deleteProduct
);

// @route GET /api/products/:identifier (must be last to avoid conflicts)
router.get("/:identifier", rateLimiter.productLimiter, getProduct);

module.exports = router;
