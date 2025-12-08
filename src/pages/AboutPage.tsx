import { Camera, Target, Award, Users } from "lucide-react";
import PageTransition from "../components/PageTransition";

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <div className="relative bg-gradient-to-br from-[#404040] via-[#2d2d2b] to-[#1d1d1b] text-white py-20 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div
              className="absolute bottom-20 right-20 w-32 h-32 bg-white rounded-full blur-2xl animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full blur-xl animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Badge */}
              <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full mb-8 animate-slideInUp">
                <Camera className="w-5 h-5 mr-3" />
                <span className="text-sm font-semibold tracking-wide">
                  SINCE 2020
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slideInLeft">
                About{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                  AXG
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-2xl md:text-3xl text-gray-200 max-w-4xl mx-auto leading-relaxed animate-slideInRight">
                Empowering photographers with premium camera accessories that
                inspire creativity and deliver professional results
              </p>

              {/* Stats Row */}
              <div className="flex justify-center mt-12 space-x-8 md:space-x-16 animate-slideInUp">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white">
                    5+
                  </div>
                  <div className="text-sm text-gray-300 uppercase tracking-wider">
                    Years Experience
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white">
                    10K+
                  </div>
                  <div className="text-sm text-gray-300 uppercase tracking-wider">
                    Happy Customers
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white">
                    12+
                  </div>
                  <div className="text-sm text-gray-300 uppercase tracking-wider">
                    Products
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white">
                    99%
                  </div>
                  <div className="text-sm text-gray-300 uppercase tracking-wider">
                    Satisfaction
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div className="animate-slideInLeft">
              <div className="inline-flex items-center px-4 py-2 bg-[#1d1d1b]/10 rounded-full mb-6">
                <span className="text-sm font-semibold text-[#1d1d1b] uppercase tracking-wider">
                  Our Journey
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-[#1d1d1b] mb-8">
                Our Story
              </h2>

              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Founded by photographers for photographers, AXG was born from
                  a simple vision: to create camera accessories that{" "}
                  <strong className="text-[#1d1d1b]">
                    empower creativity without compromise
                  </strong>
                  . We understand the demands of professional photography
                  because we've lived them.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Every product we design is{" "}
                  <strong className="text-[#1d1d1b]">
                    tested in real-world conditions
                  </strong>{" "}
                  by professional photographers. From the brightest sunlight to
                  the darkest studios, our accessories perform when it matters
                  most.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Today, AXG serves{" "}
                  <strong className="text-[#1d1d1b]">
                    thousands of photographers worldwide
                  </strong>
                  , from beginners to seasoned professionals, all united by a
                  passion for capturing the perfect shot.
                </p>
              </div>

              <div className="mt-8 flex space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#1d1d1b]">2020</div>
                  <div className="text-sm text-gray-500">Founded</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#1d1d1b]">
                    Global
                  </div>
                  <div className="text-sm text-gray-500">Reach</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#1d1d1b]">Pro</div>
                  <div className="text-sm text-gray-500">Grade</div>
                </div>
              </div>
            </div>

            <div className="animate-slideInRight">
              <div className="relative">
                {/* Main Card */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12 flex items-center justify-center h-96 shadow-2xl border border-gray-200">
                  <div className="relative">
                    {/* Floating Elements */}
                    <div className="absolute -top-6 -left-6 w-12 h-12 bg-[#1d1d1b] rounded-xl rotate-12 opacity-20 animate-float"></div>
                    <div
                      className="absolute -bottom-4 -right-4 w-8 h-8 bg-[#404040] rounded-lg rotate-45 opacity-30 animate-float"
                      style={{ animationDelay: "1s" }}
                    ></div>

                    {/* Main Icon */}
                    <Camera className="w-32 h-32 text-[#404040] drop-shadow-lg" />

                    {/* Orbiting Elements */}
                    <div className="absolute top-0 right-0 w-4 h-4 bg-[#1d1d1b] rounded-full animate-ping"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 bg-[#404040] rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#1d1d1b]/5 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#404040]/5 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="group text-center p-8 bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slideInUp">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#1d1d1b] to-[#404040] rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#404040]/20 rounded-full animate-pulse"></div>
              </div>

              <h3 className="text-2xl font-bold text-[#1d1d1b] mb-4 group-hover:text-[#404040] transition-colors duration-300">
                Our Mission
              </h3>

              <p className="text-gray-700 leading-relaxed">
                To provide photographers with reliable, high-quality accessories
                that enhance their creative vision and workflow.
              </p>

              <div className="mt-6 h-1 bg-gradient-to-r from-[#1d1d1b] to-[#404040] rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>

            <div
              className="group text-center p-8 bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slideInUp"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#1d1d1b] to-[#404040] rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <div
                  className="absolute -top-2 -right-2 w-6 h-6 bg-[#404040]/20 rounded-full animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
              </div>

              <h3 className="text-2xl font-bold text-[#1d1d1b] mb-4 group-hover:text-[#404040] transition-colors duration-300">
                Quality First
              </h3>

              <p className="text-gray-700 leading-relaxed">
                Every product undergoes rigorous testing to ensure it meets our
                exacting standards for performance and durability.
              </p>

              <div className="mt-6 h-1 bg-gradient-to-r from-[#1d1d1b] to-[#404040] rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>

            <div
              className="group text-center p-8 bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slideInUp"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#1d1d1b] to-[#404040] rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <div
                  className="absolute -top-2 -right-2 w-6 h-6 bg-[#404040]/20 rounded-full animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>

              <h3 className="text-2xl font-bold text-[#1d1d1b] mb-4 group-hover:text-[#404040] transition-colors duration-300">
                Community Driven
              </h3>

              <p className="text-gray-700 leading-relaxed">
                We listen to our community of photographers and continuously
                improve our products based on real feedback.
              </p>

              <div className="mt-6 h-1 bg-gradient-to-r from-[#1d1d1b] to-[#404040] rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>
          </div>

          <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 md:p-16 shadow-2xl border border-gray-200 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-10 right-10 w-32 h-32 bg-[#1d1d1b] rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 left-10 w-24 h-24 bg-[#404040] rounded-full blur-2xl"></div>
            </div>

            <div className="relative">
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-6 py-3 bg-[#1d1d1b]/10 rounded-full mb-6">
                  <span className="text-sm font-semibold text-[#1d1d1b] uppercase tracking-wider">
                    Our Advantages
                  </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-[#1d1d1b] mb-4">
                  Why Choose AXG?
                </h2>

                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Discover what sets us apart in the world of professional
                  camera accessories
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="group flex items-start space-x-6 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#1d1d1b] to-[#404040] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-lg">1</span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#404040]/30 rounded-full animate-ping"></div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#1d1d1b] mb-3 group-hover:text-[#404040] transition-colors duration-300">
                      Professional Grade
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      Built to withstand the rigors of professional photography
                      work with military-grade durability standards.
                    </p>
                  </div>
                </div>

                <div
                  className="group flex items-start space-x-6 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  style={{ animationDelay: "0.1s" }}
                >
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#1d1d1b] to-[#404040] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-lg">2</span>
                    </div>
                    <div
                      className="absolute -top-1 -right-1 w-4 h-4 bg-[#404040]/30 rounded-full animate-ping"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#1d1d1b] mb-3 group-hover:text-[#404040] transition-colors duration-300">
                      Innovative Design
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      Thoughtfully designed with the user experience at the
                      forefront, combining form and function seamlessly.
                    </p>
                  </div>
                </div>

                <div
                  className="group flex items-start space-x-6 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  style={{ animationDelay: "0.2s" }}
                >
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#1d1d1b] to-[#404040] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-lg">3</span>
                    </div>
                    <div
                      className="absolute -top-1 -right-1 w-4 h-4 bg-[#404040]/30 rounded-full animate-ping"
                      style={{ animationDelay: "1s" }}
                    ></div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#1d1d1b] mb-3 group-hover:text-[#404040] transition-colors duration-300">
                      Reliable Performance
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      Consistent performance you can depend on for every shoot,
                      tested in extreme conditions worldwide.
                    </p>
                  </div>
                </div>

                <div
                  className="group flex items-start space-x-6 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  style={{ animationDelay: "0.3s" }}
                >
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#1d1d1b] to-[#404040] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-lg">4</span>
                    </div>
                    <div
                      className="absolute -top-1 -right-1 w-4 h-4 bg-[#404040]/30 rounded-full animate-ping"
                      style={{ animationDelay: "1.5s" }}
                    ></div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#1d1d1b] mb-3 group-hover:text-[#404040] transition-colors duration-300">
                      Expert Support
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      Our team of professional photographers is here to help you
                      succeed with dedicated support and guidance.
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
