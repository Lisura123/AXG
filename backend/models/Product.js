const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    features: [
      {
        type: String,
        trim: true,
        maxlength: [500, "Feature description cannot exceed 500 characters"],
      },
    ],
    imageURL: {
      type: String,
      required: false, // Make it optional
      validate: {
        validator: function (url) {
          // If no URL provided, it's valid (optional field)
          if (!url || url.trim() === "") return true;

          // Allow data URLs (base64 encoded images)
          if (url.startsWith("data:image/")) return true;

          // Allow local paths starting with /
          if (url.startsWith("/")) return true;

          // Allow relative paths starting with ./
          if (url.startsWith("./")) return true;

          // Allow HTTP/HTTPS URLs
          if (url.startsWith("http://") || url.startsWith("https://")) {
            try {
              const urlObj = new URL(url);
              return true; // If URL is valid, accept it
            } catch (e) {
              return false;
            }
          }

          // Allow file system paths (for development)
          if (url.includes("/") || url.includes("\\")) return true;

          // Allow simple filenames with common image extensions
          const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff)$/i;
          if (imageExtensions.test(url)) return true;

          return false;
        },
        message: "Image URL must be a valid URL, file path, or image filename",
      },
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      maxlength: [100, "Category cannot exceed 100 characters"],
    },
    subcategory: {
      type: String,
      trim: true,
      maxlength: [100, "Subcategory cannot exceed 100 characters"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    // Additional fields for better product management
    price: {
      type: Number,
      min: [0, "Price cannot be negative"],
    },
    stock: {
      type: Number,
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values
      trim: true,
      uppercase: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    specifications: {
      type: Map,
      of: String,
    },
    // SEO fields
    slug: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    metaDescription: {
      type: String,
      maxlength: [160, "Meta description cannot exceed 160 characters"],
    },
    // Analytics
    viewCount: {
      type: Number,
      default: 0,
    },
    // Relationships
    relatedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better performance
productSchema.index({ name: "text", description: "text" }); // Text search
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ isActive: 1, isFeatured: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ createdAt: -1 });

// Virtual for full category path
productSchema.virtual("fullCategory").get(function () {
  return this.subcategory
    ? `${this.category} > ${this.subcategory}`
    : this.category;
});

// Pre-save middleware to generate slug
productSchema.pre("save", function (next) {
  if (this.isModified("name") || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single
      .trim("-"); // Remove leading/trailing hyphens

    // Add timestamp to ensure uniqueness
    if (!this.sku) {
      const timestamp = Date.now().toString().slice(-6);
      this.slug += `-${timestamp}`;
    }
  }
  next();
});

// Pre-save middleware to generate SKU if not provided
productSchema.pre("save", function (next) {
  if (!this.sku && this.isNew) {
    const categoryCode = this.category.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    this.sku = `${categoryCode}${timestamp}`;
  }
  next();
});

// Static method to get products by category
productSchema.statics.findByCategory = function (category, subcategory) {
  const query = { category, isActive: true };
  if (subcategory) {
    query.subcategory = subcategory;
  }
  return this.find(query).sort({ isFeatured: -1, createdAt: -1 });
};

// Static method to get featured products
productSchema.statics.findFeatured = function (limit = 10) {
  return this.find({ isFeatured: true, isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to search products
productSchema.statics.searchProducts = function (searchTerm, options = {}) {
  const query = {
    $and: [
      { isActive: true },
      {
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
          { category: { $regex: searchTerm, $options: "i" } },
          { subcategory: { $regex: searchTerm, $options: "i" } },
          { tags: { $in: [new RegExp(searchTerm, "i")] } },
        ],
      },
    ],
  };

  if (options.category) {
    query.$and.push({ category: options.category });
  }

  if (options.subcategory) {
    query.$and.push({ subcategory: options.subcategory });
  }

  if (options.isFeatured !== undefined) {
    query.$and.push({ isFeatured: options.isFeatured });
  }

  return this.find(query).sort({ isFeatured: -1, createdAt: -1 });
};

// Instance method to increment view count
productSchema.methods.incrementViewCount = function () {
  this.viewCount += 1;
  return this.save({ validateBeforeSave: false });
};

module.exports = mongoose.model("Product", productSchema);
