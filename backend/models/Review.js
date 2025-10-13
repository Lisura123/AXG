const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: "Rating must be an integer between 1 and 5",
      },
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    isApproved: {
      type: Boolean,
      default: false,
      index: true,
    },
    isHelpful: {
      type: Number,
      default: 0,
    },
    isReported: {
      type: Boolean,
      default: false,
    },
    reportReason: {
      type: String,
      trim: true,
    },
    adminResponse: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    images: [
      {
        url: String,
        caption: String,
      },
    ],
    verifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for better query performance
reviewSchema.index({ productId: 1, isApproved: 1, createdAt: -1 });
reviewSchema.index({ userId: 1, createdAt: -1 });
reviewSchema.index({ rating: 1, isApproved: 1 });

// Virtual for user details
reviewSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

// Virtual for product details
reviewSchema.virtual("product", {
  ref: "Product",
  localField: "productId",
  foreignField: "_id",
  justOne: true,
});

// Ensure virtual fields are serialized
reviewSchema.set("toJSON", { virtuals: true });
reviewSchema.set("toObject", { virtuals: true });

// Pre-save middleware to validate user hasn't already reviewed this product
reviewSchema.pre("save", async function (next) {
  if (this.isNew) {
    const existingReview = await this.constructor.findOne({
      productId: this.productId,
      userId: this.userId,
    });

    if (existingReview) {
      const error = new Error("User has already reviewed this product");
      error.status = 400;
      return next(error);
    }
  }
  next();
});

// Static method to get product rating statistics
reviewSchema.statics.getProductRatingStats = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: {
        productId: new mongoose.Types.ObjectId(productId),
        isApproved: true,
      },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: "$rating",
        },
      },
    },
    {
      $project: {
        _id: 0,
        averageRating: { $round: ["$averageRating", 1] },
        totalReviews: 1,
        ratingDistribution: {
          5: {
            $size: {
              $filter: {
                input: "$ratingDistribution",
                cond: { $eq: ["$$this", 5] },
              },
            },
          },
          4: {
            $size: {
              $filter: {
                input: "$ratingDistribution",
                cond: { $eq: ["$$this", 4] },
              },
            },
          },
          3: {
            $size: {
              $filter: {
                input: "$ratingDistribution",
                cond: { $eq: ["$$this", 3] },
              },
            },
          },
          2: {
            $size: {
              $filter: {
                input: "$ratingDistribution",
                cond: { $eq: ["$$this", 2] },
              },
            },
          },
          1: {
            $size: {
              $filter: {
                input: "$ratingDistribution",
                cond: { $eq: ["$$this", 1] },
              },
            },
          },
        },
      },
    },
  ]);

  return (
    stats[0] || {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    }
  );
};

// Instance method to mark review as helpful
reviewSchema.methods.markHelpful = function () {
  this.isHelpful += 1;
  return this.save();
};

module.exports = mongoose.model("Review", reviewSchema);
