const Review = require("../models/Review");
const Product = require("../models/Product");
const User = require("../models/User");

// Get all reviews for a product (public)
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      rating = null,
    } = req.query;

    const query = {
      productId,
      isApproved: true,
    };

    if (rating) {
      query.rating = parseInt(rating);
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 },
      populate: {
        path: "userId",
        select: "firstName lastName",
      },
    };

    const reviews = await Review.find(query)
      .populate(options.populate)
      .sort(options.sort)
      .limit(options.limit * 1)
      .skip((options.page - 1) * options.limit)
      .exec();

    const totalReviews = await Review.countDocuments(query);
    const totalPages = Math.ceil(totalReviews / options.limit);

    // Get rating statistics
    const ratingStats = await Review.getProductRatingStats(productId);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: options.page,
          pages: totalPages,
          total: totalReviews,
          limit: options.limit,
        },
        ratingStats,
      },
    });
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

// Create a new review (authenticated users)
const createReview = async (req, res) => {
  try {
    console.log("Create review request body:", req.body);
    console.log("User from auth:", req.user);

    const { productId, rating, title, comment, images = [] } = req.body;
    const userId = req.user._id;

    console.log("Extracted data:", {
      productId,
      rating,
      title,
      comment,
      userId,
    });

    // Validate required fields
    if (!productId || !rating || !title || !comment) {
      return res.status(400).json({
        success: false,
        message: "Product ID, rating, title, and comment are required",
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Create review
    const review = new Review({
      productId,
      userId,
      rating: parseInt(rating),
      title: title.trim(),
      comment: comment.trim(),
      images: images.filter((img) => img.url), // Only include images with URLs
    });

    await review.save();

    // Populate user details for response
    await review.populate("userId", "firstName lastName");

    res.status(201).json({
      success: true,
      message:
        "Review submitted successfully. It will be visible after approval.",
      data: review,
    });
  } catch (error) {
    console.error("Error creating review:", error);

    if (error.message === "User has already reviewed this product") {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create review",
      error: error.message,
    });
  }
};

// Update user's own review
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, comment, images } = req.body;
    const userId = req.user.id;

    const review = await Review.findOne({ _id: reviewId, userId });
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found or unauthorized",
      });
    }

    // Update fields if provided
    if (rating !== undefined) review.rating = parseInt(rating);
    if (title !== undefined) review.title = title.trim();
    if (comment !== undefined) review.comment = comment.trim();
    if (images !== undefined) review.images = images.filter((img) => img.url);

    // Reset approval status for updated reviews
    review.isApproved = false;

    await review.save();
    await review.populate("userId", "firstName lastName");

    res.json({
      success: true,
      message:
        "Review updated successfully. It will be re-reviewed for approval.",
      data: review,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update review",
      error: error.message,
    });
  }
};

// Delete user's own review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findOneAndDelete({ _id: reviewId, userId });
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found or unauthorized",
      });
    }

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: error.message,
    });
  }
};

// Mark review as helpful
const markReviewHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    await review.markHelpful();

    res.json({
      success: true,
      message: "Review marked as helpful",
      data: { helpfulCount: review.isHelpful },
    });
  } catch (error) {
    console.error("Error marking review as helpful:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark review as helpful",
      error: error.message,
    });
  }
};

// Report a review
const reportReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Report reason is required",
      });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    review.isReported = true;
    review.reportReason = reason.trim();
    await review.save();

    res.json({
      success: true,
      message: "Review reported successfully",
    });
  } catch (error) {
    console.error("Error reporting review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to report review",
      error: error.message,
    });
  }
};

// Get user's reviews (authenticated)
const getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
    };

    const reviews = await Review.find({ userId })
      .populate("productId", "name imageURL slug")
      .sort({ createdAt: -1 })
      .limit(options.limit * 1)
      .skip((options.page - 1) * options.limit)
      .exec();

    const totalReviews = await Review.countDocuments({ userId });
    const totalPages = Math.ceil(totalReviews / options.limit);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: options.page,
          pages: totalPages,
          total: totalReviews,
          limit: options.limit,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

// Admin: Get all reviews with filters
const adminGetAllReviews = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      isApproved = null,
      isReported = null,
      rating = null,
      productId = null,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};
    if (isApproved !== null) query.isApproved = isApproved === "true";
    if (isReported !== null) query.isReported = isReported === "true";
    if (rating) query.rating = parseInt(rating);
    if (productId) query.productId = productId;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 },
    };

    const reviews = await Review.find(query)
      .populate("userId", "firstName lastName email")
      .populate("productId", "name imageURL slug")
      .sort(options.sort)
      .limit(options.limit * 1)
      .skip((options.page - 1) * options.limit)
      .exec();

    const totalReviews = await Review.countDocuments(query);
    const totalPages = Math.ceil(totalReviews / options.limit);

    // Get statistics
    const stats = {
      total: await Review.countDocuments(),
      pending: await Review.countDocuments({ isApproved: false }),
      approved: await Review.countDocuments({ isApproved: true }),
      reported: await Review.countDocuments({ isReported: true }),
    };

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: options.page,
          pages: totalPages,
          total: totalReviews,
          limit: options.limit,
        },
        stats,
      },
    });
  } catch (error) {
    console.error("Error fetching admin reviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

// Admin: Approve/reject review
const adminUpdateReviewStatus = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { isApproved, adminResponse } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (isApproved !== undefined) review.isApproved = isApproved;
    if (adminResponse !== undefined)
      review.adminResponse = adminResponse.trim();

    await review.save();
    await review.populate(["userId", "productId"]);

    res.json({
      success: true,
      message: `Review ${isApproved ? "approved" : "rejected"} successfully`,
      data: review,
    });
  } catch (error) {
    console.error("Error updating review status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update review status",
      error: error.message,
    });
  }
};

// Admin: Delete review
const adminDeleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: error.message,
    });
  }
};

module.exports = {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  markReviewHelpful,
  reportReview,
  getUserReviews,
  adminGetAllReviews,
  adminUpdateReviewStatus,
  adminDeleteReview,
};
