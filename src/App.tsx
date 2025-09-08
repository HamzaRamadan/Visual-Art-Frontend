import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import ScrollToTop from "./components/common/ScrollToTop";
import Home from "./pages/Home";

import ProductsPage from "./pages/ProductsPage/ProductsPage";
import Contact from "./pages/Contact";
import AboutUs from "./components/sections/AboutUs/AboutUs";
import AboutDetailes from "./pages/AboutDetailes";
import ServicesSection from "./components/sections/ServicesSection/ServicesSection";
import ServiceDetails from "./components/sections/ServiceDetails/ServiceDetails";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import News from "./pages/News/News";
import CompanyProfile from "./pages/CompanyProfile";
import ProductDetail from "./pages/ProductDetails/ProductDetail";

import Login from "./components/admin/pages/Login";
import AdminDashboard from "./components/admin/AdminDashboard";

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <Router>
        <div className="app">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/services" element={<ServicesSection />} />
              <Route path="/services/:id" element={<ServiceDetails />} />
              <Route path="/services/:id" element={<ServiceDetailPage />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/news" element={<News />} />
              <Route path="/CompanyProfile" element={<CompanyProfile />} />
              <Route path="/AboutDetailes" element={<AboutDetailes />} />

              <Route path="/adminToDashBoard/*"element={<AdminDashboard />} />
              <Route path="/admin/" element={<Login />} />

            </Routes>
          </main>
          <Footer />
          <ScrollToTop />
        </div>
      </Router>
    </LanguageProvider>
  );
};

export default App;
