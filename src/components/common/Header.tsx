import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguageHook } from "../../hooks/useLanguage";
import LanguageSwitcher from "./LanguageSwitcher";
import { companyData } from "../../utils/data";

const Header: React.FC = () => {
  const { language } = useLanguageHook();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isRTL = language === "ar";

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navLinks = [
    { path: "/", label: isRTL ? "الرئيسية" : "Home" },
    { path: "/AboutDetailes", label: isRTL ? "من نحن" : "About Us" },
    { path: "/services", label: isRTL ? "خدماتنا" : "Services" },
    { path: "/products", label: isRTL ? "منتجاتنا" : "Products" },
    { path: "/contact", label: isRTL ? "اتصل بنا" : "Contact" },
    { path: "/news", label: isRTL ? "الاخبار" : "News" },
    { path: "/CompanyProfile", label: isRTL ? "ملف تعريف الشركة" : "Company Profile" },
    // { path: "/admin", label: isRTL ? "  لوحه التحكم" : " DashBoard" },
  ];

  return (
    <header className="header" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/" onClick={closeMenu}>
              <img
                src="../../assets/images/logo.png"
                alt={companyData[language].name}
              />
            </Link>
          </div>

          {/* القائمة الأفقية للشاشات الكبيرة */}
          <nav className="desktop-nav">
            <ul className="nav-links">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-actions">
            <LanguageSwitcher />
            <button
              className={`menu-toggle ${isMenuOpen ? "active" : ""}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        {/* القائمة المنفصلة للشاشات الصغيرة */}
        {isMenuOpen && (
          <nav className="mobile-menu">
            <ul className="mobile-nav-links">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} onClick={closeMenu}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
