import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  Users,
  MessageSquare,
  Plus,
  CreditCard as Edit,
  Trash2,
  X,
  Camera,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import PageTransition from "../components/PageTransition";
import UserManagement from "../components/UserManagement";
import ReviewManagement from "../components/ReviewManagement";
import { authApi } from "../lib/api";

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<"products" | "users" | "reviews">(
    "products"
  );

  useEffect(() => {
    if (!user || !isAdmin) {
      onNavigate("home");
    }
  }, [user, isAdmin]);

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-[#404040] to-[#1d1d1b] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <div className="flex items-center">
                <LayoutDashboard className="w-10 h-10 mr-4" />
                <div>
                  <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                  <p className="text-gray-200">Manage your AXG store</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Admin Promotion - Development Only */}
        {user && user.role !== "admin" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800">
                    Development Mode
                  </h3>
                  <p className="text-yellow-700">
                    You need admin privileges to access this dashboard.
                  </p>
                </div>
                <button
                  onClick={async () => {
                    try {
                      const result = await authApi.promoteToAdmin();
                      if (result.success) {
                        alert(
                          "✅ Successfully promoted to admin! Please refresh the page."
                        );
                        window.location.reload();
                      }
                    } catch (error) {
                      console.error("Error promoting to admin:", error);
                      alert(
                        "❌ Failed to promote to admin. Check console for details."
                      );
                    }
                  }}
                  className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
                >
                  Promote to Admin
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto">
                <button
                  onClick={() => setActiveTab("products")}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === "products"
                      ? "border-b-2 border-[#1d1d1b] text-[#1d1d1b]"
                      : "text-gray-600 hover:text-[#1d1d1b]"
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span>Products</span>
                </button>
                <button
                  onClick={() => setActiveTab("users")}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === "users"
                      ? "border-b-2 border-[#1d1d1b] text-[#1d1d1b]"
                      : "text-gray-600 hover:text-[#1d1d1b]"
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span>Users</span>
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === "reviews"
                      ? "border-b-2 border-[#1d1d1b] text-[#1d1d1b]"
                      : "text-gray-600 hover:text-[#1d1d1b]"
                  }`}
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Reviews</span>
                </button>
              </div>
            </div>
          </div>

          {activeTab === "products" && <ProductManagement />}
          {activeTab === "users" && <UserManagement />}
          {activeTab === "reviews" && <ReviewManagement />}
        </div>
      </div>
    </PageTransition>
  );
}

function ProductManagement() {
  // Import the comprehensive ProductManagement component
  const ProductManagementComponent = React.lazy(
    () => import("../components/ProductManagement")
  );

  return (
    <React.Suspense
      fallback={
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <ProductManagementComponent />
    </React.Suspense>
  );
}

// UserManagement component commented out - needs backend API implementation
/*
function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // TODO: Implement with backend API
      // const { data } = await userApi.getAll();
      setUsers([]);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#1d1d1b] mb-6">
        User Management
      </h2>
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#404040] rounded-full flex items-center justify-center text-white font-semibold mr-3">
                        {user.full_name?.[0] || "U"}
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.full_name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {user.phone || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {user.is_admin ? "Yes" : "No"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
*/

// ReviewManagement component commented out - needs backend API implementation
/*
function ReviewManagement() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*, user_profiles(full_name), products(name)")
      .order("created_at", { ascending: false });
    if (data) setReviews(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      await supabase.from("reviews").delete().eq("id", id);
      fetchReviews();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#1d1d1b] mb-6">
        Review Management
      </h2>
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-[#404040] rounded-full flex items-center justify-center text-white font-semibold mr-2">
                      {review.user_profiles?.full_name?.[0] || "U"}
                    </div>
                    <span className="font-medium text-gray-900">
                      {review.user_profiles?.full_name || "Anonymous"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Product: {review.products?.name || "Unknown"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="mb-2">
                <div className="flex mb-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < review.rating ? "text-yellow-400" : "text-gray-300"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <h4 className="font-semibold text-gray-900">{review.title}</h4>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
*/
