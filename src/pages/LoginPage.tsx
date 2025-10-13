import { useState } from "react";
import {
  Mail,
  Lock,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import PageTransition from "../components/PageTransition";

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError.message);
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

        <div className="max-w-md w-full relative z-10">
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
              Welcome Back
            </h1>
            <p className="text-gray-600 text-lg">
              Sign in to continue your creative journey
            </p>

            {/* Trust Indicators */}
            <div className="flex justify-center items-center mt-6 space-x-6">
              <div className="flex items-center text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Secure Login
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Protected Data
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
                      placeholder="Enter your password"
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
                </div>

                {/* Enhanced Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#1d1d1b] to-[#404040] text-white py-4 rounded-xl font-bold text-lg hover:from-[#404040] hover:to-[#1d1d1b] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Signing you in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </form>

              {/* Enhanced Footer */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Don't have an account yet?
                  </p>
                  <button
                    onClick={() => onNavigate("signup")}
                    className="inline-flex items-center space-x-2 text-[#1d1d1b] font-semibold hover:text-[#404040] transition-colors duration-300 group"
                  >
                    <span>Create your account</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>

                {/* Security Notice */}
                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500 flex items-center justify-center">
                    <Lock className="w-3 h-3 mr-1" />
                    Your data is encrypted and secure
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
