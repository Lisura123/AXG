const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/reviewController");
const { authenticate, authorize } = require("../middleware/auth");

// Debug route
router.get("/test", (req, res) => {
  res.json({ message: "Review routes are working!" });
});

// Public routes
router.get("/product/:productId", getProductReviews);
router.post("/:reviewId/helpful", markReviewHelpful);

// Authenticated user routes - individual middleware
router.post("/", authenticate, createReview);
router.get("/user/my-reviews", authenticate, getUserReviews);
router.put("/:reviewId", authenticate, updateReview);
router.delete("/:reviewId", authenticate, deleteReview);
router.post("/:reviewId/report", authenticate, reportReview);

// Admin routes (admin middleware includes authentication)
router.get("/admin", authenticate, authorize(["admin"]), adminGetAllReviews);
router.put(
  "/admin/:reviewId/status",
  authenticate,
  authorize(["admin"]),
  adminUpdateReviewStatus
);
router.delete(
  "/admin/:reviewId",
  authenticate,
  authorize(["admin"]),
  adminDeleteReview
);

module.exports = router;
