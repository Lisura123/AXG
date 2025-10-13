const API_BASE_URL = "http://localhost:8070/api";

// Auth token management
const TOKEN_KEY = "axg_bolt_token";
const USER_KEY = "axg_bolt_user";

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem(TOKEN_KEY);

// Set auth token in localStorage
const setAuthToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);

// Remove auth token from localStorage
const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Get user data from localStorage
const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Set user data in localStorage
const setUser = (user: any) =>
  localStorage.setItem(USER_KEY, JSON.stringify(user));

// Helper function to convert image paths to full URLs
export const getImageUrl = (imageURL: string | undefined): string => {
  if (!imageURL) return "";

  let finalUrl = "";

  // If it's already a full URL (http/https), use as is
  if (imageURL.startsWith("http://") || imageURL.startsWith("https://")) {
    finalUrl = imageURL;
  }
  // If it's a data URL (base64), use as is
  else if (imageURL.startsWith("data:")) {
    finalUrl = imageURL;
  }
  // If it's a server path (starts with /uploads), use API endpoint
  else if (imageURL.startsWith("/uploads/")) {
    const filename = imageURL.replace("/uploads/", "");
    finalUrl = `${API_BASE_URL}/products/image/${filename}`;
  }
  // If it's a relative path, assume it's from public folder (frontend)
  else if (imageURL.startsWith("/")) {
    finalUrl = imageURL; // Let the frontend handle public folder paths
  }
  // Default case - might be a filename, treat as uploads path
  else if (imageURL.includes(".")) {
    finalUrl = `${API_BASE_URL}/products/image/${imageURL}`;
  }

  console.log(`🖼️ Image URL conversion: "${imageURL}" → "${finalUrl}"`);
  return finalUrl;
};

// Generic API call function
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  console.log(
    `API Call: ${options.method || "GET"} ${API_BASE_URL}${endpoint}`
  );
  if (options.body && endpoint.includes("register")) {
    console.log("Request body:", options.body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    mode: "cors",
    credentials: "include",
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const data = await response.json();
  console.log(`API Response (${response.status}):`, data);

  if (!response.ok) {
    // Handle token expiration
    if (response.status === 401 && token) {
      removeAuthToken();
      window.location.href = "/login";
    }

    // For validation errors, provide detailed error information
    if (data.errors && Array.isArray(data.errors)) {
      const errorMessages = data.errors
        .map((err: any) => {
          if (typeof err === "object" && err.field && err.message) {
            return `${err.field}: ${err.message}`;
          } else if (typeof err === "object" && err.message) {
            return err.message;
          } else if (typeof err === "string") {
            return err;
          } else {
            return JSON.stringify(err);
          }
        })
        .join(", ");

      const error = new Error(errorMessages);
      (error as any).response = { data, status: response.status };
      throw error;
    }

    const error = new Error(data.message || "API call failed");
    (error as any).response = { data, status: response.status };
    throw error;
  }

  return data;
}

// Product API calls
export const productApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiCall(`/products${query}`);
  },

  getById: (id: string) => apiCall(`/products/${id}`),

  getFeatured: (limit?: number) => {
    const query = limit
      ? `?limit=${limit}&isFeatured=true`
      : "?isFeatured=true";
    return apiCall(`/products${query}`);
  },

  create: (productData: any) =>
    apiCall("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    }),

  update: (id: string, productData: any) =>
    apiCall(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    }),

  delete: (id: string) =>
    apiCall(`/products/${id}`, {
      method: "DELETE",
    }),

  getCategories: () => apiCall("/products/categories"),

  getCategoryStructure: () => apiCall("/products/category-structure"),
};

// User API calls
export const userApi = {
  getAll: () => apiCall("/users"),

  update: (id: string, userData: any) =>
    apiCall(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    }),

  delete: (id: string) =>
    apiCall(`/users/${id}`, {
      method: "DELETE",
    }),
};

