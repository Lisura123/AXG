import { Mail, Instagram, Facebook, Twitter, Youtube } from "lucide-react";

interface FooterProps {
  onNavigate: (page: string, data?: any) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1d1d1b] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <img
                src="/axg logo.png"
                alt="AXG - Power Your Creativity"
                className="h-16 w-auto"
              />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Premium camera accessories designed for photographers who demand
              excellence.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate("home")}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("products")}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("about")}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("where-to-buy")}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Where to Buy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("contact")}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() =>
                    onNavigate("products", { category: "Batteries" })
                  }
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Batteries
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    onNavigate("products", { category: "Chargers" })
                  }
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Chargers
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    onNavigate("products", { category: "Card Readers" })
                  }
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Card Readers
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    onNavigate("products", { category: "Lens Filters" })
                  }
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Lens Filters
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Connect</h3>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <Mail className="w-4 h-4" />
                <a
                  href="mailto:info@axgphoto.com"
                  className="hover:text-white transition-colors"
                >
                  info@axgphoto.com
                </a>
              </li>
            </ul>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            &copy; {currentYear} AXG. All rights reserved. Power Your
            Creativity.
          </p>
        </div>
      </div>
    </footer>
  );
}
