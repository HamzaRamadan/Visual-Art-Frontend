import { Routes, Route, NavLink } from "react-router-dom";
import NewsPage from "./pages/NewsPage";
import ProductsPage from "./pages/ProductsPage";
import { useLanguageHook } from "../../hooks/useLanguage"; // 👈 نفس فكرة useLanguage عندك
import Uploadvedio from "./pages/UploadVideo";
import AdsManager from './pages/AdsManager'
import Logistics from "./pages/Logistics";
import AdminServices from "./pages/Service";

export default function AdminDashboard() {
  const { language } = useLanguageHook();
  const isRTL = language === "ar";

  return (
    <div
      className="admin-dashboard"
      dir={isRTL ? "rtl" : "ltr"}  // 👈 نفس فكرة AboutUs
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "sans-serif",
    justifyContent: isRTL ? "flex-end" : "flex-start", // 👈 هنا بيتحرك كله
      }}
    >
      {/* سايد بار */}
      <nav
        style={{
          width: "240px",
          minWidth: "240px",
          maxWidth: "240px",
          background: "#1e293b",
          color: "#fff",
          padding: "1rem",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <h2 style={{ marginBottom: "2rem", textAlign: "center",fontSize: "24px",fontWeight: "bold" }}>
          {isRTL ? "لوحة التحكم" : "Dashboard"}
        </h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ marginBottom: "1rem" }}>
            <NavLink
              to="/adminToDashBoard/news"
              style={({ isActive }) => ({
                display: "block",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                textDecoration: "none",
                color: isActive ? "#1e293b" : "#fff",
                background: isActive ? "#facc15" : "transparent",
                fontWeight: isActive ? "bold" : "normal",
              })}
            >
              {isRTL ? "📦 الأخبار" : "📦 News"}
            </NavLink>
          </li>
          <li style={{ marginBottom: "1rem" }}>
            <NavLink
              to="/adminToDashBoard/uploadvedio"
              style={({ isActive }) => ({
                display: "block",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                textDecoration: "none",
                color: isActive ? "#1e293b" : "#fff",
                background: isActive ? "#facc15" : "transparent",
                fontWeight: isActive ? "bold" : "normal",
              })}
            >
              {isRTL ? " 📦 اضافه فيديو والعنوان" : "📦 Add Vedio and Description"}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/adminToDashBoard/products"
              style={({ isActive }) => ({
                display: "block",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                textDecoration: "none",
                color: isActive ? "#1e293b" : "#fff",
                background: isActive ? "#facc15" : "transparent",
                fontWeight: isActive ? "bold" : "normal",
              })}
            >
              {isRTL ? "📦 المنتجات" : "📦 Products"}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/adminToDashBoard/AdsManager"
              style={({ isActive }) => ({
                display: "block",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                textDecoration: "none",
                color: isActive ? "#1e293b" : "#fff",
                background: isActive ? "#facc15" : "transparent",
                fontWeight: isActive ? "bold" : "normal",
              })}
            >
              {isRTL ? "📦 اداره الاعلانات " : "📦 AdsManager"}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/adminToDashBoard/logistics"
              style={({ isActive }) => ({
                display: "block",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                textDecoration: "none",
                color: isActive ? "#1e293b" : "#fff",
                background: isActive ? "#facc15" : "transparent",
                fontWeight: isActive ? "bold" : "normal",
              })}
            >
              {isRTL ? "📦  اداره الخدمات اللوجستية " : "📦 Logistics Services"}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/adminToDashBoard/service"
              style={({ isActive }) => ({
                display: "block",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                textDecoration: "none",
                color: isActive ? "#1e293b" : "#fff",
                background: isActive ? "#facc15" : "transparent",
                fontWeight: isActive ? "bold" : "normal",
              })}
            >
              {isRTL ? "📦  اداره الطاقة الإنتاجية " : "📦 Production Energy"}
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* محتوى الصفحات */}
      <div style={{ flex: 1, padding: "2rem", background: "#f8fafc" }}>
        <Routes>
          <Route path="/" element={<NewsPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="uploadvedio" element={<Uploadvedio />} />
          <Route path="adsManager" element={<AdsManager />} />
          <Route path="logistics" element={<Logistics />} />
          <Route path="service" element={<AdminServices />} />
        </Routes>
      </div>
    </div>
  );
}