// Review API calls
export const reviewApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiCall(`/reviews${query}`);
  },

  getByProduct: (productId: string) => apiCall(`/reviews/${productId}`),

  create: (reviewData: {
    productId: string;
    rating: number;
    comment: string;
  }) =>
    apiCall("/reviews", {
      method: "POST",
      body: JSON.stringify(reviewData),
    }),

  update: (
    id: string,
    reviewData: {
      rating?: number;
      comment?: string;
    }
  ) =>
    apiCall(`/reviews/${id}`, {
      method: "PUT",
      body: JSON.stringify(reviewData),
    }),

  delete: (id: string) =>
    apiCall(`/reviews/${id}`, {
      method: "DELETE",
    }),

  approve: (id: string) =>
    apiCall(`/admin/reviews/${id}/approve`, {
      method: "PUT",
    }),
};

// User Authentication API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiCall("/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data) {
      setAuthToken(response.data.token);
      setUser(response.data.user);
    }

    return response;
  },

  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }) =>
    apiCall("/users/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  logout: () => {
    removeAuthToken();
    return Promise.resolve({ success: true });
  },

  getProfile: () => apiCall("/users/profile"),

  updateProfile: (userData: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
    preferences?: {
      notifications?: {
        email?: boolean;
        sms?: boolean;
      };
      newsletter?: boolean;
    };
  }) =>
    apiCall("/users/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    }),

  changePassword: (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) =>
    apiCall("/users/change-password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
    }),

  forgotPassword: (email: string) =>
    apiCall("/users/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  promoteToAdmin: () =>
    apiCall("/users/promote-admin", {
      method: "POST",
    }),

  resetPassword: (
    token: string,
    newPassword: string,
    confirmPassword: string
  ) =>
    apiCall("/users/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword, confirmPassword }),
    }),

  verifyEmail: (token: string) =>
    apiCall(`/users/verify-email/${token}`, {
      method: "GET",
    }),

  getCurrentUser: getUser,
  isAuthenticated: () => !!getAuthToken(),
};

// Admin User Management API
export const adminApi = {
  // User management
  createUser: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    phone?: string;
    role?: string;
    isActive?: boolean;
  }) =>
    apiCall("/users/admin/create", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  getAllUsers: (params?: {
    page?: number;
    limit?: number;
    role?: string;
    isActive?: boolean;
    search?: string;
  }) => {
    const query = params
      ? "?" +
        new URLSearchParams(
          Object.entries(params).reduce((acc, [key, value]) => {
            if (value !== undefined) {
              acc[key] = String(value);
            }
            return acc;
          }, {} as Record<string, string>)
        ).toString()
      : "";
    return apiCall(`/users${query}`);
  },

  getUserById: (userId: string) => apiCall(`/users/${userId}`),

  updateUser: (
    userId: string,
    userData: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      role?: string;
      isActive?: boolean;
      address?: any;
      preferences?: any;
    }
  ) =>
    apiCall(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    }),

  deleteUser: (userId: string) =>
    apiCall(`/users/${userId}`, {
      method: "DELETE",
    }),

  // Product management
  getAllProducts: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    search?: string;
  }) => {
    const query = params
      ? "?" +
        new URLSearchParams(
          Object.entries(params).reduce((acc, [key, value]) => {
            if (value !== undefined) {
              acc[key] = String(value);
            }
            return acc;
          }, {} as Record<string, string>)
        ).toString()
      : "";
    return apiCall(`/products/admin/all${query}`);
  },

  createProduct: (productData: any) =>
    apiCall("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    }),

  updateProduct: (productId: string, productData: any) =>
    apiCall(`/products/${productId}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    }),

  deleteProduct: (productId: string) =>
    apiCall(`/products/${productId}`, {
      method: "DELETE",
    }),

  getCategories: () => apiCall("/products/categories"),

  createCategory: (categoryData: {
    name: string;
    hasSubmenu: boolean;
    submenu: Array<{ name: string; category: string }>;
    isActive: boolean;
  }) =>
    apiCall("/products/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    }),

  // Image upload
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/products/upload-image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Image upload failed");
    }

    return data;
  },
};
