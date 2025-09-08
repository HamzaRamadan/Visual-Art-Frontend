import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguageHook } from "../../hooks/useLanguage";
import { companyData } from "../../utils/data";
import { FaPhone, FaGlobe, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Footer: React.FC = () => {
  const { language } = useLanguageHook();
  const isRTL = language === "ar";
  const contact = companyData[language].contact;
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* ✅ CSS داخل الكومبوننت لدعم hover */}
      <style>
        {`
          .footer-link,
          .bottom-link {
            color: rgba(255, 255, 255, 0.8);
            text-decoration: none;
            transition: color 0.3s ease;
            display: inline-block;
          }

          .footer-link:hover,
          .bottom-link:hover {
            color: #3498db; /* أزرق */
          }

          .footer-link {
            font-size: 0.95rem;
          }

          .bottom-link {
            font-size: 0.9rem;
          }
        `}
      </style>

      <footer
        style={{
          backgroundColor: "#7249bc",
          color: "#ffffff",
          fontFamily: "'Cairo', 'Poppins', sans-serif",
          marginTop: "auto",
          paddingTop: windowWidth < 768 ? "30px" : "0",
          paddingBottom: windowWidth < 768 ? "20px" : "0",
        }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div style={{ padding: "30px 0" }}>
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: windowWidth < 576 ? "0 15px" : "0 20px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  windowWidth < 768
                    ? "1fr"
                    : windowWidth < 992
                    ? "repeat(2, 1fr)"
                    : "repeat(3, 1fr)",
                gap: "40px",
              }}
            >
              <div>
                <div
                  style={{
                    marginBottom: "20px",
                    textAlign: windowWidth < 768 ? "center" : "left",
                  }}
                >
                  <img
                    src="/assets/images/Footer.jpeg"
                    alt={companyData[language].name}
                    style={{
                      height:
                        windowWidth < 576
                          ? "90px"
                          : windowWidth < 768
                          ? "100px"
                          : windowWidth < 992
                          ? "110px"
                          : "130px",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <p
                  style={{
                    fontSize: "0.95rem",
                    lineHeight: "1.4",
                    marginBottom: "25px",
                    opacity: 0.9,
                    textAlign: windowWidth < 768 ? "center" : "left",
                    display: "-webkit-box",
                    WebkitLineClamp: windowWidth < 576 ? 2 : undefined,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {companyData[language].slogan}
                </p>
              </div>

             {windowWidth > 992 && (
  <div>
    <h3>{isRTL ? "روابط سريعة" : "Quick Links"}</h3>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "10px 40px",
      }}
    >
      {[
        { path: "/", label: isRTL ? "الرئيسية" : "Home" },
        { path: "/about", label: isRTL ? "من نحن" : "About Us" },
        { path: "/services", label: isRTL ? "خدماتنا" : "Services" },
        { path: "/products", label: isRTL ? "منتجاتنا" : "Products" },
        { path: "/contact", label: isRTL ? "اتصل بنا" : "Contact" },
        { path: "/news", label: isRTL ? "الاخبار" : "News" },
      ].map((link, index) => (
        <div key={index} style={{ marginBottom: "12px" }}>
          <Link to={link.path} className="footer-link">
            {link.label}
          </Link>
        </div>
      ))}
    </div>
  </div>
)}


             {/* Contact Info – Responsive for Mobile */}
<div
  style={{
    flex: 1,
    textAlign: "center",
    marginTop: "20px",
  }}
>
  <h3>{isRTL ? "اتصل بنا" : "Contact Us"}</h3>
  <ul
    style={{
      listStyle: "none",
      padding: 0,
      marginTop: "10px",
      display: "grid",
      gridTemplateColumns: "1fr 1fr", 
      gap: "10px 20px",
      justifyItems: "center",
    }}
  >
    <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <FaMapMarkerAlt />
      <span>{contact.address}</span>
    </li>
    <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <FaPhone />
      <span
        style={{
          direction: "ltr",
          unicodeBidi: "plaintext",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {isRTL ? "+964 782 450 0000" : "+964 782 450 0000"}
      </span>
    </li>
    <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <FaEnvelope />
      <span>{contact.email}</span>
    </li>
    <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <FaGlobe />
      <span>{contact.website}</span>
    </li>
  </ul>
</div>

            </div>
          </div>
        </div>

        <div style={{ backgroundColor: "rgba(0,0,0,0.2)", padding: "20px 0" }}>
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "0 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: windowWidth < 768 ? "column" : "row",
              gap: "10px",
              textAlign: windowWidth < 768 ? "center" : "left",
            }}
          >
            <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
              &copy; {new Date().getFullYear()} {companyData[language].name}.{" "}
              {isRTL ? "جميع الحقوق محفوظة" : "All Rights Reserved"}.
            </p>
            {/* <div
              style={{
                display: "flex",
                gap:
                  windowWidth < 576
                    ? "8px"
                    : windowWidth < 768
                    ? "10px"
                    : "20px",
                flexDirection: windowWidth < 576 ? "column" : "row",
                alignItems: "center",
              }}
            >
              <Link to="/privacy" className="bottom-link">
                {isRTL ? "سياسة الخصوصية" : "Privacy Policy"}
              </Link>
              <Link to="/terms" className="bottom-link">
                {isRTL ? "الشروط والأحكام" : "Terms & Conditions"}
              </Link>
            </div> */}
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
