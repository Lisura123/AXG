import { Store, Globe, Flag, Users } from "lucide-react";
import PageTransition from "../components/PageTransition";

export default function WhereToBuyPage() {
  const countries = [
    {
      name: "Sri Lanka",
      flag: "🇱🇰",
      description: "Authorized dealers across major cities",
    },
    {
      name: "Maldives",
      flag: "🇲🇻",
      description: "Premium photography equipment for paradise",
    },
    {
      name: "Singapore",
      flag: "🇸🇬",
      description: "Professional photography solutions in the Lion City",
    },
  ];

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
                Where to Buy
              </h1>
              <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                Discover AXG products through our authorized retailers across
                South Asia and Southeast Asia
              </p>

              {/* Regional Coverage */}
              <div className="flex justify-center items-center space-x-8 mt-12">
                <div className="text-center animate-fade-in-up delay-100">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">3</div>
                  <div className="text-sm text-gray-300">Countries</div>
                </div>
                <div className="text-center animate-fade-in-up delay-200">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                    <Store className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">15+</div>
                  <div className="text-sm text-gray-300">Retail Partners</div>
                </div>
                <div className="text-center animate-fade-in-up delay-300">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-sm text-gray-300">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Countries Section */}
          <div className="animate-fade-in-up">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-[#1d1d1b] mb-4">
                Authorized Retailers by Country
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Find your nearest AXG authorized dealer for authentic products
                and expert support
              </p>
            </div>

            <div className="space-y-12">
              {countries.map((country, countryIndex) => (
                <div
                  key={country.name}
                  className={`animate-fade-in-up delay-${
                    (countryIndex + 1) * 100
                  }`}
                >
                  {/* Country Header */}
                  <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="text-4xl">{country.flag}</div>
                        <div>
                          <h3 className="text-3xl font-bold text-[#1d1d1b]">
                            {country.name}
                          </h3>
                          <p className="text-gray-600 text-lg">
                            {country.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="bg-gradient-to-br from-[#1d1d1b] to-[#404040] text-white px-4 py-2 rounded-lg">
                          <Flag className="w-5 h-5 inline mr-2" />
                          Available
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Country availability notice */}
                  <div className="text-center py-8">
                    <p className="text-gray-600 text-lg">
                      AXG products are available through authorized retailers
                      across {country.name}.
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Contact us for more information about purchasing options
                      in your area.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Partnership Section */}
          <div className="mt-16 animate-fade-in-up delay-400">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-100 relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#404040]/5 to-transparent rounded-bl-full"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#1d1d1b]/5 to-transparent rounded-tr-full"></div>

              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1d1d1b] to-[#404040] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-[#1d1d1b] mb-4">
                    Become an Authorized Retailer
                  </h3>
                  <p className="text-gray-700 text-lg max-w-2xl mx-auto">
                    Join our growing network of photography retailers across
                    South Asia and Southeast Asia. We're looking for passionate
                    partners who share our commitment to quality and customer
                    excellence.
                  </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                    <Store className="w-8 h-8 text-[#404040] mx-auto mb-3" />
                    <h4 className="font-bold text-[#1d1d1b] mb-2">
                      Premium Products
                    </h4>
                    <p className="text-sm text-gray-600">
                      Access to our complete range of professional photography
                      equipment
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                    <Globe className="w-8 h-8 text-[#404040] mx-auto mb-3" />
                    <h4 className="font-bold text-[#1d1d1b] mb-2">
                      Marketing Support
                    </h4>
                    <p className="text-sm text-gray-600">
                      Comprehensive marketing materials and regional advertising
                      support
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                    <Users className="w-8 h-8 text-[#404040] mx-auto mb-3" />
                    <h4 className="font-bold text-[#1d1d1b] mb-2">
                      Training Programs
                    </h4>
                    <p className="text-sm text-gray-600">
                      Expert product training and certification for your sales
                      team
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
