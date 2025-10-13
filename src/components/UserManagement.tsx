import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  X,
  Check,
  AlertCircle,
  UserPlus,
  Shield,
  Clock,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { adminApi } from "../lib/api";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  role: "user" | "admin" | "moderator";
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

interface UserStats {
  total: number;
  active: number;
  inactive: number;
  admins: number;
  users: number;
  moderators: number;
  verified: number;
  unverified: number;
}

interface UserManagementProps {
  onUserCountChange?: (count: number) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({
  onUserCountChange,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    active: 0,
    inactive: 0,
    admins: 0,
    users: 0,
    moderators: 0,
    verified: 0,
    unverified: 0,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  // Filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Modals
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showViewUser, setShowViewUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "user" as "user" | "admin" | "moderator",
    isActive: true,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch users with filters and pagination
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: limit,
      };

      if (searchTerm) params.search = searchTerm;
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.isActive = statusFilter === "active";

      const response = await adminApi.getAllUsers(params);

      if (response.success) {
        setUsers(response.data.users);
        setTotalPages(response.data.pagination.pages);

        // Calculate stats
        const total = response.data.pagination.total;
        const active = response.data.users.filter(
          (u: User) => u.isActive
        ).length;
        const inactive = response.data.users.filter(
          (u: User) => !u.isActive
        ).length;
        const admins = response.data.users.filter(
          (u: User) => u.role === "admin"
        ).length;
        const userCount = response.data.users.filter(
          (u: User) => u.role === "user"
        ).length;
        const moderators = response.data.users.filter(
          (u: User) => u.role === "moderator"
        ).length;
        const verified = response.data.users.filter(
          (u: User) => u.isEmailVerified
        ).length;
        const unverified = response.data.users.filter(
          (u: User) => !u.isEmailVerified
        ).length;

        const newStats = {
          total,
          active,
          inactive,
          admins,
          users: userCount,
          moderators,
          verified,
          unverified,
        };

        setStats(newStats);
        onUserCountChange?.(total);
      }
    } catch (error: any) {
      setError(error.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Create new user
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");

      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: "TempPass123!", // Default password - user should change it
        phone: formData.phone,
        role: formData.role,
        isActive: formData.isActive,
      };

      const response = await adminApi.createUser(userData);

      if (response.success) {
        setSuccess("User created successfully. Default password: TempPass123!");
        setShowAddUser(false);
        fetchUsers();
        resetForm();
      }
    } catch (error: any) {
      setError(error.message || "Failed to create user");
    }
  };

  // Update user
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      setError("");

      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        role: formData.role,
        isActive: formData.isActive,
      };

      const response = await adminApi.updateUser(selectedUser._id, updateData);

      if (response.success) {
        setSuccess("User updated successfully");
        setShowEditUser(false);
        fetchUsers();
        resetForm();
      }
    } catch (error: any) {
      setError(error.message || "Failed to update user");
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setError("");

      const response = await adminApi.deleteUser(selectedUser._id);

      if (response.success) {
        setSuccess("User deleted successfully");
        setShowDeleteConfirm(false);
        setSelectedUser(null);
        fetchUsers();
      }
    } catch (error: any) {
      setError(error.message || "Failed to delete user");
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "user",
      isActive: true,
    });
    setSelectedUser(null);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      isActive: user.isActive,
    });
    setShowEditUser(true);
  };

  const openViewModal = (user: User) => {
    setSelectedUser(user);
    setShowViewUser(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setShowDeleteConfirm(true);
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, roleFilter, statusFilter]);

  const StatCard = ({ title, value, subtitle, icon: Icon, color }: any) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className="h-8 w-8 text-gray-600" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="text-3xl font-bold text-gray-900">{value}</dd>
            {subtitle && <dd className="text-sm text-gray-600">{subtitle}</dd>}
          </dl>
        </div>
      </div>
    </div>
  );

  if (loading && users.length === 0) {
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
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">
            Manage system users and their permissions
          </p>
        </div>
        <button
          onClick={() => setShowAddUser(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.total}
          subtitle={`${stats.active} active, ${stats.inactive} inactive`}
          icon={Users}
          color="border-blue-500"
        />
        <StatCard
          title="Administrators"
          value={stats.admins}
          subtitle="Admin users"
          icon={Shield}
          color="border-red-500"
        />
        <StatCard
          title="Regular Users"
          value={stats.users}
          subtitle="Standard users"
          icon={UserPlus}
          color="border-green-500"
        />
        <StatCard
          title="Email Verified"
          value={stats.verified}
          subtitle={`${stats.unverified} unverified`}
          icon={Mail}
          color="border-yellow-500"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="user">User</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm("");
              setRoleFilter("");
              setStatusFilter("");
              setCurrentPage(1);
            }}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="ml-3 text-red-700">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <Check className="h-5 w-5 text-green-400" />
            <p className="ml-3 text-green-700">{success}</p>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.firstName[0]}
                            {user.lastName[0]}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-800"
                          : user.role === "moderator"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isEmailVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {user.isEmailVerified ? "Verified" : "Unverified"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleDateString()
                      : "Never"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openViewModal(user)}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-yellow-600 hover:text-yellow-900 p-1 hover:bg-yellow-50 rounded"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(user)}
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New User</h3>
              <button
                onClick={() => {
                  setShowAddUser(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isActive"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Active User
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddUser(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUser && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit User</h3>
              <button
                onClick={() => {
                  setShowEditUser(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={selectedUser.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActiveEdit"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isActiveEdit"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Active User
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditUser(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {showViewUser && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">User Details</h3>
              <button
                onClick={() => setShowViewUser(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-xl font-medium text-gray-700">
                    {selectedUser.firstName[0]}
                    {selectedUser.lastName[0]}
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold">
                    {selectedUser.fullName}
                  </h4>
                  <p className="text-gray-600">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Role
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedUser.role === "admin"
                        ? "bg-red-100 text-red-800"
                        : selectedUser.role === "moderator"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {selectedUser.role.charAt(0).toUpperCase() +
                      selectedUser.role.slice(1)}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedUser.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {selectedUser.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Email Status
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedUser.isEmailVerified
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedUser.isEmailVerified ? "Verified" : "Unverified"}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Phone
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedUser.phone || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Created
                  </label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Last Login
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedUser.lastLogin
                      ? new Date(selectedUser.lastLogin).toLocaleDateString()
                      : "Never"}
                  </p>
                </div>
              </div>

              {selectedUser.address && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Address
                  </label>
                  <div className="text-sm text-gray-900 space-y-1">
                    {selectedUser.address.street && (
                      <p>{selectedUser.address.street}</p>
                    )}
                    {(selectedUser.address.city ||
                      selectedUser.address.state ||
                      selectedUser.address.zipCode) && (
                      <p>
                        {selectedUser.address.city && selectedUser.address.city}
                        {selectedUser.address.city &&
                          selectedUser.address.state &&
                          ", "}
                        {selectedUser.address.state &&
                          selectedUser.address.state}
                        {selectedUser.address.zipCode &&
                          ` ${selectedUser.address.zipCode}`}
                      </p>
                    )}
                    {selectedUser.address.country && (
                      <p>{selectedUser.address.country}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setShowViewUser(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-red-600">
                Delete User
              </h3>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedUser(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-700">
                Are you sure you want to delete{" "}
                <strong>{selectedUser.fullName}</strong>?
              </p>
              <p className="text-sm text-red-600 mt-2">
                This action cannot be undone. All user data will be permanently
                removed.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
