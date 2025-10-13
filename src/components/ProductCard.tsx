import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { getImageUrl } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";
import {
  toggleWishlist as localToggleWishlist,
  isInWishlist as localIsInWishlist,
} from "../lib/wishlist";

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
  createdAt: string;
  updatedAt: string;
}

interface ProductCardProps {
  product: Product;
  onNavigate?: (page: string, data?: any) => void;
  variant?: "featured" | "product" | "wishlist";
  onRemoveFromWishlist?: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onNavigate,
  variant = "product",
  onRemoveFromWishlist,
}) => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Check if product is in wishlist when component mounts or user changes
  useEffect(() => {
    if (user && product._id) {
      const inWishlist = localIsInWishlist(user._id, product._id);
      setIsInWishlist(inWishlist);
    } else {
      setIsInWishlist(false);
    }
  }, [user, product._id]);

  const handleCardClick = () => {
    if (onNavigate) {
      onNavigate("product-detail", { productId: product._id });
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (variant === "wishlist" && onRemoveFromWishlist) {
      onRemoveFromWishlist(product._id);
    } else {
      // Add/remove to wishlist using client-side helper; keep UI styles unchanged
      if (!user) {
        onNavigate && onNavigate("login");
        return;
      }
      try {
        const result = localToggleWishlist(user._id, product._id);
        setIsInWishlist(result.isNowInWishlist);

        // Show notification based on action
        if (result.wasAdded) {
          showNotification(
            `"${product.name}" added to wishlist! ❤️`,
            "success"
          );
        } else if (result.wasRemoved) {
          showNotification(`"${product.name}" removed from wishlist`, "info");
        }
      } catch (err) {
        showNotification(
          "Failed to update wishlist. Please try again.",
          "error"
        );
      }
    }
  };

  // Create a local SVG placeholder that works offline
  const placeholderSvg = `data:image/svg+xml;base64,${btoa(`
    <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="300" fill="#f3f4f6"/>
      <text x="150" y="140" font-family="Arial, sans-serif" font-size="16" fill="#9ca3af" text-anchor="middle">
        No Image
      </text>
      <rect x="120" y="160" width="60" height="40" rx="4" fill="none" stroke="#9ca3af" stroke-width="2"/>
      <circle cx="130" cy="170" r="3" fill="#9ca3af"/>
      <polygon points="140,185 150,175 160,180 170,170 170,190 140,190" fill="#9ca3af"/>
    </svg>
  `)}`;

  const productImage = getImageUrl(product.imageURL) || placeholderSvg;

  // Variant-specific styling
  const getCardStyles = () => {
    switch (variant) {
      case "featured":
        return "bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group border border-blue-100 min-h-[400px] flex flex-col";
      case "wishlist":
        return "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group border-l-4 border-l-red-400";
      default:
        return "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group";
    }
  };

  return (
    <div onClick={handleCardClick} className={getCardStyles()}>
      {/* Product Image */}
      <div
        className={`relative overflow-hidden bg-gray-100 ${
          variant === "featured" ? "aspect-[4/3]" : "aspect-square"
        }`}
      >
        <img
          src={productImage}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-2"
          onError={(e) => {
            console.log(`Failed to load image: ${productImage}`);
            (e.target as HTMLImageElement).src = placeholderSvg;
          }}
        />

        {/* Featured Badge - Only for featured variant */}
        {variant === "featured" && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            ⭐ FEATURED
          </div>
        )}

        {/* Wishlist Badge - Only for wishlist variant */}
        {variant === "wishlist" && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            ❤️ WISHLIST
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-2">
          <button
            onClick={handleToggleWishlist}
            className={`bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200 ${
              variant === "wishlist" ? "bg-red-50 hover:bg-red-100" : ""
            }`}
            title={
              variant === "wishlist" || isInWishlist
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
          >
            <Heart
              className={`w-4 h-4 ${
                variant === "wishlist" || isInWishlist
                  ? "text-red-500 fill-red-500"
                  : "text-gray-600"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div
        className={`${
          variant === "featured"
            ? "p-6 flex-1 flex flex-col justify-between"
            : "p-4"
        }`}
      >
        <div>
          {/* Category */}
          <div
            className={`text-xs mb-2 ${
              variant === "featured"
                ? "text-blue-600 font-medium text-center"
                : "text-gray-500"
            }`}
          >
            {product.category}
            {product.subcategory && ` • ${product.subcategory}`}
          </div>

          {/* Product Name */}
          <h3
            className={`font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 ${
              variant === "featured" ? "text-xl" : "text-lg"
            }`}
          >
            {product.name}
          </h3>

          {/* Category Info */}
          <div className="flex items-center justify-between mb-3">
            {variant !== "featured" && product.isFeatured && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                Featured
              </span>
            )}
          </div>

          {/* Description - Only shown for featured variant */}
          {variant === "featured" ? (
            <div className="text-center mb-4">
              <p className="text-gray-600 text-sm italic mb-2">
                Premium {product.category}
              </p>
              <div className="w-12 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto"></div>
            </div>
          ) : null}

          {/* Status */}
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full font-medium ${
                variant === "featured" ? "text-sm px-3" : "text-xs"
              } ${
                product.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {product.isActive ? "Available" : "Unavailable"}
            </span>

            {/* View Details */}
            {variant === "featured" ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick();
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg transform hover:scale-105"
              >
                View
              </button>
            ) : (
              <span className="text-blue-600 font-medium group-hover:underline text-xs">
                {variant === "wishlist" ? "View Details" : "View Details →"}
              </span>
            )}
          </div>

          {/* Additional info for wishlist variant */}
          {variant === "wishlist" && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Added to wishlist</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleWishlist(e);
                  }}
                  className="text-xs text-red-600 hover:text-red-800 font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
