import { useState } from "react";
import {
  Mail,
  Lock,
  User,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  Shield,
  Zap,
  Camera,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import PageTransition from "../components/PageTransition";

interface SignupPageProps {
  onNavigate: (page: string) => void;
}

export default function SignupPage({ onNavigate }: SignupPageProps) {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[@$!%*?&]/.test(pwd)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const getStrengthColor = (strength: number) => {
    if (strength < 2) return "bg-red-500";
    if (strength < 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength: number) => {
    if (strength < 2) return "Weak";
    if (strength < 4) return "Medium";
    return "Strong";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    // Validate password complexity
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)"
      );
      return;
    }

    setLoading(true);

    // Split full name into first and last name
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    console.log("Signup data being sent:", {
      firstName,
      lastName,
      email,
      password: "***hidden***",
    });

    const { error: signUpError } = await signUp({
      firstName,
      lastName,
      email,
      password,
    });

    if (signUpError) {
      console.error("Signup error:", signUpError);
      setError(
        typeof signUpError === "string"
          ? signUpError
          : signUpError.message || "Registration failed"
      );
      setLoading(false);
    } else {
      onNavigate("home");
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center px-4 py-8 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-[#404040]/10 to-[#1d1d1b]/5 rounded-full animate-float blur-sm"></div>
          <div className="absolute top-1/2 right-20 w-32 h-32 bg-gradient-to-br from-[#1d1d1b]/10 to-[#404040]/5 rounded-full animate-float-delay blur-sm"></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-gradient-to-br from-[#404040]/8 to-[#1d1d1b]/3 rounded-full animate-pulse-slow blur-sm"></div>
        </div>

        <div className="max-w-lg w-full relative z-10">
          {/* Enhanced Header */}
          <div className="text-center mb-10 animate-fade-in-up">
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#404040] to-[#1d1d1b] rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative bg-white p-4 rounded-2xl shadow-xl">
                  <img
                    src="/axg logo.png"
                    alt="AXG - Power Your Creativity"
                    className="h-16 w-auto"
                  />
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-[#1d1d1b] mb-3 bg-gradient-to-r from-[#1d1d1b] to-[#404040] bg-clip-text text-transparent">
              Create Your Account
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              Join thousands of photographers and power your creativity
            </p>

            {/* Benefits */}
            <div className="flex justify-center items-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center">
                <Camera className="w-4 h-4 mr-2 text-[#404040]" />
                Pro Tools
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-[#404040]" />
                Secure
              </div>
              <div className="flex items-center">
                <Zap className="w-4 h-4 mr-2 text-[#404040]" />
                Fast Setup
              </div>
            </div>
          </div>

          {/* Enhanced Form Container */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 lg:p-10 border border-gray-200/50 animate-fade-in-up delay-100 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#404040]/5 to-transparent rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#1d1d1b]/5 to-transparent rounded-tr-full"></div>

            <div className="relative z-10">
              {error && (
                <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-400 rounded-xl flex items-center text-red-700 animate-fade-in">
                  <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#1d1d1b] mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#404040] transition-colors duration-300" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#404040]/20 focus:border-[#404040] transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#1d1d1b] mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#404040] transition-colors duration-300" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#404040]/20 focus:border-[#404040] transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#1d1d1b] mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#404040] transition-colors duration-300" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#404040]/20 focus:border-[#404040] transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                      placeholder="Create a strong password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#404040] transition-colors duration-300 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">
                          Password Strength:
                        </span>
                        <span
                          className={`text-sm font-semibold ${
                            passwordStrength < 2
                              ? "text-red-600"
                              : passwordStrength < 4
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {getStrengthText(passwordStrength)}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                              i < passwordStrength
                                ? getStrengthColor(passwordStrength)
                                : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mt-2 space-y-1">
                    <p>Password must contain:</p>
                    <div className="grid grid-cols-2 gap-1">
                      <div
                        className={`flex items-center ${
                          password.length >= 8
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        8+ characters
                      </div>
                      <div
                        className={`flex items-center ${
                          /[A-Z]/.test(password)
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Uppercase
                      </div>
                      <div
                        className={`flex items-center ${
                          /[a-z]/.test(password)
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Lowercase
                      </div>
                      <div
                        className={`flex items-center ${
                          /\d/.test(password)
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Number
                      </div>
                      <div
                        className={`flex items-center ${
                          /[@$!%*?&]/.test(password)
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Special char
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#1d1d1b] mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#404040] transition-colors duration-300" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:ring-2 focus:ring-[#404040]/20 focus:border-[#404040] transition-all duration-300 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500 ${
                        confirmPassword && password !== confirmPassword
                          ? "border-red-300"
                          : "border-gray-200"
                      }`}
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#404040] transition-colors duration-300 focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Passwords don't match
                    </p>
                  )}
                  {confirmPassword &&
                    password === confirmPassword &&
                    confirmPassword.length > 0 && (
                      <p className="text-sm text-green-600 flex items-center mt-1">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Passwords match
                      </p>
                    )}
                </div>

                {/* Enhanced Submit Button */}
                <button
                  type="submit"
                  disabled={
                    loading ||
                    passwordStrength < 3 ||
                    password !== confirmPassword
                  }
                  className="w-full bg-gradient-to-r from-[#1d1d1b] to-[#404040] text-white py-4 rounded-xl font-bold text-lg hover:from-[#404040] hover:to-[#1d1d1b] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Creating your account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </form>

              {/* Enhanced Footer */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-gray-600 mb-4">Already have an account?</p>
                  <button
                    onClick={() => onNavigate("login")}
                    className="inline-flex items-center space-x-2 text-[#1d1d1b] font-semibold hover:text-[#404040] transition-colors duration-300 group"
                  >
                    <span>Sign in here</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>

                {/* Security Notice */}
                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500 flex items-center justify-center">
                    <Shield className="w-3 h-3 mr-1" />
                    Your information is encrypted and secure
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
