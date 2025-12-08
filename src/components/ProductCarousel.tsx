import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Camera, Star } from "lucide-react";
import { getImageUrl } from "../lib/api";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  category_id: string;
}

interface ProductCarouselProps {
  products: Product[];
  onNavigate: (page: string, data?: any) => void;
}

export default function ProductCarousel({
  products,
  onNavigate,
}: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 768) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, products.length - itemsPerView);

  const next = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  if (products.length === 0) return null;

  return (
    <div className="relative group">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
          }}
        >
          {products.map((product, index) => (
            <div
              key={product.id}
              className="flex-shrink-0 px-3"
              style={{ width: `${100 / itemsPerView}%` }}
            >
              <button
                onClick={() =>
                  onNavigate("product-detail", { productId: product.id })
                }
                className="group/item bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all transform hover:-translate-y-2 w-full animate-slideInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                  {product.image_url ? (
                    <img
                      src={getImageUrl(product.image_url)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <Camera className="w-24 h-24 text-gray-400" />
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm text-[#1d1d1b] mb-1 group-hover/item:text-[#404040] transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                    {product.description}
                  </p>
                  <div className="flex items-center text-xs text-[#404040]">
                    <Star className="w-3 h-3 fill-current mr-1" />
                    <span className="font-medium">View Details</span>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {currentIndex > 0 && (
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-3 bg-white shadow-lg rounded-full hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-6 h-6 text-[#1d1d1b]" />
        </button>
      )}

      {currentIndex < maxIndex && (
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-3 bg-white shadow-lg rounded-full hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-6 h-6 text-[#1d1d1b]" />
        </button>
      )}

      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? "bg-[#1d1d1b] w-6"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
