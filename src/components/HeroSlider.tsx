import { ArrowRight } from "lucide-react";

interface HeroSliderProps {
  onNavigate: (page: string) => void;
}

export default function HeroSlider({ onNavigate }: HeroSliderProps) {
  return (
    <div className="relative h-[100vh] min-h-[700px] overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 z-5">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Single Hero Video */}
      <div className="absolute inset-0">
        {/* Dynamic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent z-10"></div>

        {/* Hero Video */}
        <div className="absolute inset-0">
          <video
            src="/axg-hero-video.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover filter brightness-110 contrast-105"
            style={{ objectPosition: "center center" }}
          />
        </div>

        {/* Content Container */}
        <div className="absolute inset-0 flex items-center justify-between z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="text-white space-y-6">
              <div className="transition-all duration-1000 delay-200 opacity-100 translate-y-0 translate-x-0">
                {/* Logo with glow effect */}
                <div className="mb-8 group/logo">
                  <img
                    src="/axg logo.png"
                    alt="AXG Logo"
                    className="h-36 w-auto filter drop-shadow-lg group-hover/logo:drop-shadow-xl transition-all duration-300"
                  />
                </div>

                {/* Subtitle with animated underline */}
                <div className="relative">
                  <p className="text-xl md:text-2xl font-medium text-white/90 mb-4">
                    Professional Camera Accessories
                  </p>
                  <div className="h-1 bg-white/60 rounded-full transition-all duration-1000 delay-500 w-24"></div>
                </div>

                {/* Main Title with stagger animation */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                  {["AXG", "-", "Power", "Your", "Creativity"].map(
                    (word, wordIndex) => (
                      <span
                        key={wordIndex}
                        className="inline-block transition-all duration-700 opacity-100 translate-y-0"
                        style={{
                          transitionDelay: `${300 + wordIndex * 100}ms`,
                        }}
                      >
                        {word}&nbsp;
                      </span>
                    )
                  )}
                </h1>

                {/* Description */}
                <p className="text-lg md:text-xl text-white/80 mb-8 max-w-lg leading-relaxed transition-all duration-800 delay-600 opacity-100 translate-y-0">
                  Discover our premium range of camera accessories designed for
                  professional photographers who demand excellence in every
                  shot.
                </p>

                {/* CTA Button with enhanced animation */}
                <div className="transition-all duration-800 delay-700 opacity-100 translate-y-0">
                  <button
                    onClick={() => onNavigate("products")}
                    className="group/cta px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center space-x-3 relative overflow-hidden"
                  >
                    <span className="relative z-10">Explore Our Products</span>
                    <ArrowRight className="w-6 h-6 transform group-hover/cta:translate-x-1 transition-transform duration-300 relative z-10" />

                    {/* Button shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700"></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Right side - floating elements animation */}
            <div className="hidden lg:block relative">
              <div className="transition-all duration-1000 delay-400 opacity-100 translate-x-0 rotate-0">
                {/* Floating geometric shapes */}
                <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full blur-sm animate-pulse"></div>
                <div className="absolute bottom-20 right-32 w-12 h-12 bg-white/15 rounded-lg rotate-45 animate-bounce"></div>
                <div className="absolute top-32 right-64 w-8 h-8 bg-white/20 rounded-full animate-ping"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
