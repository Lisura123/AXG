import React, { useState, useEffect } from "react";
import {
  Star,
  ThumbsUp,
  Flag,
  MessageSquare,
  Plus,
  X,
  Send,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { reviewApi } from "../lib/reviewApi";

interface ReviewDisplayProps {
  productId: string;
}

interface Review {
  _id: string;
  rating: number;
  title: string;
  comment: string;
  isApproved: boolean;
  isReported: boolean;
  reportReason?: string;
  adminResponse?: string;
  createdAt: string;
  updatedAt: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  isHelpful: number;
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
}

const ReviewDisplay: React.FC<ReviewDisplayProps> = ({ productId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    title: "",
    comment: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Report modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingReviewId, setReportingReviewId] = useState<string | null>(
    null
  );
  const [reportReason, setReportReason] = useState("");

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await reviewApi.getProductReviews(productId);

      if (response.success) {
        setReviews(response.data?.reviews || []);
        setStats(
          response.data?.stats || {
            totalReviews: 0,
            averageRating: 0,
            ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          }
        );
      } else {
        throw new Error(response.message || "Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch reviews"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("Please login to submit a review");
      return;
    }

    if (formData.rating === 0) {
      alert("Please select a rating");
      return;
    }

    try {
      setSubmitting(true);
      console.log("Creating review for productId:", productId);
      await reviewApi.createReview({
        productId,
        rating: formData.rating,
        title: formData.title,
        comment: formData.comment,
      });

      // Reset form
      setFormData({ rating: 0, title: "", comment: "" });
      setShowReviewForm(false);

      // Refresh reviews
      await fetchReviews();

      alert(
        "Review submitted successfully! It will be visible after admin approval."
      );
    } catch (error) {
      console.error("Error creating review:", error);
      alert(error instanceof Error ? error.message : "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkHelpful = async (reviewId: string) => {
    try {
      await reviewApi.markReviewHelpful(reviewId);
      // Refresh reviews to update helpful count
      await fetchReviews();
    } catch (error) {
      console.error("Error marking review helpful:", error);
      alert("Failed to mark review as helpful");
    }
  };

  const handleReportReview = async () => {
    if (!user) {
      alert("Please login to report a review");
      return;
    }

    if (!reportingReviewId || !reportReason.trim()) {
      alert("Please provide a reason for reporting this review");
      return;
    }

    try {
      await reviewApi.reportReview(reportingReviewId, {
        reportReason: reportReason.trim(),
      });

      setShowReportModal(false);
      setReportingReviewId(null);
      setReportReason("");

      alert("Review reported successfully. Our team will review it.");
      await fetchReviews();
    } catch (error) {
      console.error("Error reporting review:", error);
      alert(error instanceof Error ? error.message : "Failed to report review");
    }
  };

  const renderStars = (
    rating: number,
    interactive = false,
    onRatingChange?: (rating: number) => void
  ) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 cursor-pointer transition-colors ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        } ${interactive ? "hover:text-yellow-400" : ""}`}
        onClick={() =>
          interactive && onRatingChange && onRatingChange(index + 1)
        }
      />
    ));
  };

  const renderRatingDistribution = () => {
    const ratingDistribution = stats?.ratingDistribution || {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    const maxCount = Math.max(...Object.values(ratingDistribution));

    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center space-x-3">
            <span className="text-sm font-medium w-8">{rating}</span>
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full"
                style={{
                  width:
                    maxCount > 0
                      ? `${(ratingDistribution[rating] / maxCount) * 100}%`
                      : "0%",
                }}
              />
            </div>
            <span className="text-sm text-gray-600 w-8">
              {ratingDistribution[rating]}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>
        {user && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Write Review</span>
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {stats?.averageRating?.toFixed(1) || "0.0"}
          </div>
          <div className="flex justify-center mb-2">
            {renderStars(Math.round(stats?.averageRating || 0))}
          </div>
          <p className="text-gray-600">
            Based on {stats?.totalReviews || 0} review
            {(stats?.totalReviews || 0) !== 1 ? "s" : ""}
          </p>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 mb-3">
            Rating Distribution
          </h4>
          {renderRatingDistribution()}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="border-b border-gray-200 pb-6 last:border-b-0"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    {renderStars(review.rating)}
                    <span className="font-medium text-gray-900">
                      {review.userId.firstName} {review.userId.lastName}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleMarkHelpful(review._id)}
                    className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 text-sm"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>Helpful ({review.isHelpful})</span>
                  </button>
                  <button
                    onClick={() => {
                      setReportingReviewId(review._id);
                      setShowReportModal(true);
                    }}
                    className="text-gray-500 hover:text-red-600 p-1"
                    title="Report review"
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h4 className="font-semibold text-gray-900 mb-2">
                {review.title}
              </h4>
              <p className="text-gray-700 mb-3">{review.comment}</p>

              {review.adminResponse && (
                <div className="bg-blue-50 p-3 rounded-lg mt-3">
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    Response from AXG:
                  </p>
                  <p className="text-sm text-blue-800">
                    {review.adminResponse}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Write a Review
              </h3>
              <button
                onClick={() => setShowReviewForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating *
                </label>
                <div className="flex space-x-1">
                  {renderStars(formData.rating, true, (rating) =>
                    setFormData((prev) => ({ ...prev, rating }))
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Summarize your experience"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Share your thoughts about this product..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>{submitting ? "Submitting..." : "Submit Review"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Report Review
              </h3>
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportingReviewId(null);
                  setReportReason("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Please let us know why you're reporting this review:
              </p>

              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the issue with this review..."
              />

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowReportModal(false);
                    setReportingReviewId(null);
                    setReportReason("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReportReview}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Report Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewDisplay;
