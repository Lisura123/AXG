import React, { useState, useEffect } from "react";
import {
  Star,
  EyeOff,
  Trash2,
  MessageSquare,
  AlertTriangle,
  Check,
  Clock,
  Filter,
} from "lucide-react";
import { getImageUrl } from "../lib/api";

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
    email: string;
  };
  productId: {
    _id: string;
    name: string;
    imageURL?: string;
    slug: string;
  };
  isHelpful: number;
}

interface ReviewStats {
  total: number;
  pending: number;
  approved: number;
  reported: number;
}

interface ReviewManagementProps {
  onNavigate?: (page: string, data?: any) => void;
}

const ReviewManagement: React.FC<ReviewManagementProps> = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    total: 0,
    pending: 0,
    approved: 0,
    reported: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);

  // Filters
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterRating, setFilterRating] = useState<string>("");
  const [filterReported, setFilterReported] = useState<string>("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Modal states
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [adminResponse, setAdminResponse] = useState("");

  useEffect(() => {
    fetchReviews();
  }, [
    currentPage,
    filterStatus,
    filterRating,
    filterReported,
    sortBy,
    sortOrder,
  ]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        sortBy,
        sortOrder,
      });

      if (filterStatus) params.append("isApproved", filterStatus);
      if (filterRating) params.append("rating", filterRating);
      if (filterReported) params.append("isReported", filterReported);

      const token = localStorage.getItem("axg_bolt_token");
      const response = await fetch(
        `http://localhost:8070/api/reviews/admin?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setReviews(data.data.reviews);
        setStats(data.data.stats);
        setCurrentPage(data.data.pagination.page);
        setTotalPages(data.data.pagination.pages);
        setTotalReviews(data.data.pagination.total);
      } else {
        throw new Error(data.message || "Failed to fetch reviews");
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

  const updateReviewStatus = async (
    reviewId: string,
    isApproved: boolean,
    response?: string
  ) => {
    try {
      const token = localStorage.getItem("axg_bolt_token");
      const requestBody: any = { isApproved };
      if (response) requestBody.adminResponse = response;

      const apiResponse = await fetch(
        `http://localhost:8070/api/reviews/admin/${reviewId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await apiResponse.json();

      if (data.success) {
        fetchReviews(); // Refresh the list
        setShowResponseModal(false);
        setSelectedReview(null);
        setAdminResponse("");
      } else {
        throw new Error(data.message || "Failed to update review");
      }
    } catch (error) {
      console.error("Error updating review:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update review"
      );
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this review? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("axg_bolt_token");
      const response = await fetch(
        `http://localhost:8070/api/reviews/admin/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        fetchReviews(); // Refresh the list
      } else {
        throw new Error(data.message || "Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete review"
      );
    }
  };

  const openResponseModal = (review: Review) => {
    setSelectedReview(review);
    setAdminResponse(review.adminResponse || "");
    setShowResponseModal(true);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const getStatusBadge = (review: Review) => {
    if (review.isReported) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Reported
        </span>
      );
    }
    if (review.isApproved) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Check className="w-3 h-3 mr-1" />
          Approved
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <Clock className="w-3 h-3 mr-1" />
        Pending
      </span>
    );
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Review Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage customer reviews and ratings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.total}
                </p>
                <p className="text-gray-600">Total Reviews</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.pending}
                </p>
                <p className="text-gray-600">Pending Approval</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Check className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.approved}
                </p>
                <p className="text-gray-600">Approved</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.reported}
                </p>
                <p className="text-gray-600">Reported</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="true">Approved</option>
              <option value="false">Pending</option>
            </select>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            <select
              value={filterReported}
              onChange={(e) => setFilterReported(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Reports</option>
              <option value="true">Reported</option>
              <option value="false">Not Reported</option>
            </select>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-");
                setSortBy(field);
                setSortOrder(order);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="rating-desc">Highest Rating</option>
              <option value="rating-asc">Lowest Rating</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Reviews List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Review
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reviews
                  .filter((review) => review && review._id)
                  .map((review) => (
                    <tr key={review._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-1">
                            <div className="flex items-center mb-1">
                              {renderStars(review.rating)}
                              <span className="ml-2 text-sm font-medium text-gray-900">
                                {review.rating}/5
                              </span>
                            </div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-1">
                              {review.title}
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {review.comment}
                            </p>
                            {review.isReported && review.reportReason && (
                              <p className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                                <strong>Report:</strong> {review.reportReason}
                              </p>
                            )}
                            {review.adminResponse && (
                              <p className="mt-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                <strong>Admin:</strong> {review.adminResponse}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {review.productId?.imageURL && (
                            <img
                              src={getImageUrl(review.productId.imageURL)}
                              alt={review.productId?.name || "Product Image"}
                              className="w-10 h-10 rounded-lg object-cover mr-3"
                              onError={(e) => {
                                (
                                  e.target as HTMLImageElement
                                ).src = `data:image/svg+xml;base64,${btoa(`
                                <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                                  <rect width="40" height="40" fill="#f3f4f6"/>
                                  <text x="20" y="24" font-family="Arial" font-size="10" fill="#9ca3af" text-anchor="middle">No Image</text>
                                </svg>
                              `)}`;
                              }}
                            />
                          )}
                          <span className="text-sm text-gray-900">
                            {review.productId?.name || "Product Not Found"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {review.userId?.firstName || "Unknown"}{" "}
                            {review.userId?.lastName || "User"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {review.userId?.email || "No email available"}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(review)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {!review.isApproved && (
                            <button
                              onClick={() =>
                                updateReviewStatus(review._id, true)
                              }
                              className="text-green-600 hover:text-green-900"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          {review.isApproved && (
                            <button
                              onClick={() =>
                                updateReviewStatus(review._id, false)
                              }
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Unapprove"
                            >
                              <EyeOff className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => openResponseModal(review)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Add Response"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteReview(review._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing page {currentPage} of {totalPages} ({totalReviews} total
            reviews)
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>

        {/* Admin Response Modal */}
        {showResponseModal && selectedReview && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Admin Response for Review
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  "{selectedReview.title}" by{" "}
                  {selectedReview.userId?.firstName || "Unknown"}{" "}
                  {selectedReview.userId?.lastName || "User"}
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Response (optional)
                </label>
                <textarea
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add an optional response to this review..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowResponseModal(false);
                    setSelectedReview(null);
                    setAdminResponse("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    updateReviewStatus(selectedReview._id, false, adminResponse)
                  }
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Reject
                </button>
                <button
                  onClick={() =>
                    updateReviewStatus(selectedReview._id, true, adminResponse)
                  }
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewManagement;
