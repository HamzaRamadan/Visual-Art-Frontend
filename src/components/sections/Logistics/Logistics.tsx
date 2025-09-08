import React, { useEffect, useState } from "react";
import "./logistics.css";
import { useLanguageHook } from "../../../hooks/useLanguage";
import { useScrollAnimation } from "../../../hooks/useScrollAnimation";
import SectionTitle from "../../layout/SectionTitle";
import { API_BASE } from "../../admin/api";

// =========================
// Types
// =========================
interface LogisticsItem {
  _id: string;
  title: string;
  description: string;
  features: string[];
  stats?: {
    warehouses: number;
    trucks: number;
    accuracy: number;
  };
}

const Logistics: React.FC = () => {
  const { language } = useLanguageHook();
  const isRTL = language === "ar";
  const logisticsRef = useScrollAnimation();

  const [data, setData] = useState<LogisticsItem | null>(null);
  const [stats, setStats] = useState({
    warehouses: 0,
    trucks: 0,
    accuracy: 0,
  });

  // ✅ Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE}/logistics`);
        const raw = await res.json();

        if (Array.isArray(raw) && raw.length > 0) {
          const item = raw[0];
          const normalized: LogisticsItem = {
            _id: item._id,
            title:
              item?.[language]?.title ||
              item?.title?.[language] ||
              item?.title ||
              "",
            description:
              item?.[language]?.description ||
              item?.description?.[language] ||
              item?.description ||
              "",
            features:
              item?.[language]?.features ||
              item?.features?.[language] ||
              item?.features ||
              [],
            stats: item.stats || { warehouses: 0, trucks: 0, accuracy: 0 },
          };

          setData(normalized);
        } else {
          setData(null);
        }
      } catch (err) {
        console.error("Error fetching logistics:", err);
      }
    };

    fetchData();
  }, [language]);

  // ✅ Animate numbers
  useEffect(() => {
    if (!data?.stats) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          animateNumbers(data.stats!);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    if (logisticsRef.current) {
      observer.observe(logisticsRef.current);
    }

    return () => observer.disconnect();
  }, [data, logisticsRef]);

  const animateNumbers = (targetStats: {
    warehouses: number;
    trucks: number;
    accuracy: number;
  }) => {
    animateValue("warehouses", 0, targetStats.warehouses, 1500);
    animateValue("trucks", 0, targetStats.trucks, 2000);
    animateValue("accuracy", 0, targetStats.accuracy, 1800);
  };

  const animateValue = (
    key: keyof typeof stats,
    start: number,
    end: number,
    duration: number
  ) => {
    let startTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      setStats((prev) => ({
        ...prev,
        [key]: Math.floor(progress * (end - start) + start),
      }));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  return (
    <section
      className="logistics-section"
      ref={logisticsRef}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="logistics-container">
        <SectionTitle
          title={isRTL ? "الخدمات اللوجستية والتخزين" : "Logistics and Warehousing"}
        />

        {!data ? (
          <p className="text-center text-gray-500 mt-4">
            {isRTL ? "لا يوجد خدمات لوجستية" : "No logistics services available"}
          </p>
        ) : (
          <div className="logistics-content">
            <div className="logistics-text">
              <p>{data.description}</p>
            </div>

            <div className="logistics-features">
              <ul>
                {data.features.map((feature, index) => (
                  <li key={index}>
                    <i className="fas fa-warehouse" aria-hidden="true"></i>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="logistics-stats">
              <div className="logistics-stat-card">
                <div className="stat-number">{stats.warehouses}+</div>
                <div className="stat-label">
                  {language === "ar" ? "مخازن نشطة" : "Active Warehouses"}
                </div>
              </div>

              <div className="logistics-stat-card">
                <div className="stat-number">{stats.trucks}+</div>
                <div className="stat-label">
                  {language === "ar" ? "شاحنات يومياً" : "Daily Trucks"}
                </div>
              </div>

              <div className="logistics-stat-card">
                <div className="stat-number">{stats.accuracy}%</div>
                <div className="stat-label">
                  {language === "ar" ? "دقة التسليم" : "Delivery Accuracy"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Logistics;
