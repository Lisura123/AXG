import { useState, useEffect } from "react";
import {
  Heart,
  Package,
  Filter,
  Grid,
  List,
  Share2,
  ShoppingCart,
  Star,
  Trash2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";
import PageTransition from "../components/PageTransition";
import ProductCard from "../components/ProductCard";
import { productApi } from "../lib/api";
import {
  getWishlist,
  removeFromWishlist as localRemoveFromWishlist,
} from "../lib/wishlist";

// This will be implemented when wishlist API is available
interface Product {
  _id: string;
  name: string;
  description: string;
  features: string[];
  imageURL?: string;
  category: string;
  subcategory?: string;
  isActive: boolean;
  isFeatured: boolean;
  price?: number;
  stock?: number;
  sku?: string;
  tags: string[];
  specifications?: Record<string, string>;
  metaDescription?: string;
  slug: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

interface WishlistPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export default function WishlistPage({ onNavigate }: WishlistPageProps) {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      onNavigate("login");
      return;
    }
    fetchWishlist();
  }, [user]);

  // Refresh wishlist when window regains focus or localStorage changes
  useEffect(() => {
    const handleFocus = () => {
      if (user) {
        fetchWishlist();
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (user && e.key && e.key.startsWith("axg_wishlist_")) {
        fetchWishlist();
      }
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [user]);

  const fetchWishlist = async () => {
    if (!user) return;

    try {
      // Get wishlist product IDs from localStorage
      const wishlistIds = getWishlist(user._id);

      if (wishlistIds.length === 0) {
        setWishlist([]);
        setLoading(false);
        return;
      }

      // Fetch product details for each wishlist item
      const wishlistProducts: Product[] = [];

      for (const productId of wishlistIds) {
        try {
          const response = await productApi.getById(productId);
          if (response.success && response.data.product) {
            wishlistProducts.push(response.data.product);
          }
        } catch (error) {
          console.error(`Failed to fetch product ${productId}:`, error);
          // Continue with other products even if one fails
        }
      }

      setWishlist(wishlistProducts);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishlist([]);
    }

    setLoading(false);
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    try {
      // Find the product name for the notification
      const product = wishlist.find((item) => item._id === productId);
      const productName = product?.name || "Product";

      // Remove from localStorage
      const wasRemoved = localRemoveFromWishlist(user._id, productId);

      // Update UI state
      setWishlist(wishlist.filter((item) => item._id !== productId));

      // Show notification
      if (wasRemoved) {
        showNotification(`"${productName}" removed from wishlist`, "info");
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      showNotification(
        "Failed to remove item from wishlist. Please try again.",
        "error"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#404040]"></div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
        {/* Enhanced Hero Section */}
        <div className="relative bg-gradient-to-br from-[#404040] via-[#2a2a28] to-[#1d1d1b] text-white py-20 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full animate-float"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-white/3 rounded-full animate-float-delay"></div>
            <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-white/4 rounded-full animate-pulse-slow"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between animate-fade-in-up">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mr-6 backdrop-blur-sm shadow-2xl">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  {wishlist.length > 0 && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold animate-pulse">
                      {wishlist.length}
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    My Wishlist
                  </h1>
                  <p className="text-xl text-gray-200">
                    {wishlist.length === 0
                      ? "Your personal collection awaits"
                      : `${wishlist.length} ${
                          wishlist.length === 1 ? "item" : "items"
                        } saved for later`}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              {wishlist.length > 0 && (
                <div className="hidden lg:flex items-center space-x-4 animate-fade-in-up delay-200">
                  <button className="flex items-center space-x-2 px-6 py-3 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300 text-white border border-white/20">
                    <Share2 className="w-5 h-5" />
                    <span>Share List</span>
                  </button>
                </div>
              )}
            </div>

            {/* Statistics */}
            {wishlist.length > 0 && (
              <div className="grid grid-cols-3 gap-8 max-w-2xl mt-12 animate-fade-in-up delay-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {wishlist.length}
                  </div>
                  <div className="text-sm text-gray-300">Saved Items</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-sm text-gray-300">Favorites</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-sm text-gray-300">Collections</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {wishlist.length > 0 ? (
            <div className="space-y-8">
              {/* Enhanced Controls Bar */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200/50 animate-fade-in-up">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Filter className="w-5 h-5 text-[#404040]" />
                      <span className="font-semibold text-[#1d1d1b]">
                        Sort by:
                      </span>
                    </div>
                    <select className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#404040]/20 focus:border-[#404040] transition-all duration-300 bg-gray-50 focus:bg-white">
                      <option>Date Added</option>
                      <option>Name A-Z</option>
                      <option>Name Z-A</option>
                      <option>Price Low to High</option>
                      <option>Price High to Low</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">View:</span>
                    <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-xl">
                      <button className="p-2 rounded-lg bg-[#1d1d1b] text-white shadow-md">
                        <Grid className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg text-gray-600 hover:bg-white hover:shadow-sm transition-all duration-200">
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in-up delay-100">
                {wishlist.map((product, index) => (
                  <div
                    key={product._id}
                    className={`animate-fade-in-up delay-${
                      ((index % 4) + 1) * 100
                    }`}
                  >
                    <ProductCard
                      product={product}
                      onNavigate={onNavigate}
                      variant="wishlist"
                      onRemoveFromWishlist={removeFromWishlist}
                    />
                  </div>
                ))}
              </div>

              {/* Bulk Actions */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200/50 animate-fade-in-up delay-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-[#404040] border-2 border-gray-300 rounded focus:ring-[#404040] focus:ring-2"
                    />
                    <span className="text-sm text-gray-600">
                      Select all items
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 px-6 py-3 border-2 border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-all duration-300">
                      <Trash2 className="w-5 h-5" />
                      <span>Remove Selected</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Enhanced Empty State */
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-16 text-center border border-gray-200/50 animate-fade-in-up relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#404040]/5 to-transparent rounded-bl-full"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#1d1d1b]/5 to-transparent rounded-tr-full"></div>

              <div className="relative z-10">
                {/* Enhanced Icon */}
                <div className="relative inline-block mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <Heart className="w-16 h-16 text-gray-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-[#404040] to-[#1d1d1b] rounded-full flex items-center justify-center text-white text-2xl animate-pulse">
                    +
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-[#1d1d1b] mb-4">
                  Your Wishlist Awaits
                </h3>
                <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
                  Discover amazing photography equipment and save your favorites
                  for later. Build your dream gear collection one item at a
                  time.
                </p>

                {/* Enhanced Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => onNavigate("products")}
                    className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-[#1d1d1b] to-[#404040] text-white rounded-xl hover:from-[#404040] hover:to-[#1d1d1b] transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Package className="w-6 h-6" />
                    <span>Explore Products</span>
                  </button>

                  <button
                    onClick={() => onNavigate("home")}
                    className="inline-flex items-center space-x-3 px-8 py-4 border-2 border-[#1d1d1b] text-[#1d1d1b] rounded-xl hover:bg-[#1d1d1b] hover:text-white transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Star className="w-6 h-6" />
                    <span>View Featured</span>
                  </button>
                </div>

                {/* Tips */}
                <div className="mt-12 pt-8 border-t border-gray-100">
                  <h4 className="text-lg font-bold text-[#1d1d1b] mb-4">
                    Quick Tips
                  </h4>
                  <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center justify-center space-x-2 p-3 bg-gray-50 rounded-xl">
                      <Heart className="w-4 h-4 text-[#404040]" />
                      <span>Click the heart icon on any product</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 p-3 bg-gray-50 rounded-xl">
                      <Share2 className="w-4 h-4 text-[#404040]" />
                      <span>Share your wishlist with friends</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 p-3 bg-gray-50 rounded-xl">
                      <ShoppingCart className="w-4 h-4 text-[#404040]" />
                      <span>Add items to cart easily</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
