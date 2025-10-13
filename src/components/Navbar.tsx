import { useState, useEffect } from "react";
import {
  Menu,
  X,
  User,
  Heart,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, data?: any) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);
  const [showLensFiltersSubmenu, setShowLensFiltersSubmenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAdmin, signOut } = useAuth();

  // Track scroll position for enhanced sticky navbar behavior
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "products", label: "Products", hasDropdown: true },
    { id: "about", label: "About" },
    { id: "where-to-buy", label: "Where to Buy" },
    { id: "contact", label: "Contact" },
  ];

  const productCategories = [
    { name: "All Products", category: null, hasSubmenu: false },
    { name: "Batteries", category: "Batteries", hasSubmenu: false },
    { name: "Chargers", category: "Chargers", hasSubmenu: false },
    { name: "Card Readers", category: "Card Readers", hasSubmenu: false },
    {
      name: "Lens Filters",
      category: "Lens Filters",
      hasSubmenu: true,
      submenu: [
        { name: "58mm Filters", category: "58mm Filters" },
        { name: "67mm Filters", category: "67mm Filters" },
        { name: "77mm Filters", category: "77mm Filters" },
      ],
    },
    {
      name: "Camera Backpacks",
      category: "Camera Backpacks",
      hasSubmenu: false,
    },
  ];

  const handleSignOut = async () => {
    await signOut();
    onNavigate("home");
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`bg-[#1d1d1b]/95 backdrop-blur-md text-white sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "shadow-2xl border-b border-gray-700/70 bg-[#1d1d1b]/98"
          : "shadow-lg border-b border-gray-800/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex justify-between items-center transition-all duration-300 ${
            isScrolled ? "h-16" : "h-18"
          }`}
        >
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center group py-2"
          >
            <img
              src="/axg logo.png"
              alt="AXG - Power Your Creativity"
              className={`w-auto group-hover:scale-105 transition-all duration-300 filter drop-shadow-sm ${
                isScrolled ? "h-12" : "h-14"
              }`}
            />
          </button>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() =>
                  item.hasDropdown && setShowProductsDropdown(true)
                }
                onMouseLeave={() =>
                  item.hasDropdown && setShowProductsDropdown(false)
                }
              >
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`text-sm font-medium transition-colors hover:text-gray-300 flex items-center space-x-1 ${
                    currentPage === item.id
                      ? "text-white border-b-2 border-white"
                      : "text-gray-300"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.hasDropdown && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        showProductsDropdown ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  )}
                </button>
                {item.hasDropdown && showProductsDropdown && (
                  <div
                    className="absolute top-full left-0 mt-3 w-64 bg-white rounded-xl shadow-2xl py-4 animate-slideInUp z-50 border border-gray-100 backdrop-blur-sm"
                    style={{
                      boxShadow:
                        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)",
                    }}
                    onMouseLeave={() => {
                      setShowProductsDropdown(false);
                      setShowLensFiltersSubmenu(false);
                    }}
                  >
                    <div className="px-4 pb-3 mb-2 border-b border-gray-100">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Product Categories
                      </h3>
                    </div>
                    {productCategories.map((cat) => (
                      <div
                        key={cat.name}
                        className="relative"
                        onMouseEnter={() =>
                          cat.hasSubmenu && setShowLensFiltersSubmenu(true)
                        }
                        onMouseLeave={() =>
                          cat.hasSubmenu && setShowLensFiltersSubmenu(false)
                        }
                      >
                        <button
                          onClick={(e) => {
                            if (!cat.hasSubmenu) {
                              onNavigate(
                                "products",
                                cat.category ? { category: cat.category } : {}
                              );
                              setShowProductsDropdown(false);
                              setShowLensFiltersSubmenu(false);
                            } else {
                              e.stopPropagation();
                            }
                          }}
                          className="group w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200 flex items-center justify-between rounded-lg mx-2 hover:shadow-md transform hover:translate-x-1"
                        >
                          <span className="font-medium group-hover:text-gray-900 transition-colors duration-200">
                            {cat.name}
                          </span>
                          {cat.hasSubmenu && (
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200 text-gray-400 group-hover:text-gray-600" />
                          )}
                        </button>
                        {cat.hasSubmenu &&
                          showLensFiltersSubmenu &&
                          cat.submenu && (
                            <div
                              className="absolute left-full top-0 ml-2 w-52 bg-white rounded-xl shadow-2xl py-3 animate-slideInRight border border-gray-100"
                              style={{
                                boxShadow:
                                  "0 25px 30px -5px rgba(0, 0, 0, 0.15), 0 15px 15px -5px rgba(0, 0, 0, 0.08)",
                              }}
                            >
                              <div className="px-3 pb-2 mb-2 border-b border-gray-100">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                  Filter Sizes
                                </h4>
                              </div>
                              {cat.submenu.map((subcat, index) => (
                                <button
                                  key={subcat.name}
                                  onClick={() => {
                                    onNavigate("products", {
                                      category: subcat.category,
                                    });
                                    setShowProductsDropdown(false);
                                    setShowLensFiltersSubmenu(false);
                                  }}
                                  className="group w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 rounded-lg mx-2 hover:shadow-sm transform hover:translate-x-1"
                                  style={{ animationDelay: `${index * 50}ms` }}
                                >
                                  <span className="font-medium group-hover:text-gray-900 transition-colors duration-200">
                                    {subcat.name}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {isAdmin && (
                  <button
                    onClick={() => onNavigate("admin")}
                    className="p-2 hover:bg-[#404040] rounded-full transition-colors"
                    title="Admin Dashboard"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => onNavigate("wishlist")}
                  className="p-2 hover:bg-[#404040] rounded-full transition-colors"
                  title="Wishlist"
                >
                  <Heart className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onNavigate("profile")}
                  className="p-2 hover:bg-[#404040] rounded-full transition-colors"
                  title="Profile"
                >
                  <User className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSignOut}
                  className="p-2 hover:bg-[#404040] rounded-full transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate("login")}
                  className="px-4 py-2 text-sm font-medium hover:bg-[#404040] rounded transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => onNavigate("signup")}
                  className="px-4 py-2 text-sm font-medium bg-white text-[#1d1d1b] rounded hover:bg-gray-100 transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded transition-all duration-300 ${
              isScrolled
                ? "hover:bg-[#404040]/80 hover:shadow-lg"
                : "hover:bg-[#404040] hover:shadow-md"
            }`}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className={`md:hidden transition-all duration-300 ${
            isScrolled
              ? "bg-[#404040]/95 backdrop-blur-sm border-t border-gray-600/70"
              : "bg-[#404040] border-t border-gray-700"
          }`}
        >
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded transition-colors ${
                  currentPage === item.id
                    ? "bg-[#1d1d1b] text-white"
                    : "text-gray-300 hover:bg-[#1d1d1b]"
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="border-t border-gray-600 pt-3 space-y-2">
              {user ? (
                <>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        onNavigate("admin");
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-gray-300 hover:bg-[#1d1d1b] rounded transition-colors"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      <span>Admin Dashboard</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onNavigate("wishlist");
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-gray-300 hover:bg-[#1d1d1b] rounded transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                    <span>Wishlist</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate("profile");
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-gray-300 hover:bg-[#1d1d1b] rounded transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-gray-300 hover:bg-[#1d1d1b] rounded transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onNavigate("login");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-gray-300 hover:bg-[#1d1d1b] rounded transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      onNavigate("signup");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 bg-white text-[#1d1d1b] rounded hover:bg-gray-100 transition-colors font-medium"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
