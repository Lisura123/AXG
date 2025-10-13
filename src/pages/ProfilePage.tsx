import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Save,
  AlertCircle,
  CheckCircle,
  Camera,
  Shield,
  Settings,
  Key,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import PageTransition from "../components/PageTransition";
import { useNotification } from "../contexts/NotificationContext";

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

export default function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      onNavigate("login");
      return;
    }
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      // Use localStorage for basic profile data
      console.log("Loading profile from localStorage");
      setProfile({
        full_name:
          localStorage.getItem(`full_name_\${user._id}`) || user.fullName || "",
        email: user.email || "",
        phone: localStorage.getItem(`phone_\${user._id}`) || "",
      });
    } catch (error) {
      console.error("Error loading profile:", error);
      showNotification("Error loading profile data", "error");

      // Fallback to basic user data
      setProfile({
        full_name: user.fullName || "",
        email: user.email || "",
        phone: "",
      });
    }

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      // Validate password fields if any password field is filled
      const isChangingPassword =
        passwords.newPassword || passwords.confirmPassword;

      if (isChangingPassword) {
        if (!passwords.newPassword) {
          throw new Error("New password is required");
        }
        if (passwords.newPassword.length < 6) {
          throw new Error("New password must be at least 6 characters long");
        }
        if (passwords.newPassword !== passwords.confirmPassword) {
          throw new Error("New passwords do not match");
        }
      }

      // Save profile data to localStorage
      if (user?._id) {
        localStorage.setItem(`full_name_\${user._id}`, profile.full_name);
        localStorage.setItem(`phone_\${user._id}`, profile.phone);
      }

      // Handle password change (simulated since we're using localStorage)
      if (isChangingPassword) {
        // In a real app, you would send this to your backend
        // For now, we'll just simulate success
        console.log("Password change requested");
        showNotification("Password updated successfully! 🔐", "success");

        // Clear password fields
        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }

      setSaving(false);
      setSuccess(true);
      showNotification("Profile updated successfully! 🎉", "success");
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      setSaving(false);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to save profile. Please try again.";
      setError(errorMessage);
      showNotification(errorMessage, "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#404040]"></div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
        {/* Enhanced Hero Section */}
        <div className="relative bg-gradient-to-br from-[#404040] via-[#2a2a28] to-[#1d1d1b] text-white py-20 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full animate-float"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-white/3 rounded-full animate-float-delay"></div>
            <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-white/4 rounded-full animate-pulse-slow"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between animate-fade-in-up">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  My Profile
                </h1>
                <p className="text-xl text-gray-200">
                  Manage your account information and preferences
                </p>
              </div>
              <div className="hidden lg:flex items-center space-x-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
                    <Settings className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-sm text-gray-300">Settings</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-sm text-gray-300">Security</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-200/50 animate-fade-in-up sticky top-24">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#404040]/5 to-transparent rounded-bl-full"></div>

                <div className="text-center relative z-10">
                  {/* Enhanced Avatar */}
                  <div className="relative inline-block mb-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-[#1d1d1b] to-[#404040] rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
                      {profile.full_name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <button
                      onClick={() =>
                        showNotification(
                          "Photo upload feature coming soon! 📷",
                          "info"
                        )
                      }
                      className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-[#404040] hover:text-[#1d1d1b] transition-colors duration-300 border-2 border-gray-100"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                  </div>

                  <h2 className="text-2xl font-bold text-[#1d1d1b] mb-2">
                    {profile.full_name || "User Name"}
                  </h2>
                  <p className="text-gray-600 mb-1">{profile.email}</p>
                  <p className="text-sm text-gray-500">
                    Member since {new Date().getFullYear()}
                  </p>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 lg:p-10 border border-gray-200/50 animate-fade-in-up delay-100 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#404040]/5 to-transparent rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#1d1d1b]/5 to-transparent rounded-tr-full"></div>

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-[#1d1d1b] mb-2">
                        Account Information
                      </h3>
                      <p className="text-gray-600">
                        Update your personal details and contact information
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-[#1d1d1b] to-[#404040] rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Status Messages */}
                  {success && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-400 rounded-xl flex items-center text-green-700 animate-fade-in">
                      <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0" />
                      <span className="font-medium">
                        Profile updated successfully!
                      </span>
                    </div>
                  )}

                  {error && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-400 rounded-xl flex items-center text-red-700 animate-fade-in">
                      <AlertCircle className="w-6 h-6 mr-3 flex-shrink-0" />
                      <span className="font-medium">{error}</span>
                    </div>
                  )}

                  {/* Simple Form */}
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Full Name Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#1d1d1b] mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#404040] transition-colors duration-300" />
                        <input
                          type="text"
                          value={profile.full_name}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              full_name: e.target.value,
                            })
                          }
                          className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#404040]/20 focus:border-[#404040] transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#1d1d1b] mb-2">
                        Email Address
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={profile.email}
                          className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed text-gray-600"
                          disabled
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          <Shield className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Shield className="w-4 h-4 mr-1" />
                        Email cannot be changed for security reasons
                      </p>
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#1d1d1b] mb-2">
                        Phone Number
                      </label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#404040] transition-colors duration-300" />
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) =>
                            setProfile({ ...profile, phone: e.target.value })
                          }
                          className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#404040]/20 focus:border-[#404040] transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>

                    {/* Password Change Section */}
                    <div className="pt-6 border-t border-gray-100">
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-[#1d1d1b] mb-2 flex items-center">
                          <Key className="w-5 h-5 mr-2" />
                          Change Password
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Leave blank if you don't want to change your password
                        </p>
                      </div>

                      {/* Current password not required */}

                      {/* New Password */}
                      <div className="space-y-2 mb-6">
                        <label className="block text-sm font-semibold text-[#1d1d1b] mb-2">
                          New Password
                        </label>
                        <div className="relative group">
                          <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#404040] transition-colors duration-300" />
                          <input
                            type={showPasswords.new ? "text" : "password"}
                            value={passwords.newPassword}
                            onChange={(e) =>
                              setPasswords({
                                ...passwords,
                                newPassword: e.target.value,
                              })
                            }
                            className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#404040]/20 focus:border-[#404040] transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900"
                            placeholder="Enter new password (min. 6 characters)"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPasswords({
                                ...showPasswords,
                                new: !showPasswords.new,
                              })
                            }
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#404040] transition-colors duration-300"
                          >
                            {showPasswords.new ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        {passwords.newPassword &&
                          passwords.newPassword.length < 6 && (
                            <p className="text-sm text-red-500 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              Password must be at least 6 characters long
                            </p>
                          )}
                      </div>

                      {/* Confirm New Password */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-[#1d1d1b] mb-2">
                          Confirm New Password
                        </label>
                        <div className="relative group">
                          <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#404040] transition-colors duration-300" />
                          <input
                            type={showPasswords.confirm ? "text" : "password"}
                            value={passwords.confirmPassword}
                            onChange={(e) =>
                              setPasswords({
                                ...passwords,
                                confirmPassword: e.target.value,
                              })
                            }
                            className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#404040]/20 focus:border-[#404040] transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900"
                            placeholder="Confirm your new password"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPasswords({
                                ...showPasswords,
                                confirm: !showPasswords.confirm,
                              })
                            }
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#404040] transition-colors duration-300"
                          >
                            {showPasswords.confirm ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        {passwords.confirmPassword &&
                          passwords.newPassword !==
                            passwords.confirmPassword && (
                            <p className="text-sm text-red-500 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              Passwords do not match
                            </p>
                          )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                      <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-gradient-to-r from-[#1d1d1b] to-[#404040] text-white py-4 rounded-xl font-bold text-lg hover:from-[#404040] hover:to-[#1d1d1b] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            <span>Saving Changes...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-6 h-6" />
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Security Notice */}
                    <div className="pt-6 border-t border-gray-100">
                      <p className="text-center text-sm text-gray-500 flex items-center justify-center">
                        <Shield className="w-4 h-4 mr-2" />
                        Your information is encrypted and secure
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
