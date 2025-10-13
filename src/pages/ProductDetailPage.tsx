import { useState, useEffect } from "react";
import { Camera, Heart, Package, CheckCircle } from "lucide-react";
import { productApi, getImageUrl } from "../lib/api";
import {
  isInWishlist as localIsInWishlist,
  toggleWishlist as localToggleWishlist,
} from "../lib/wishlist";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";
import PageTransition from "../components/PageTransition";
import ReviewDisplay from "../components/ReviewDisplay";

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

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (page: string, data?: any) => void;
}

export default function ProductDetailPage({
  productId,
  onNavigate,
}: ProductDetailPageProps) {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [product, setProduct] = useState<Product | null>(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductDetails();
    if (user) {
      checkWishlist();
    }
  }, [productId, user]);

  const fetchProductDetails = async () => {
    try {
      const response = await productApi.getById(productId);
      if (response.success) {
        setProduct(response.data.product);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
    setLoading(false);
  };

  const checkWishlist = async () => {
    if (!user || !productId) return;
    try {
      const exists = localIsInWishlist(user._id, productId);
      setIsInWishlist(exists);
    } catch (e) {
      // non-fatal: default to not in wishlist
      setIsInWishlist(false);
    }
  };

  const toggleWishlist = async () => {
    if (!user) {
      onNavigate("login");
      return;
    }

    try {
      const result = localToggleWishlist(user._id, productId);
      setIsInWishlist(result.isNowInWishlist);

      // Show notification based on action
      if (result.wasAdded && product) {
        showNotification(`"${product.name}" added to wishlist! ❤️`, "success");
      } else if (result.wasRemoved && product) {
        showNotification(`"${product.name}" removed from wishlist`, "info");
      }
    } catch (e) {
      showNotification("Failed to update wishlist. Please try again.", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#404040]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Product not found
            </h2>
            <button
              onClick={() => onNavigate("products")}
              className="text-[#404040] hover:underline"
            >
              Return to products
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => onNavigate("products")}
            className="text-[#404040] hover:text-[#1d1d1b] mb-6 flex items-center"
          >
            <span className="mr-2">&larr;</span> Back to Products
          </button>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {product.imageURL ? (
                  <img
                    src={getImageUrl(product.imageURL)}
                    alt={product.name}
                    className="w-full h-full object-contain rounded-lg p-4"
                    onError={(e) => {
                      console.log(
                        `Failed to load product image: ${getImageUrl(
                          product.imageURL
                        )}`
                      );
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">No image available</span>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-3xl font-bold text-[#1d1d1b]">
                    {product.name}
                  </h1>
                  <button
                    onClick={toggleWishlist}
                    className={`p-2 rounded-full transition-colors ${
                      isInWishlist
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        isInWishlist ? "fill-current" : ""
                      }`}
                    />
                  </button>
                </div>

                <p className="text-gray-700 leading-relaxed mb-6">
                  {product.description}
                </p>

                {product.features && product.features.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-[#1d1d1b] mb-3">
                      Key Features
                    </h3>
                    <ul className="space-y-2">
                      {product.features.map(
                        (feature: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => onNavigate("where-to-buy")}
                  className="w-full bg-[#1d1d1b] text-white py-3 rounded-lg font-semibold hover:bg-[#404040] transition-colors flex items-center justify-center space-x-2"
                >
                  <Package className="w-5 h-5" />
                  <span>Where to Buy</span>
                </button>
              </div>
            </div>

            {/* Specifications Section */}
            <div className="border-t border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-[#1d1d1b]">
                  Specifications
                </h3>
                {product.sku && (
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    SKU: {product.sku}
                  </span>
                )}
              </div>

              {product.specifications &&
              Object.keys(product.specifications).length > 0 ? (
                <div className="space-y-8">
                  {/* Key Features in Specifications */}
                  {product.features && product.features.length > 0 && (
                    <div>
                      <h4 className="text-xl font-semibold text-[#1d1d1b] mb-4">
                        Key Features
                      </h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {product.features.map(
                          (feature: string, index: number) => (
                            <div
                              key={`feature-${index}`}
                              className="bg-green-50 rounded-lg p-4 border border-green-200"
                            >
                              <div className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-800 font-medium">
                                  {feature}
                                </span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Technical Specifications */}
                  <div>
                    <h4 className="text-xl font-semibold text-[#1d1d1b] mb-4">
                      Technical Specifications
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {Object.entries(product.specifications).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                          >
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                              <span className="font-semibold text-gray-800 mb-1 sm:mb-0">
                                {key
                                  .replace(/([A-Z])/g, " $1")
                                  .replace(/^./, (str) => str.toUpperCase())}
                              </span>
                              <span className="text-gray-700 font-medium">
                                {value as string}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Show Key Features if available, even when no specifications */}
                  {product.features && product.features.length > 0 ? (
                    <div className="mb-8">
                      <h4 className="text-xl font-semibold text-[#1d1d1b] mb-4">
                        Key Features
                      </h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {product.features.map(
                          (feature: string, index: number) => (
                            <div
                              key={`fallback-feature-${index}`}
                              className="bg-green-50 rounded-lg p-4 border border-green-200"
                            >
                              <div className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-800 font-medium">
                                  {feature}
                                </span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ) : null}

                  {/* If no features either, show nothing in fallback */}
                  {!(product.features && product.features.length > 0) && (
                    <div className="text-center py-4">
                      <p className="text-gray-500 text-sm">
                        No additional specifications available.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <ReviewDisplay productId={productId} />
        </div>
      </div>
    </PageTransition>
  );
}
