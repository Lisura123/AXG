import React, { useState, useEffect } from "react";
import { adminApi, getImageUrl } from "../lib/api";

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

interface ProductFormData {
  name: string;
  description: string;
  features: string[];
  imageURL: string;
  category: string;
  subcategory: string;
  isActive: boolean;
  isFeatured: boolean;
  previewURL?: string;
}

const initialFormData: ProductFormData = {
  name: "",
  description: "",
  features: [],
  imageURL: "",
  category: "",
  subcategory: "",
  isActive: true,
  isFeatured: false,
};

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterActive, setFilterActive] = useState("");
  const [filterFeatured, setFilterFeatured] = useState("");
  const [newFeature, setNewFeature] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [imageLoadError, setImageLoadError] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Fetch products
  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const params: any = {
        page: page,
        limit: 10,
      };

      if (searchTerm) params.search = searchTerm;
      if (filterCategory) params.category = filterCategory;
      if (filterActive) params.isActive = filterActive === "true";
      if (filterFeatured) params.isFeatured = filterFeatured === "true";

      const response = await adminApi.getAllProducts(params);

      if (response.success) {
        setProducts(response.data.products);
        setCurrentPage(response.data.pagination.page);
        setTotalPages(response.data.pagination.pages);
        setTotalProducts(response.data.pagination.total);
      }
    } catch (err: any) {
      setError("Failed to fetch products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Reset image error when imageURL changes
  useEffect(() => {
    setImageLoadError(false);
  }, [formData.imageURL]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await adminApi.getCategories();
      if (response.success) {
        setCategories(response.data.categories);
      }
    } catch (err: any) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (currentPage === 1) {
        fetchProducts(1);
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, filterCategory, filterActive, filterFeatured]);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Basic validation
      if (!formData.name.trim()) {
        setError("Product name is required");
        return;
      }
      if (!formData.category.trim()) {
        setError("Category is required");
        return;
      }
      // Image is now optional - no validation required

      // Clean up the product data before sending
      const productData = {
        ...formData,
        // Remove previewURL as it's not needed for backend
        previewURL: undefined,
      };

      // Handle imageURL - make it optional
      if (!productData.imageURL || productData.imageURL.trim() === "") {
        if (editingProduct?.imageURL) {
          // For updates, preserve existing image
          productData.imageURL = editingProduct.imageURL;
        } else {
          // For new products, use a placeholder or leave empty
          productData.imageURL = ""; // Will be handled by the default fallback
        }
      }

      // Debug imageURL specifically
      console.log("🖼️ ImageURL Debug:", {
        value: productData.imageURL,
        type: typeof productData.imageURL,
        length: productData.imageURL?.length,
        startsWith: productData.imageURL?.startsWith("data:"),
        isEmpty: !productData.imageURL || productData.imageURL.trim() === "",
        preview: productData.imageURL?.substring(0, 100) + "...",
      });

      console.log("📤 Sending product data:", {
        name: productData.name,
        description: productData.description?.substring(0, 100) + "...",
        features: productData.features,
        category: productData.category,
        subcategory: productData.subcategory,
        isActive: productData.isActive,
        isFeatured: productData.isFeatured,
        imageURL: productData.imageURL?.startsWith("data:")
          ? `[base64 data: ${(productData.imageURL.length / 1024).toFixed(
              1
            )}KB]`
          : productData.imageURL,
        hasPreviewURL: !!productData.previewURL,
      });

      let response;
      if (editingProduct) {
        response = await adminApi.updateProduct(
          editingProduct._id,
          productData
        );
      } else {
        response = await adminApi.createProduct(productData);
      }

      if (response.success) {
        closeModal();
        await fetchProducts(editingProduct ? currentPage : 1);
      } else {
        // Handle validation errors specifically
        if (response.errors && Array.isArray(response.errors)) {
          const errorMessages = response.errors
            .map((err: any) => err.message || err)
            .join(", ");
          setError(`Validation failed: ${errorMessages}`);
        } else {
          setError(response.message || "Failed to save product");
        }
      }
    } catch (err: any) {
      console.error("❌ Product save error:", err);
      console.error("❌ Full error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });

      // Parse error response if available - try multiple error formats
      let errorMessage = "Failed to save product";

      if (
        err.response?.data?.errors &&
        Array.isArray(err.response.data.errors)
      ) {
        const errorMessages = err.response.data.errors
          .map((e: any) => e.message || e.msg || e)
          .join(", ");
        errorMessage = `Validation failed: ${errorMessages}`;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle product deletion
  const handleDelete = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setLoading(true);
        const response = await adminApi.deleteProduct(productId);
        if (response.success) {
          await fetchProducts(currentPage);
        }
      } catch (err: any) {
        setError(err.message || "Failed to delete product");
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle edit
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      features: product.features || [],
      imageURL: product.imageURL || "",
      category: product.category,
      subcategory: product.subcategory || "",
      isActive: product.isActive,
      isFeatured: product.isFeatured,
    });
    setShowModal(true);
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      // Clear subcategory when changing category to non-Lens Filters
      if (name === "category" && value !== "Lens Filters") {
        setFormData((prev) => ({ ...prev, [name]: value, subcategory: "" }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    }
  };

  // Add feature
  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  // Remove feature
  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  // Handle file selection with server upload
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!validTypes.includes(file.type)) {
      alert("Please select a valid image file (JPEG, PNG, WebP, or GIF)");
      e.target.value = "";
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("Image size must be less than 5MB");
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);
      console.log(
        `📤 Uploading image: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`
      );

      // Upload image to server
      const response = await adminApi.uploadImage(file);

      if (response.success) {
        // Create object URL for preview
        const objectURL = URL.createObjectURL(file);

        setFormData((prev) => ({
          ...prev,
          imageURL: response.data.imageUrl, // Store server URL
          previewURL: objectURL, // Use object URL for preview
        }));

        console.log(
          `✅ Image uploaded successfully: ${response.data.imageUrl}`
        );
      } else {
        throw new Error(response.message || "Upload failed");
      }
    } catch (error: any) {
      console.error("❌ Image upload error:", error);
      alert(`Image upload failed: ${error.message || "Unknown error"}`);
      e.target.value = "";
    } finally {
      setUploading(false);
    }
  };

  // Get subcategories for selected category
  const getSubcategories = () => {
    const selectedCategory = categories.find(
      (cat) => cat.name === formData.category
    );
    return selectedCategory?.submenu || [];
  };

  // Add new category
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const response = await adminApi.createCategory({
        name: newCategoryName.trim(),
        hasSubmenu: false,
        submenu: [],
        isActive: true,
      });

      if (response.success) {
        await fetchCategories(); // Refresh categories
        setNewCategoryName("");
        setShowAddCategory(false);
        // Optionally set the new category as selected
        setFormData((prev) => ({ ...prev, category: newCategoryName.trim() }));
      }
    } catch (err) {
      console.error("Error creating category:", err);
      setError("Failed to create category");
    }
  };

  // Close modal and clean up
  const closeModal = () => {
    // Clean up object URL if it exists
    if (formData.previewURL) {
      URL.revokeObjectURL(formData.previewURL);
    }
    setShowModal(false);
    setEditingProduct(null);
    setFormData(initialFormData);
    setShowAddCategory(false);
    setNewCategoryName("");
  };
  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Product Management
          </h2>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setFormData(initialFormData);
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Product
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
          <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Active Products</h3>
          <p className="text-2xl font-bold text-green-600">
            {products.filter((p) => p.isActive).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">
            Featured Products
          </h3>
          <p className="text-2xl font-bold text-blue-600">
            {products.filter((p) => p.isFeatured).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Categories</h3>
          <p className="text-2xl font-bold text-purple-600">
            {categories.length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <select
            value={filterFeatured}
            onChange={(e) => setFilterFeatured(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Featured</option>
            <option value="true">Featured</option>
            <option value="false">Not Featured</option>
          </select>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterCategory("");
              setFilterActive("");
              setFilterFeatured("");
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {product.imageURL && (
                        <img
                          src={getImageUrl(product.imageURL)}
                          alt={product.name}
                          className="h-10 w-10 rounded-md object-cover mr-3"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          SKU: {product.sku || "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.category}
                    </div>
                    {product.subcategory && (
                      <div className="text-sm text-gray-500">
                        {product.subcategory}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                      {product.isFeatured && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.views}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{currentPage}</span>{" "}
                of <span className="font-medium">{totalPages}</span> (
                {totalProducts} total products)
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Product Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Image{" "}
                      <span className="text-gray-500 text-xs font-normal">
                        (Optional)
                      </span>
                    </label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        name="imageURL"
                        value={formData.imageURL}
                        onChange={handleInputChange}
                        placeholder="Enter image URL (optional) or upload a file below"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        disabled={uploading}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${
                          uploading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      />
                      {uploading && (
                        <div className="text-sm text-blue-600 font-medium">
                          📤 Uploading image...
                        </div>
                      )}
                      <p className="text-xs text-gray-500">
                        💡 Options: Enter a URL (https://...), select a file
                        above to upload to server, or leave empty for no image
                      </p>
                      <p className="text-xs text-green-600">
                        ✅ Images are automatically uploaded to server and
                        stored in /uploads folder
                      </p>
                      <p className="text-xs text-amber-600">
                        📏 Maximum file size: 5MB (JPEG, PNG, WebP, GIF
                        supported)
                      </p>
                      <details className="mt-2">
                        <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-800">
                          📋 Available images in public folder (click to expand)
                        </summary>
                        <div className="mt-1 p-2 bg-gray-50 rounded text-xs">
                          <p className="font-medium mb-1">
                            Quick image paths you can use:
                          </p>
                          <div className="space-y-1 text-gray-600">
                            <div>
                              /03620fc0-d50f-4d4e-b696-d5bd7ff2f2a5.__CR0,0,1400,866_PT0_SX970_V1____1.jpg
                            </div>
                            <div>
                              /108325_newell-lp-e6p-usb-c-battery-for-canon.jpg
                            </div>
                            <div>
                              /390684ad-ea82-45e4-9bdd-74873ba221f8.__CR0,0,970,600_PT0_SX970_V1____1.jpg
                            </div>
                            <div>/6193eY2tcWL._AC_SL1500__1.jpg</div>
                            <div>/axg logo.png</div>
                          </div>
                          <p className="mt-2 text-gray-500">
                            💡 Copy any of these paths into the Image URL field
                            above
                          </p>
                          <div className="mt-2 space-y-1">
                            <p className="font-medium text-gray-700">
                              Quick select:
                            </p>
                            <div className="grid grid-cols-1 gap-1">
                              {[
                                "/108325_newell-lp-e6p-usb-c-battery-for-canon.jpg",
                                "/6193eY2tcWL._AC_SL1500__1.jpg",
                                "/03620fc0-d50f-4d4e-b696-d5bd7ff2f2a5.__CR0,0,1400,866_PT0_SX970_V1____1.jpg",
                                "/390684ad-ea82-45e4-9bdd-74873ba221f8.__CR0,0,970,600_PT0_SX970_V1____1.jpg",
                              ].map((imagePath) => (
                                <button
                                  key={imagePath}
                                  type="button"
                                  onClick={() =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      imageURL: imagePath,
                                      previewURL: undefined,
                                    }))
                                  }
                                  className="text-left text-xs px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded border text-blue-700 truncate"
                                  title={`Use ${imagePath}`}
                                >
                                  📸{" "}
                                  {imagePath.split("/").pop()?.substring(0, 40)}
                                  ...
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </details>
                      {formData.imageURL && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs text-gray-600">Preview:</p>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                formData.imageURL.startsWith("data:image/")
                                  ? "bg-green-100 text-green-700"
                                  : formData.imageURL.startsWith("http")
                                  ? "bg-blue-100 text-blue-700"
                                  : formData.imageURL.startsWith("/")
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {formData.imageURL.startsWith("data:image/")
                                ? "📄 Uploaded File"
                                : formData.imageURL.startsWith("http")
                                ? "🌐 URL"
                                : formData.imageURL.startsWith("/")
                                ? "📂 Public File"
                                : "📁 Local Path"}
                            </span>
                          </div>
                          <div className="w-32 h-32 border border-gray-300 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
                            {(() => {
                              // Use preview URL if available (for file uploads)
                              if (formData.previewURL) {
                                return (
                                  <img
                                    src={formData.previewURL}
                                    alt="Product preview"
                                    className="w-full h-full object-cover"
                                  />
                                );
                              }

                              // Try to display image if it's a URL, public path, or base64
                              if (
                                formData.imageURL.startsWith("http") ||
                                formData.imageURL.startsWith("/") ||
                                formData.imageURL.startsWith("./") ||
                                formData.imageURL.startsWith("data:image/")
                              ) {
                                // Show error message if image failed to load
                                if (imageLoadError) {
                                  return (
                                    <div className="text-center p-2">
                                      <div className="text-red-500 text-xs mb-1">
                                        ❌ Image not found
                                      </div>
                                      <div className="text-xs text-gray-500 break-all">
                                        {formData.imageURL}
                                      </div>
                                      <div className="text-xs text-gray-400 mt-1">
                                        Check if file exists in public folder
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => setImageLoadError(false)}
                                        className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                                      >
                                        Try again
                                      </button>
                                    </div>
                                  );
                                }

                                return (
                                  <img
                                    src={getImageUrl(formData.imageURL)}
                                    alt="Product preview"
                                    className="w-full h-full object-cover"
                                    onError={() => {
                                      setImageLoadError(true);
                                    }}
                                    onLoad={() => {
                                      setImageLoadError(false);
                                      console.log(
                                        `✅ Image loaded successfully: ${getImageUrl(
                                          formData.imageURL
                                        )}`
                                      );
                                    }}
                                  />
                                );
                              }

                              // Show file path for local files
                              return (
                                <div className="text-center p-2">
                                  <div className="text-xs text-blue-600 mb-1">
                                    📁 Local file path:
                                  </div>
                                  <p className="text-xs text-gray-700 break-all">
                                    {formData.imageURL}
                                  </p>
                                  <div className="text-xs text-gray-400 mt-1">
                                    Copy to public folder to preview
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {formData.category === "Lens Filters" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subcategory
                        </label>
                        <select
                          name="subcategory"
                          value={formData.subcategory}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Subcategory</option>
                          {getSubcategories().map((sub, index) => (
                            <option key={index} value={sub.name}>
                              {sub.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Add New Category Section */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-700">
                        Add New Category
                      </h4>
                      <button
                        type="button"
                        onClick={() => setShowAddCategory(!showAddCategory)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {showAddCategory ? "Cancel" : "+ Add Category"}
                      </button>
                    </div>

                    {showAddCategory && (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Enter new category name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddCategory}
                          disabled={!newCategoryName.trim()}
                          className="w-full px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          Create Category
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Features
                    </label>
                    <div className="space-y-2">
                      <div className="flex">
                        <input
                          type="text"
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          placeholder="Enter feature"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), addFeature())
                          }
                        />
                        <button
                          type="button"
                          onClick={addFeature}
                          className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                        >
                          Add
                        </button>
                      </div>
                      <div className="max-h-32 overflow-y-auto">
                        {formData.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between py-1 px-2 bg-gray-50 rounded mb-1"
                          >
                            <span className="text-sm">{feature}</span>
                            <button
                              type="button"
                              onClick={() => removeFeature(index)}
                              className="text-red-500 hover:text-red-700 ml-2"
                            >
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Active Product
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Featured Product
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading
                    ? "Saving..."
                    : editingProduct
                    ? "Update Product"
                    : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
