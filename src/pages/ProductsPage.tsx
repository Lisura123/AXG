import { useState, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Camera,
  Star,
  ChevronDown,
  ChevronUp,
  Package,
  Menu,
} from "lucide-react";
import { productApi } from "../lib/api";
import PageTransition from "../components/PageTransition";
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

interface Category {
  _id: string;
  name: string;
  hasSubmenu: boolean;
  submenu: Array<{
    name: string;
    category: string;
  }>;
  isActive: boolean;
}

interface ProductsPageProps {
  onNavigate: (page: string, data?: any) => void;
  initialCategory?: string;
  initialSubcategory?: string;
}

export default function ProductsPage({
  onNavigate,
  initialCategory,
  initialSubcategory,
}: ProductsPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<
    string | undefined
  >(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products when page loads and when filters change
  useEffect(() => {
    fetchProducts();
  }, [selectedCategories, searchQuery, currentPage]);

  // Auto-expand categories with subcategories
  useEffect(() => {
    if (categories.length > 0) {
      const categoriesWithSubmenus = categories
        .filter((cat) => {
          const subcategories = getSubcategories(cat);
          return subcategories.length > 0;
        })
        .map((cat) => cat.name);

      // Ensure Lens Filters is always expanded since it has custom subcategories
      if (categories.some((cat) => cat.name === "Lens Filters")) {
        if (!categoriesWithSubmenus.includes("Lens Filters")) {
          categoriesWithSubmenus.push("Lens Filters");
        }
      }

      setExpandedCategories(categoriesWithSubmenus);
    }
  }, [categories]);

  useEffect(() => {
    if (initialCategory && categories.length > 0) {
      console.log("🎯 Processing initialCategory:", initialCategory);

      // Handle lens filter subcategories (e.g., "67mm Filters" -> "67mm")
      if (initialCategory.includes("mm Filters")) {
        const filterSize = initialCategory.replace(" Filters", "");
        console.log("🔍 Detected lens filter size:", filterSize);
        setSelectedCategories([filterSize]);
        return;
      }

      // Handle regular categories
      const category = categories.find(
        (c) => c.name.toLowerCase() === initialCategory.toLowerCase()
      );
      if (category) {
        console.log("✅ Found matching category:", category.name);
        setSelectedCategories([category.name]);
      } else {
        console.log("❌ No matching category found for:", initialCategory);
        // Try to find a partial match
        const partialMatch = categories.find(
          (c) =>
            c.name.toLowerCase().includes(initialCategory.toLowerCase()) ||
            initialCategory.toLowerCase().includes(c.name.toLowerCase())
        );
        if (partialMatch) {
          console.log("🎯 Found partial match:", partialMatch.name);
          setSelectedCategories([partialMatch.name]);
        }
      }
    }
  }, [initialCategory, categories]);

  // Apply initial subcategory when provided (e.g., from Navbar lens filter sizes)
  useEffect(() => {
    if (initialSubcategory) {
      console.log("🎯 Applying initialSubcategory:", initialSubcategory);
      setSelectedSubcategory(initialSubcategory);
    }
  }, [initialSubcategory]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategories, searchQuery, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [selectedCategories, searchQuery]);

  const fetchCategories = async () => {
    try {
      const response = await productApi.getCategories();
      if (response.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (selectedCategories.length > 0) {
        params.categories = selectedCategories.join(",");
      }

      // Include subcategory filter when provided (Lens Filters sizes like 67mm)
      if (selectedSubcategory) {
        params.subcategory = selectedSubcategory;
      }

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      console.log("🔍 Fetching products with params:", params);
      console.log("🔍 Selected categories:", selectedCategories);
      console.log("🔍 Selected subcategory:", selectedSubcategory);

      const response = await productApi.getAll(params);
      console.log("📦 Products API response:", response);

      if (response.success && response.data.products) {
        console.log("📦 Products found:", response.data.products.length);
        console.log(
          "📦 Product categories:",
          response.data.products.map((p: Product) => p.category)
        );
      }

      if (response.success) {
        const products = response.data.products || [];
        const pagination = response.data.pagination || {};

        setProducts(products);
        setTotalPages(pagination.pages || 1);
        setTotalProducts(pagination.total || products.length);

        console.log("✅ Products loaded:", {
          productsCount: products.length,
          currentPage: pagination.page || 1,
          totalPages: pagination.pages || 1,
          totalProducts: pagination.total || products.length,
        });
      } else {
        console.error("❌ API returned unsuccessful response:", response);
        setProducts([]);
        setTotalPages(1);
        setTotalProducts(0);
      }
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      setProducts([]);
    }
    setLoading(false);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const getSubcategories = (parentCategory: Category) => {
    // Custom subcategory handling
    if (parentCategory.name === "Batteries") {
      // Remove subcategories for Batteries
      return [];
    }

    if (parentCategory.name === "Lens Filters") {
      // Override with specific lens filter sizes
      return [
        { name: "58mm", category: "58mm" },
        { name: "67mm", category: "67mm" },
        { name: "77mm", category: "77mm" },
      ];
    }

    // Return original subcategories for other categories
    return parentCategory.submenu || [];
  };

  const toggleCategory = (categoryName: string) => {
    console.log("🔄 Toggling category:", categoryName);
    console.log("🔄 Current selectedCategories:", selectedCategories);
    setSelectedCategories((prev) => {
      const newCategories = prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName];
      console.log("🔄 Updated selectedCategories:", newCategories);
      return newCategories;
    });
  };

  const toggleCategoryExpansion = (categoryName: string) => {
    console.log("🔧 Toggling expansion for:", categoryName);
    setExpandedCategories((prev) => {
      const newExpanded = prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName];
      console.log("🔧 Updated expandedCategories:", newExpanded);
      return newExpanded;
    });
  };

  // Use products directly since backend handles pagination
  const currentProducts = products;

  const hasActiveFilters = selectedCategories.length > 0 || searchQuery !== "";

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <div className="relative bg-gradient-to-br from-[#404040] via-[#2d2d2b] to-[#1d1d1b] text-white py-16 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-24 h-24 bg-white rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 animate-slideInUp">
                <Camera className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">
                  Professional Camera Gear
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-slideInLeft">
                Our Products
              </h1>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto animate-slideInRight">
                Discover premium camera accessories crafted for professional
                photographers who demand excellence in every shot
              </p>

              <div className="flex justify-center mt-8 space-x-8 animate-slideInUp">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {products.length}+
                  </div>
                  <div className="text-sm text-gray-300">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {categories.length}+
                  </div>
                  <div className="text-sm text-gray-300">Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-sm text-gray-300">Quality</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center space-x-2 px-4 py-3 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200"
            >
              <Menu className="w-5 h-5 text-[#404040]" />
              <span className="font-medium text-[#404040]">Filters</span>
              {selectedCategories.length > 0 && (
                <span className="bg-[#404040] text-white text-xs px-2 py-1 rounded-full">
                  {selectedCategories.length}
                </span>
              )}
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-8 bg-white rounded-2xl shadow-xl p-6 animate-slideInUp border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Products
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Find your perfect camera accessory..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#404040] focus:border-transparent transition-all duration-200 hover:border-gray-300"
                  />
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-200 transform hover:scale-105 border border-red-200"
                >
                  <X className="w-4 h-4" />
                  <span className="font-medium">Clear Filters</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Desktop and Mobile Overlay */}
            <div
              className={`lg:w-80 flex-shrink-0 ${
                sidebarOpen
                  ? "fixed inset-0 z-50 bg-black bg-opacity-50 lg:relative lg:bg-transparent lg:z-auto"
                  : "hidden lg:block"
              }`}
              onClick={(e) => {
                if (sidebarOpen && e.target === e.currentTarget) {
                  setSidebarOpen(false);
                }
              }}
            >
              <div
                className={`bg-white rounded-3xl shadow-2xl p-8 sticky top-24 animate-slideInLeft border border-gray-100/50 backdrop-blur-sm overflow-hidden ${
                  sidebarOpen
                    ? "absolute right-0 top-0 bottom-0 w-80 rounded-none rounded-l-3xl"
                    : ""
                }`}
              >
                {/* Mobile Close Button */}
                {sidebarOpen && (
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                )}

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#404040]/5 to-transparent rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-[#1d1d1b]/5 to-transparent rounded-tr-full"></div>

                <div className="relative z-10">
                  {/* Enhanced Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#1d1d1b] to-[#404040] rounded-xl flex items-center justify-center mr-4 shadow-lg">
                          <Package className="w-6 h-6 text-white" />
                        </div>
                        {selectedCategories.length > 0 && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-bold">
                              {selectedCategories.length}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-[#1d1d1b]">
                          Categories
                        </h2>
                        <p className="text-sm text-gray-500">
                          Filter by product type
                        </p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 rounded-2xl shadow-inner">
                      <span className="text-sm font-bold text-gray-700">
                        {categories.length}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">total</span>
                    </div>
                  </div>
                </div>
                {/* Enhanced Category List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {/* All Products Option */}
                  <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedCategories.length === 0}
                      onChange={() => setSelectedCategories([])}
                      className="w-4 h-4 text-[#404040] border-2 border-gray-300 rounded focus:ring-[#404040] focus:ring-2"
                    />
                    <div className="flex items-center flex-1">
                      <Star className="w-4 h-4 text-[#404040] mr-2" />
                      <span className="font-medium text-gray-700">
                        All Products
                      </span>
                    </div>
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full font-medium">
                      {products.length}
                    </span>
                  </div>
                  {/* Category List with Expandable Subcategories */}
                  {categories.map((category) => {
                    const subcategories = getSubcategories(category);
                    const isCategorySelected = selectedCategories.includes(
                      category.name
                    );
                    const isExpanded = expandedCategories.includes(
                      category.name
                    );
                    const hasSelectedSubcategories = subcategories.some((sub) =>
                      selectedCategories.includes(sub.name)
                    );

                    // Debug logging for Lens Filters
                    if (category.name === "Lens Filters") {
                      console.log("Lens Filters Debug:", {
                        categoryName: category.name,
                        subcategories: subcategories,
                        subcategoriesLength: subcategories.length,
                        isExpanded: isExpanded,
                        expandedCategories: expandedCategories,
                      });
                    }

                    return (
                      <div key={category._id} className="space-y-2">
                        {/* Main Category */}
                        <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                          <input
                            type="checkbox"
                            checked={isCategorySelected}
                            onChange={() => toggleCategory(category.name)}
                            className="w-4 h-4 text-[#404040] border-2 border-gray-300 rounded focus:ring-[#404040] focus:ring-2"
                          />
                          <div
                            className="flex items-center flex-1 cursor-pointer"
                            onClick={() => toggleCategory(category.name)}
                          >
                            <Package className="w-4 h-4 text-[#404040] mr-2" />
                            <span
                              className={`font-medium ${
                                isCategorySelected
                                  ? "text-[#404040]"
                                  : "text-gray-700"
                              }`}
                            >
                              {category.name}
                              {subcategories.length > 0 && (
                                <span className="ml-2 text-xs text-gray-500">
                                  ({subcategories.length} sizes)
                                </span>
                              )}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium ${
                                isCategorySelected || hasSelectedSubcategories
                                  ? "bg-[#404040] text-white"
                                  : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              {
                                products.filter(
                                  (p) => p.category === category.name
                                ).length
                              }
                            </span>
                            {subcategories.length > 0 && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleCategoryExpansion(category.name);
                                }}
                                className="p-2 hover:bg-[#404040]/10 rounded-lg transition-all duration-200 border border-transparent hover:border-[#404040]/20"
                                title={
                                  isExpanded
                                    ? "Collapse subcategories"
                                    : "Expand subcategories"
                                }
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-5 h-5 text-[#404040] font-bold" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-[#404040] font-bold" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Subcategories */}
                        {subcategories.length > 0 && isExpanded && (
                          <div className="ml-6 mt-3 space-y-2 border-l-4 border-[#404040]/20 pl-6 bg-gradient-to-r from-gray-50/50 to-transparent rounded-r-lg py-3">
                            {subcategories.map((sub, index) => {
                              const isSubSelected = selectedCategories.includes(
                                sub.name
                              );
                              return (
                                <div
                                  key={`${category._id}-${index}`}
                                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 border-2 ${
                                    isSubSelected
                                      ? "bg-[#404040]/5 border-[#404040]/30 shadow-md"
                                      : "bg-white border-gray-200 hover:border-[#404040]/20 hover:bg-gray-50"
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSubSelected}
                                    onChange={() => toggleCategory(sub.name)}
                                    className="w-4 h-4 text-[#404040] border-2 border-gray-400 rounded focus:ring-[#404040] focus:ring-2"
                                  />
                                  <div
                                    className="flex items-center flex-1 cursor-pointer"
                                    onClick={() => toggleCategory(sub.name)}
                                  >
                                    <div
                                      className={`w-3 h-3 rounded-full mr-3 ${
                                        isSubSelected
                                          ? "bg-[#404040]"
                                          : "bg-gray-400"
                                      }`}
                                    ></div>
                                    <span
                                      className={`text-base font-semibold ${
                                        isSubSelected
                                          ? "text-[#404040]"
                                          : "text-gray-700"
                                      }`}
                                    >
                                      • {sub.name}
                                    </span>
                                  </div>
                                  <span
                                    className={`text-sm px-3 py-1.5 rounded-full font-bold border ${
                                      isSubSelected
                                        ? "bg-[#404040] text-white border-[#404040]"
                                        : "bg-gray-100 text-gray-700 border-gray-300"
                                    }`}
                                  >
                                    {
                                      products.filter(
                                        (p) => p.subcategory === sub.name
                                      ).length
                                    }
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-6 bg-white rounded-xl p-4 shadow-md border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    Showing{" "}
                    <span className="font-semibold text-[#1d1d1b]">
                      {(currentPage - 1) * itemsPerPage + 1}-
                      {Math.min(currentPage * itemsPerPage, totalProducts)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-[#1d1d1b]">
                      {totalProducts}
                    </span>{" "}
                    products
                  </div>
                  {selectedCategories.length > 0 && (
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className="text-sm text-gray-500">in</span>
                      {selectedCategories.map((category, index) => (
                        <span
                          key={category}
                          className="inline-flex items-center px-3 py-1 bg-[#1d1d1b] text-white text-sm rounded-full"
                        >
                          {category}
                          {index < selectedCategories.length - 1 && (
                            <span className="ml-1 text-gray-300">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {totalPages > 1 && `Page ${currentPage} of ${totalPages}`}
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg shadow-md h-80 animate-pulse"
                    />
                  ))}
                </div>
              ) : currentProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {currentProducts.map((product) => (
                      <div key={product._id}>
                        <ProductCard
                          product={product}
                          onNavigate={onNavigate}
                          variant="product"
                        />
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-12 bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                          className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>

                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((page) => {
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-5 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                                  currentPage === page
                                    ? "bg-[#1d1d1b] text-white shadow-lg"
                                    : "border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                                }`}
                              >
                                {page}
                              </button>
                            );
                          } else if (
                            page === currentPage - 2 ||
                            page === currentPage + 2
                          ) {
                            return (
                              <span
                                key={page}
                                className="px-3 text-gray-400 font-medium"
                              >
                                ...
                              </span>
                            );
                          }
                          return null;
                        })}

                        <button
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="mt-4 text-center">
                        <span className="text-sm text-gray-500">
                          Navigate through {totalPages} pages of premium camera
                          accessories
                        </span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-2xl shadow-xl p-16 text-center animate-slideInUp border border-gray-100">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#404040] to-[#1d1d1b] rounded-full blur-2xl opacity-10 transform scale-150"></div>
                    <Camera className="relative w-20 h-20 text-gray-400 mx-auto" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    No products found
                  </h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                    We couldn't find any products matching your criteria. Try
                    adjusting your filters or search terms to discover our
                    amazing camera accessories.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <button
                      onClick={clearFilters}
                      className="px-8 py-3 bg-[#1d1d1b] text-white rounded-xl hover:bg-[#404040] transition-all duration-200 transform hover:scale-105 font-medium shadow-lg"
                    >
                      Clear All Filters
                    </button>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="px-8 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 font-medium"
                    >
                      Clear Search
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
