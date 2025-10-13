import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface Slide {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta: string;
  gradient: string;
}

interface HeroSliderProps {
  onNavigate: (page: string) => void;
}

export default function HeroSlider({ onNavigate }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides: Slide[] = [
    {
      title: "Professional Card Readers",
      subtitle: "Lightning Fast Data Transfer",
      description:
        "Experience seamless workflow with our premium USB-C card readers. Designed for photographers who demand speed and reliability.",
      image: "/hero-image-1.png",
      cta: "Explore Card Readers",
      gradient: "from-teal-600/90 via-cyan-500/70 to-blue-600/80",
    },
    {
      title: "Power & Performance",
      subtitle: "Complete Camera Ecosystem",
      description:
        "From batteries to chargers, discover our comprehensive range of camera accessories that keep you shooting longer.",
      image: "/hero-image-2.png",
      cta: "View All Products",
      gradient: "from-emerald-600/90 via-teal-500/70 to-cyan-600/80",
    },
    {
      title: "Professional Charging",
      subtitle: "Advanced Battery Solutions",
      description:
        "Never run out of power with our intelligent charging systems and high-capacity batteries for extended shooting sessions.",
      image: "/hero-image-3.png",
      cta: "Shop Batteries",
      gradient: "from-orange-600/90 via-amber-500/70 to-yellow-600/80",
    },
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative h-[80vh] md:h-[100vh] min-h-[600px] md:min-h-[700px] overflow-hidden group">
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

      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide
              ? "opacity-100 scale-100 translate-x-0"
              : index < currentSlide
              ? "opacity-0 scale-110 -translate-x-full"
              : "opacity-0 scale-110 translate-x-full"
          }`}
        >
          {/* Dynamic Gradient Overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} z-10`}
          ></div>

          {/* Hero Image with Parallax Effect */}
          <div
            className={`absolute inset-0 transition-transform duration-1000 ${
              index === currentSlide ? "scale-100" : "scale-105"
            }`}
          >
            <div className="w-full h-full bg-gray-900">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center filter brightness-110 contrast-105"
                style={{
                  objectPosition: "center center",
                  minHeight: "100%",
                  minWidth: "100%",
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>
          </div>

          {/* Content Container */}
          <div className="absolute inset-0 flex items-center justify-between z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left Content */}
              <div className="text-white space-y-6">
                <div
                  className={`transition-all duration-1000 delay-200 ${
                    index === currentSlide
                      ? "opacity-100 translate-y-0 translate-x-0"
                      : "opacity-0 translate-y-8 -translate-x-8"
                  }`}
                >
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
                      {slide.subtitle}
                    </p>
                    <div
                      className={`h-1 bg-white/60 rounded-full transition-all duration-1000 delay-500 ${
                        index === currentSlide ? "w-24" : "w-0"
                      }`}
                    ></div>
                  </div>

                  {/* Main Title with stagger animation */}
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                    {slide.title.split(" ").map((word, wordIndex) => (
                      <span
                        key={wordIndex}
                        className={`inline-block transition-all duration-700 ${
                          index === currentSlide
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                        }`}
                        style={{
                          transitionDelay: `${300 + wordIndex * 100}ms`,
                        }}
                      >
                        {word}&nbsp;
                      </span>
                    ))}
                  </h1>

                  {/* Description */}
                  <p
                    className={`text-lg md:text-xl text-white/80 mb-8 max-w-lg leading-relaxed transition-all duration-800 delay-600 ${
                      index === currentSlide
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                  >
                    {slide.description}
                  </p>

                  {/* CTA Button with enhanced animation */}
                  <div
                    className={`transition-all duration-800 delay-700 ${
                      index === currentSlide
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                  >
                    <button
                      onClick={() => onNavigate("products")}
                      className="group/cta px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center space-x-3 relative overflow-hidden"
                    >
                      <span className="relative z-10">{slide.cta}</span>
                      <ArrowRight className="w-6 h-6 transform group-hover/cta:translate-x-1 transition-transform duration-300 relative z-10" />

                      {/* Button shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700"></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right side - floating elements animation */}
              <div className="hidden lg:block relative">
                <div
                  className={`transition-all duration-1000 delay-400 ${
                    index === currentSlide
                      ? "opacity-100 translate-x-0 rotate-0"
                      : "opacity-0 translate-x-8 rotate-6"
                  }`}
                >
                  {/* Floating geometric shapes */}
                  <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full blur-sm animate-pulse"></div>
                  <div className="absolute bottom-20 right-32 w-12 h-12 bg-white/15 rounded-lg rotate-45 animate-bounce"></div>
                  <div className="absolute top-32 right-64 w-8 h-8 bg-white/20 rounded-full animate-ping"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Enhanced Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100 hover:shadow-2xl border border-white/20"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100 hover:shadow-2xl border border-white/20"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Enhanced Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative transition-all duration-500 ${
              index === currentSlide ? "w-12 h-3" : "w-3 h-3 hover:w-6"
            }`}
          >
            <div
              className={`absolute inset-0 rounded-full transition-all duration-500 ${
                index === currentSlide
                  ? "bg-white shadow-lg"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            ></div>
            {index === currentSlide && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/60 to-white animate-pulse"></div>
            )}
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30">
        <div
          className="h-full bg-white transition-all duration-300 ease-linear"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
          }}
        ></div>
      </div>
    </div>
  );
}
