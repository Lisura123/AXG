import { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loading from "./components/Loading";
import ScrollToTop from "./components/ScrollToTop";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import WhereToBuyPage from "./pages/WhereToBuyPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import WishlistPage from "./pages/WishlistPage";
import AdminDashboard from "./pages/AdminDashboard";

interface PageData {
  productId?: string;
  category?: string;
  subcategory?: string;
}

function AppContent() {
  const { loading } = useAuth();
  const [currentPage, setCurrentPage] = useState("home");
  const [pageData, setPageData] = useState<PageData>({});

  const handleNavigate = (page: string, data?: PageData) => {
    setCurrentPage(page);
    setPageData(data || {});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="flex-grow">
        {currentPage === "home" && <HomePage onNavigate={handleNavigate} />}
        {currentPage === "products" && (
          <ProductsPage
            onNavigate={handleNavigate}
            initialCategory={pageData.category}
            initialSubcategory={pageData.subcategory}
          />
        )}
        {currentPage === "product-detail" && pageData.productId && (
          <ProductDetailPage
            productId={pageData.productId}
            onNavigate={handleNavigate}
          />
        )}
        {currentPage === "about" && <AboutPage />}
        {currentPage === "contact" && <ContactPage />}
        {currentPage === "where-to-buy" && <WhereToBuyPage />}
        {currentPage === "login" && <LoginPage onNavigate={handleNavigate} />}
        {currentPage === "signup" && <SignupPage onNavigate={handleNavigate} />}
        {currentPage === "profile" && (
          <ProfilePage onNavigate={handleNavigate} />
        )}
        {currentPage === "wishlist" && (
          <WishlistPage onNavigate={handleNavigate} />
        )}
        {currentPage === "admin" && (
          <AdminDashboard onNavigate={handleNavigate} />
        )}
      </main>
      <Footer onNavigate={handleNavigate} />
      <ScrollToTop />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
