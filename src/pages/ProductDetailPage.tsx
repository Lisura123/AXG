import { useState, useEffect, useRef } from "react";
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
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  // Generate gallery images - combine main image and additional images (limit to 6 total)
  const galleryImages = product
    ? [
        ...(product.image_url ? [product.image_url] : []),
        ...(product.images && Array.isArray(product.images)
          ? product.images.filter(img => img && img.trim() !== '').slice(0, 5)
          : []),
      ].filter(Boolean)
    : [];

  // Navigation functions
  const navigateToNext = () => {
    if (galleryImages.length > 0) {
      setSelectedImageIndex((prev) => (prev + 1) % galleryImages.length);
    }
  };

  const navigateToPrevious = () => {
    if (galleryImages.length > 0) {
      setSelectedImageIndex(
        (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
      );
    }
  };

  const scrollThumbnails = (direction: "left" | "right") => {
    if (thumbnailContainerRef.current) {
      const scrollAmount = 200;
      thumbnailContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Initial data fetch / wishlist check
  useEffect(() => {
    fetchProductDetails();
    if (user) {
      checkWishlist();
    }
  }, [productId, user]);

  // Keyboard navigation for gallery
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (galleryImages.length <= 1) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        navigateToPrevious();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        navigateToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [galleryImages.length]);

  // Auto-scroll thumbnail into view when selected
  useEffect(() => {
    if (thumbnailContainerRef.current && galleryImages.length > 1) {
      const container = thumbnailContainerRef.current;
      const thumbnails = container.querySelectorAll("button");
      const selectedThumbnail = thumbnails[selectedImageIndex];

      if (selectedThumbnail) {
        selectedThumbnail.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [selectedImageIndex, galleryImages.length]);

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
                {/* Main Image Display - Enhanced with Zoom */}
                <div className="relative bg-white rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
                    {galleryImages.length > 0 ? (
                      <img
                        src={getImageUrl(galleryImages[selectedImageIndex])}
                        alt={`${product.name} - View ${selectedImageIndex + 1}`}
                        className="w-full h-full object-contain transition-all duration-500 hover:scale-105 cursor-zoom-in"
                        onError={(e) => {
                          console.log(
                            `Failed to load product image: ${getImageUrl(
                              galleryImages[selectedImageIndex]
                            )}`
                          );
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="text-center">
                        <Camera className="w-20 h-20 text-gray-300 mx-auto mb-3" />
                        <span className="text-gray-400 text-sm font-medium">No image available</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Thumbnail Strip */}
                {galleryImages.length > 1 && (
                  <div className="relative flex items-center gap-3">
                    {/* Left Arrow */}
                    <button
                      onClick={() => {
                        navigateToPrevious();
                        scrollThumbnails("left");
                      }}
                      className="flex-shrink-0 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Thumbnail Container */}
                    <div 
                      ref={thumbnailContainerRef}
                      className="flex-1 flex gap-3 overflow-x-auto scroll-smooth scrollbar-hide"
                      style={{ scrollSnapType: "x mandatory" }}
                    >
                      {galleryImages.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                            selectedImageIndex === index
                              ? "border-red-500 ring-4 ring-red-200 shadow-lg scale-105"
                              : "border-gray-300 hover:border-red-400 opacity-75 hover:opacity-100"
                          }`}
                          style={{ scrollSnapAlign: "center" }}
                          aria-label={`View image ${index + 1}`}
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

                    {/* Right Arrow */}
                    <button
                      onClick={() => {
                        navigateToNext();
                        scrollThumbnails("right");
                      }}
                      className="flex-shrink-0 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex flex-col">
                {/* Header Section */}
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {product.is_featured && (
                          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold uppercase shadow-md">
                            <Star className="w-3 h-3 fill-current" />
                            Featured
                          </span>
                        )}
                        {product.category && (
                          <span className="inline-block bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {product.category}
                          </span>
                        )}
                        {product.stock !== undefined && product.stock > 0 && (
                          <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                            <CheckCircle className="w-3 h-3" />
                            In Stock
                          </span>
                        )}
                      </div>
                      <h1 className="text-3xl lg:text-4xl font-bold text-[#1d1d1b] mb-2 leading-tight">
                        {product.name}
                      </h1>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={toggleWishlist}
                        className={`p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${
                          isInWishlist
                            ? "bg-gradient-to-br from-red-50 to-red-100 text-red-600 shadow-lg shadow-red-200 animate-pulse"
                            : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500"
                        }`}
                        title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <Heart
                          className={`w-6 h-6 transition-all ${
                            isInWishlist ? "fill-current scale-110" : ""
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          showNotification("Link copied to clipboard!", "success");
                        }}
                        className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 hover:scale-110 active:scale-95"
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
                  <h3 className="text-xl font-bold text-[#1d1d1b] mb-4 flex items-center">
                    <div className="w-1 h-6 bg-red-500 mr-3 rounded-full"></div>
                    About This Product
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-base">
                    {product.description}
                  </p>
                </div>

                {/* Key Features */}
                {product.features && product.features.length > 0 && (
                  <div className="mb-8 pb-8 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-[#1d1d1b] mb-4 flex items-center">
                      <div className="w-1 h-6 bg-green-500 mr-3 rounded-full"></div>
                      Key Features
                    </h3>
                    <ul className="grid gap-3">
                      {product.features.map(
                        (feature: string, index: number) => (
                          <li key={index} className="flex items-start group hover:bg-green-50 p-3 rounded-lg transition-all duration-300">
                            <div className="flex-shrink-0 mt-0.5">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              </div>
                            </div>
                            <span className="ml-3 text-gray-700 leading-relaxed font-medium">{feature}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="mt-auto space-y-3 sticky bottom-4 bg-white/95 backdrop-blur-sm p-4 -mx-4 -mb-4 rounded-xl shadow-lg">
                  <button
                    onClick={() => onNavigate("where-to-buy")}
                    className="w-full bg-gradient-to-r from-[#1d1d1b] via-[#2d2d2b] to-[#404040] text-white py-4 px-6 rounded-xl font-bold hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-2 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform relative z-10" />
                    <span className="relative z-10">Where to Buy</span>
                  </button>
                  
                  <button
                    onClick={() => onNavigate("contact")}
                    className="w-full bg-white border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl font-bold hover:border-[#1d1d1b] hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 hover:shadow-lg"
                  >
                    Contact Us for Details
                  </button>
                </div>
              </div>
            </div>

            {/* Specifications Section */}
            <div className="border-t-2 border-gray-200 bg-gradient-to-br from-gray-50 via-white to-gray-50 p-8 lg:p-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl lg:text-3xl font-bold text-[#1d1d1b] flex items-center">
                  <div className="w-2 h-8 bg-gradient-to-b from-red-500 to-[#1d1d1b] mr-4 rounded-full"></div>
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
                            className="bg-white rounded-xl p-5 border-2 border-gray-200 hover:shadow-xl hover:border-red-300 hover:scale-[1.02] transition-all duration-300 group"
                          >
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                              <span className="font-bold text-gray-600 text-sm uppercase tracking-wider group-hover:text-red-600 transition-colors">
                                {key
                                  .replace(/([A-Z])/g, " $1")
                                  .replace(/^./, (str) => str.toUpperCase())}
                              </span>
                              <span className="text-gray-900 font-bold text-lg group-hover:text-[#1d1d1b] transition-colors">
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
