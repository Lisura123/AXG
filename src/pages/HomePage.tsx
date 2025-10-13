import { useState, useEffect } from "react";
import {
  Camera,
  Battery,
  Zap,
  CreditCard,
  Filter,
  Star,
  Backpack,
} from "lucide-react";
import { productApi } from "../lib/api";
import PageTransition from "../components/PageTransition";
import HeroSlider from "../components/HeroSlider";
import ProductCard from "../components/ProductCard";

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

interface HomePageProps {
  onNavigate: (page: string, data?: any) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      console.log("🔍 Fetching featured products from backend...");
      const response = await productApi.getFeatured(8);
      console.log("📦 Backend response:", response);

      if (response.success) {
        setFeaturedProducts(response.data.products || []);
        console.log(
          "✅ Featured products loaded:",
          response.data.products?.length || 0
        );
      } else {
        console.log("⚠️ Backend response not successful:", response);
        setFeaturedProducts([]);
      }
    } catch (error) {
      console.error("❌ Error fetching featured products:", error);
      // Fallback to empty array if API fails
      setFeaturedProducts([]);
    }
    setLoading(false);
  };

  const categories = [
    {
      name: "Batteries",
      icon: Battery,
      image: "/108325_newell-lp-e6p-usb-c-battery-for-canon.jpg",
    },
    {
      name: "Chargers",
      icon: Zap,
      image: "/assets/images/categories/charger.jpg",
    },
    {
      name: "Card Readers",
      icon: CreditCard,
      image: "/assets/images/categories/card-reader.jpg",
    },
    {
      name: "Lens Filters",
      icon: Filter,
      image: "/assets/images/categories/lens-filter.jpg",
    },
    { name: "Camera Backpacks", icon: Backpack, image: "/axg logo.png" },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <HeroSlider onNavigate={onNavigate} />

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-slideInUp">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1d1d1b] mb-4">
                Shop by Category
              </h2>
              <p className="text-gray-600 text-lg">
                Find the perfect accessories for your camera
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {categories.map((category, index) => (
                <button
                  key={category.name}
                  onClick={() =>
                    onNavigate("products", { category: category.name })
                  }
                  className="group relative overflow-hidden rounded-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 animate-scaleIn h-64"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute inset-0">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  </div>
                  <div className="relative h-full flex flex-col items-center justify-end p-6">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center mb-3 group-hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-lg">
                      <category.icon className="w-6 h-6 text-[#1d1d1b]" />
                    </div>
                    <h3 className="text-xl font-bold text-white drop-shadow-lg">
                      {category.name}
                    </h3>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-slideInUp">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1d1d1b] mb-4">
                Featured Products
              </h2>
              <p className="text-gray-600 text-lg">
                Discover our most popular camera accessories
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
                  >
                    <div className="aspect-square bg-gray-300"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                      <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.slice(0, 4).map((product) => (
                  <div key={product._id} className="animate-slideInUp">
                    <ProductCard
                      product={product}
                      onNavigate={onNavigate}
                      variant="featured"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  No featured products available at the moment.
                </p>
              </div>
            )}

            {featuredProducts.length > 4 && (
              <div className="text-center mt-12">
                <button
                  onClick={() => onNavigate("products", { featured: true })}
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-[#404040] hover:bg-[#2a2a2a] transform hover:scale-105 transition-all duration-300"
                >
                  View All Featured Products
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center animate-slideInUp">
                <div className="w-16 h-16 bg-[#404040] rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#1d1d1b] mb-2">
                  Premium Quality
                </h3>
                <p className="text-gray-600">
                  Every product is crafted with precision and tested for
                  professional use
                </p>
              </div>
              <div
                className="text-center animate-slideInUp"
                style={{ animationDelay: "0.1s" }}
              >
                <div
                  className="w-16 h-16 bg-[#404040] rounded-full flex items-center justify-center mx-auto mb-4 animate-float"
                  style={{ animationDelay: "0.5s" }}
                >
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#1d1d1b] mb-2">
                  Fast & Reliable
                </h3>
                <p className="text-gray-600">
                  Quick delivery and dependable performance when you need it
                  most
                </p>
              </div>
              <div
                className="text-center animate-slideInUp"
                style={{ animationDelay: "0.2s" }}
              >
                <div
                  className="w-16 h-16 bg-[#404040] rounded-full flex items-center justify-center mx-auto mb-4 animate-float"
                  style={{ animationDelay: "1s" }}
                >
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#1d1d1b] mb-2">
                  Trusted by Pros
                </h3>
                <p className="text-gray-600">
                  Join thousands of photographers who trust AXG for their gear
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
