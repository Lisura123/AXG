import { useState, useEffect } from "react";
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import PageTransition from "../components/PageTransition";

const API_BASE_URL = `${
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:8001"
    : "https://axgphoto.com")
}/api`;

interface ResetPasswordPageProps {
  token: string;
  onNavigate: (page: string, data?: any) => void;
}

export default function ResetPasswordPage({
  token,
  onNavigate,
}: ResetPasswordPageProps) {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Check if token exists
  useEffect(() => {
    if (!token || token.trim() === '') {
      setError("No reset token provided. Please use the link from your email.");
    }
  }, [token]);

  // Validate password strength
  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push(
        "Password must contain at least one special character (@$!%*?&)"
      );
    }

    return errors;
  };

  useEffect(() => {
    if (formData.password) {
      setValidationErrors(validatePassword(formData.password));
    } else {
      setValidationErrors([]);
    }
  }, [formData.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password strength
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      setError("Please fix the password requirements below");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSuccess(true);
      } else {
        const errorMessage = data.message || "Failed to reset password";
        setError(errorMessage);
        
        // Log for debugging
        console.error('Password reset failed:', {
          status: response.status,
          message: errorMessage,
          tokenLength: token?.length
        });
      }
    } catch (err) {
      console.error('Network error during password reset:', err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-200">
              <div className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-lg">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
                <h2 className="mt-6 text-2xl font-bold text-gray-900">
                  Password Reset Successful!
                </h2>
                <p className="mt-3 text-sm text-gray-600">
                  Your password has been successfully updated. You can now login
                  with your new password.
                </p>
                <div className="mt-8">
                  <button
                    onClick={() => onNavigate("login")}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-[#1d1d1b] to-[#404040] hover:from-[#2d2d2b] hover:to-[#505050] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 hover:shadow-lg"
                  >
                    Go to Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Reset your password
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your new password below to secure your account.
            </p>
          </div>

          <div className="mt-8">
            <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-200">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>

                  {/* Password strength indicators */}
                  {formData.password && (
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-gray-600">
                        Password requirements:
                      </p>
                      {[
                        {
                          check: formData.password.length >= 8,
                          text: "At least 8 characters",
                        },
                        {
                          check: /(?=.*[a-z])/.test(formData.password),
                          text: "One lowercase letter",
                        },
                        {
                          check: /(?=.*[A-Z])/.test(formData.password),
                          text: "One uppercase letter",
                        },
                        {
                          check: /(?=.*\d)/.test(formData.password),
                          text: "One number",
                        },
                        {
                          check: /(?=.*[@$!%*?&])/.test(formData.password),
                          text: "One special character",
                        },
                      ].map((req, index) => (
                        <div key={index} className="flex items-center text-xs">
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              req.check ? "bg-green-500" : "bg-gray-300"
                            }`}
                          />
                          <span
                            className={
                              req.check ? "text-green-600" : "text-gray-500"
                            }
                          >
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm New Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>

                  {formData.confirmPassword &&
                    formData.password !== formData.confirmPassword && (
                      <p className="mt-1 text-xs text-red-600">
                        Passwords do not match
                      </p>
                    )}
                </div>

                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                      <div className="ml-3 flex-1">
                        <p className="text-sm text-red-800">{error}</p>
                        {(error.includes('expired') || error.includes('Invalid')) && (
                          <button
                            onClick={() => onNavigate("forgot-password")}
                            className="mt-2 text-sm font-medium text-red-600 hover:text-red-500 underline"
                          >
                            Request a new reset link
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={
                      loading ||
                      validationErrors.length > 0 ||
                      formData.password !== formData.confirmPassword
                    }
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Resetting Password...
                      </div>
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
