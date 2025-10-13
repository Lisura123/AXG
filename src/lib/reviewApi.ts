const API_BASE_URL = "http://localhost:8070/api";

interface ReviewCreateData {
  productId: string;
  rating: number;
  title: string;
  comment: string;
}

interface ReviewUpdateData {
  rating?: number;
  title?: string;
  comment?: string;
}

interface ReviewReportData {
  reportReason: string;
}

export const reviewApi = {
  // Public endpoints
  async getProductReviews(productId: string) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/reviews/product/${productId}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch product reviews");
      }

      return data;
    } catch (error) {
      console.error("Error fetching product reviews:", error);
      throw error;
    }
  },

  async markReviewHelpful(reviewId: string) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/reviews/${reviewId}/helpful`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to mark review as helpful");
      }

      return data;
    } catch (error) {
      console.error("Error marking review as helpful:", error);
      throw error;
    }
  },

  // User endpoints (require authentication)
  async createReview(reviewData: ReviewCreateData) {
    try {
      const token = localStorage.getItem("axg_bolt_token");
      console.log("Token available:", !!token);
      if (!token) {
        throw new Error("Authentication required");
      }

      console.log("Sending review data:", reviewData);
      console.log("API URL:", `${API_BASE_URL}/reviews`);

      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to create review");
      }

      return data;
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  },

  async updateReview(reviewId: string, updateData: ReviewUpdateData) {
    try {
      const token = localStorage.getItem("axg_bolt_token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update review");
      }

      return data;
    } catch (error) {
      console.error("Error updating review:", error);
      throw error;
    }
  },

  async deleteReview(reviewId: string) {
    try {
      const token = localStorage.getItem("axg_bolt_token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete review");
      }

      return data;
    } catch (error) {
      console.error("Error deleting review:", error);
      throw error;
    }
  },

  async getUserReviews() {
    try {
      const token = localStorage.getItem("axg_bolt_token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${API_BASE_URL}/reviews/user/my-reviews`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch user reviews");
      }

      return data;
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      throw error;
    }
  },

  async reportReview(reviewId: string, reportData: ReviewReportData) {
    try {
      const token = localStorage.getItem("axg_bolt_token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${API_BASE_URL}/reviews/${reviewId}/report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(reportData),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to report review");
      }

      return data;
    } catch (error) {
      console.error("Error reporting review:", error);
      throw error;
    }
  },

  // Admin endpoints (require admin role)
  async adminGetAllReviews(params?: {
    page?: number;
    limit?: number;
    isApproved?: boolean;
    rating?: number;
    isReported?: boolean;
    sortBy?: string;
    sortOrder?: string;
  }) {
    try {
      const token = localStorage.getItem("axg_bolt_token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const response = await fetch(
        `${API_BASE_URL}/reviews/admin?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch admin reviews");
      }

      return data;
    } catch (error) {
      console.error("Error fetching admin reviews:", error);
      throw error;
    }
  },

  async adminUpdateReviewStatus(
    reviewId: string,
    statusData: {
      isApproved: boolean;
      adminResponse?: string;
    }
  ) {
    try {
      const token = localStorage.getItem("axg_bolt_token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${API_BASE_URL}/reviews/admin/${reviewId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(statusData),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update review status");
      }

      return data;
    } catch (error) {
      console.error("Error updating review status:", error);
      throw error;
    }
  },

  async adminDeleteReview(reviewId: string) {
    try {
      const token = localStorage.getItem("axg_bolt_token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${API_BASE_URL}/reviews/admin/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete review");
      }

      return data;
    } catch (error) {
      console.error("Error deleting review:", error);
      throw error;
    }
  },
};
