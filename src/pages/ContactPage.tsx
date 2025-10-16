import { useState } from "react";
import {
  Mail,
  Send,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Clock,
  Users,
  Globe,
} from "lucide-react";
import PageTransition from "../components/PageTransition";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:8070/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setError(data.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        {/* Enhanced Hero Section */}
        <div className="relative bg-gradient-to-br from-[#404040] via-[#2a2a28] to-[#1d1d1b] text-white py-20 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full animate-float"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-white/3 rounded-full animate-float-delay"></div>
            <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-white/4 rounded-full animate-pulse-slow"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Get in Touch
              </h1>
              <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                We're here to help you capture your perfect moments. Let's
                create something amazing together.
              </p>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-12">
                <div className="text-center animate-fade-in-up delay-100">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-sm text-gray-300">Support</div>
                </div>
                <div className="text-center animate-fade-in-up delay-200">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">&lt;1h</div>
                  <div className="text-sm text-gray-300">Response</div>
                </div>
                <div className="text-center animate-fade-in-up delay-300">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">100+</div>
                  <div className="text-sm text-gray-300">Happy Clients</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              {/* Contact Methods */}
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-bold text-[#1d1d1b] mb-8">
                  Let's Connect
                </h2>

                {/* Email Section */}
                <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#1d1d1b] to-[#404040] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Mail className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#1d1d1b] mb-2 text-lg">
                        Email Us
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Send us a message anytime, we'll get back to you quickly
                      </p>
                      <div className="space-y-2">
                        <a
                          href="mailto:info@axgphoto.com"
                          className="block text-[#404040] hover:text-[#1d1d1b] font-semibold transition-colors duration-200 hover:underline"
                        >
                          info@axgphoto.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why Choose Us */}
              <div className="animate-fade-in-up delay-200">
                <h3 className="text-2xl font-bold text-[#1d1d1b] mb-6">
                  Why Work With Us?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#1d1d1b] to-[#404040] rounded-full flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1d1d1b]">
                        Global Reach
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Serving photographers worldwide
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#1d1d1b] to-[#404040] rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1d1d1b]">
                        Fast Response
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Quick replies within hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#1d1d1b] to-[#404040] rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1d1d1b]">
                        Expert Support
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Knowledgeable photography specialists
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours Card */}
              <div className="animate-fade-in-up delay-300">
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="font-bold text-[#1d1d1b] mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Business Hours
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Monday - Friday
                      </span>
                      <span className="text-[#1d1d1b] font-bold">
                        9:00 AM - 6:00 PM
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Saturday
                      </span>
                      <span className="text-[#1d1d1b] font-bold">
                        10:00 AM - 4:00 PM
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-medium">Sunday</span>
                      <span className="text-gray-500 font-medium">Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Contact Form */}
            <div className="animate-fade-in-up delay-100">
              <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10 border border-gray-100 relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#404040]/5 to-transparent rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#1d1d1b]/5 to-transparent rounded-tr-full"></div>

                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-[#1d1d1b] mb-3">
                      Send us a Message
                    </h2>
                    <p className="text-gray-600">
                      Tell us about your photography needs and we'll help you
                      find the perfect solution
                    </p>
                  </div>

                  {success && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-400 rounded-xl flex items-center text-green-700 animate-fade-in">
                      <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0" />
                      <span className="font-medium">
                        Message sent successfully! We'll get back to you within
                        24 hours.
                      </span>
                    </div>
                  )}

                  {error && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-400 rounded-xl flex items-center text-red-700 animate-fade-in">
                      <AlertCircle className="w-6 h-6 mr-3 flex-shrink-0" />
                      <span className="font-medium">{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-[#1d1d1b] mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#404040]/20 focus:border-[#404040] transition-all duration-300 bg-gray-50 focus:bg-white"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-[#1d1d1b] mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#404040]/20 focus:border-[#404040] transition-all duration-300 bg-gray-50 focus:bg-white"
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#1d1d1b] mb-2">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#404040]/20 focus:border-[#404040] transition-all duration-300 bg-gray-50 focus:bg-white"
                        placeholder="What's this about?"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#1d1d1b] mb-2">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        rows={6}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#404040]/20 focus:border-[#404040] transition-all duration-300 bg-gray-50 focus:bg-white resize-none"
                        placeholder="Tell us more about your photography needs, questions, or how we can help you..."
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-[#1d1d1b] to-[#404040] text-white py-4 rounded-xl font-bold text-lg hover:from-[#404040] hover:to-[#1d1d1b] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-6 h-6" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Trust Indicators */}
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <p className="text-center text-sm text-gray-500 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      Your information is secure and will never be shared
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
