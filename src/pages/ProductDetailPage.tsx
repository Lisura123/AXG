import { useState, useEffect } from "react";
import { Camera, Heart, Package, CheckCircle, Star, ShoppingBag, Share2, ChevronLeft, ChevronRight } from "lucide-react";
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
  id: string;
  name: string;
  description: string;
  features: string[];
  image_url?: string;
  images?: string[];
  category: string;
  subcategory?: string;
  is_active: boolean;
  is_featured: boolean;
  price?: number;
  stock?: number;
  sku?: string;
  tags?: string[];
  specifications?: Record<string, string>;
  meta_description?: string;
  slug: string;
  view_count?: number;
  created_at: string;
  updated_at: string;
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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
        setSelectedImageIndex(0); // Reset to first image when product changes
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

  // Generate gallery images - combine main image and additional images
  const galleryImages = product 
    ? [
        ...(product.image_url ? [product.image_url] : []),
        ...(product.images && Array.isArray(product.images) ? product.images : [])
      ].filter(Boolean)
    : [];

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Breadcrumb Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => onNavigate("products")}
              className="group flex items-center text-sm text-gray-600 hover:text-[#1d1d1b] transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Products</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Main Product Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 p-6 lg:p-10">
              {/* Image Gallery */}
              <div className="space-y-4">
                {/* Main Image Display */}
                <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden group border border-gray-200">
                  {galleryImages.length > 0 ? (
                    <>
                      <img
                        src={getImageUrl(galleryImages[selectedImageIndex])}
                        alt={`${product.name} - View ${selectedImageIndex + 1}`}
                        className="w-full h-full object-contain p-6 transition-all duration-500 group-hover:scale-105"
                        onError={(e) => {
                          console.log(
                            `Failed to load product image: ${getImageUrl(
                              galleryImages[selectedImageIndex]
                            )}`
                          );
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      
                      {/* Navigation Arrows for Multiple Images */}
                      {galleryImages.length > 1 && (
                        <>
                          <button
                            onClick={() => setSelectedImageIndex((prev) => 
                              prev === 0 ? galleryImages.length - 1 : prev - 1
                            )}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setSelectedImageIndex((prev) => 
                              prev === galleryImages.length - 1 ? 0 : prev + 1
                            )}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="w-20 h-20 text-gray-300 mx-auto mb-3" />
                        <span className="text-gray-400 text-sm font-medium">No image available</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Image counter badge */}
                  {galleryImages.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
                      {selectedImageIndex + 1} / {galleryImages.length}
                    </div>
                  )}
                </div>

                {/* Thumbnail Navigation */}
                {galleryImages.length > 1 && (
                  <div className="grid grid-cols-5 gap-3">
                    {galleryImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                          selectedImageIndex === index
                            ? "border-[#1d1d1b] ring-2 ring-[#1d1d1b]/20 ring-offset-2 scale-105"
                            : "border-gray-200 hover:border-gray-400 hover:scale-105"
                        }`}
                      >
                        <img
                          src={getImageUrl(img)}
                          alt={`${product.name} thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex flex-col">
                {/* Header Section */}
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h1 className="text-3xl lg:text-4xl font-bold text-[#1d1d1b] mb-2 leading-tight">
                        {product.name}
                      </h1>
                      {product.category && (
                        <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                          {product.category}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={toggleWishlist}
                        className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                          isInWishlist
                            ? "bg-red-50 text-red-600 shadow-lg shadow-red-100"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <Heart
                          className={`w-6 h-6 ${
                            isInWishlist ? "fill-current" : ""
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          showNotification("Link copied to clipboard!", "success");
                        }}
                        className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-300 hover:scale-110"
                        title="Share product"
                      >
                        <Share2 className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  {/* Rating placeholder */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">4.0 (Reviews below)</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8 pb-8 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-[#1d1d1b] mb-3">About This Product</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Key Features */}
                {product.features && product.features.length > 0 && (
                  <div className="mb-8 pb-8 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-[#1d1d1b] mb-4">
                      Key Features
                    </h3>
                    <ul className="grid gap-3">
                      {product.features.map(
                        (feature: string, index: number) => (
                          <li key={index} className="flex items-start group">
                            <div className="flex-shrink-0 mt-0.5">
                              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </div>
                            </div>
                            <span className="ml-3 text-gray-700 leading-relaxed">{feature}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="mt-auto space-y-3">
                  <button
                    onClick={() => onNavigate("where-to-buy")}
                    className="w-full bg-gradient-to-r from-[#1d1d1b] to-[#404040] text-white py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 group"
                  >
                    <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Where to Buy</span>
                  </button>
                  
                  <button
                    onClick={() => onNavigate("contact")}
                    className="w-full bg-white border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:border-[#1d1d1b] hover:bg-gray-50 transition-all duration-300"
                  >
                    Contact Us for Details
                  </button>
                </div>
              </div>
            </div>

            {/* Specifications Section */}
            <div className="border-t border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8 lg:p-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl lg:text-3xl font-bold text-[#1d1d1b]">
                  Specifications
                </h3>
                {product.sku && (
                  <span className="text-sm text-gray-600 bg-white px-4 py-2 rounded-full border border-gray-200 font-medium">
                    SKU: {product.sku}
                  </span>
                )}
              </div>

              {product.specifications &&
              Object.keys(product.specifications).length > 0 ? (
                <div className="space-y-8">
                  {/* Technical Specifications */}
                  <div>
                    <h4 className="text-xl font-semibold text-[#1d1d1b] mb-6 flex items-center">
                      <div className="w-1 h-6 bg-[#1d1d1b] mr-3 rounded-full"></div>
                      Technical Specifications
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(product.specifications).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300"
                          >
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                              <span className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                                {key
                                  .replace(/([A-Z])/g, " $1")
                                  .replace(/^./, (str) => str.toUpperCase())}
                              </span>
                              <span className="text-gray-900 font-bold text-base">
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
                      <h4 className="text-xl font-semibold text-[#1d1d1b] mb-6 flex items-center">
                        <div className="w-1 h-6 bg-[#1d1d1b] mr-3 rounded-full"></div>
                        Key Features
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {product.features.map(
                          (feature: string, index: number) => (
                            <div
                              key={`fallback-feature-${index}`}
                              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200 hover:shadow-lg transition-all duration-300"
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
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">
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
