import React, { useEffect, useState } from "react";
import "./productionCapacity.css";
import { useLanguageHook } from "../../../hooks/useLanguage";
import { useScrollAnimation } from "../../../hooks/useScrollAnimation";
import SectionTitle from "../../layout/SectionTitle";
import { API_BASE } from "../../admin/api";

// =========================
// Types
// =========================
interface CapacityItem {
  _id: string;
  title: string;
  description: string;
  features: string[];
  stats?: {
    projects: number;
    clients: number;
    satisfaction: number;
  };
}

const ProductionCapacity: React.FC = () => {
  const { language } = useLanguageHook();
  const isRTL = language === "ar";
  const capacityRef = useScrollAnimation();

  const [data, setData] = useState<CapacityItem | null>(null);

  const [stats, setStats] = useState({
    projects: 0,
    clients: 0,
    satisfaction: 0,
  });

  // ✅ Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE}/services`);
        const raw = await res.json();

        if (Array.isArray(raw) && raw.length > 0) {
          const item = raw[0];
          const normalized: CapacityItem = {
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
            stats: item.stats || { projects: 0, clients: 0, satisfaction: 0 },
          };

          setData(normalized);
        } else {
          setData(null);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
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

    if (capacityRef.current) {
      observer.observe(capacityRef.current);
    }

    return () => observer.disconnect();
  }, [data, capacityRef]);

  const animateNumbers = (targetStats: {
    projects: number;
    clients: number;
    satisfaction: number;
  }) => {
    animateValue("projects", 0, targetStats.projects, 1500);
    animateValue("clients", 0, targetStats.clients, 2000);
    animateValue("satisfaction", 0, targetStats.satisfaction, 1800);
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
      className="production-capacity-section"
      ref={capacityRef}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="production-capacity-container">
        <SectionTitle
          title={isRTL ? "الطاقة الإنتاجية" : "Production Capacity"}
        />

        {!data ? (
          <p className="text-center text-gray-500 mt-4">
            {isRTL ? "لا يوجد بيانات متاحة" : "No production capacity data"}
          </p>
        ) : (
          <div className="production-capacity-content">
            <div className="production-capacity-text">
              <p>{data.description}</p>
            </div>

            <div className="production-capacity-features">
              <ul>
                {data.features.map((feature, index) => (
                  <li key={index}>
                    <i className="fas fa-check-circle"></i>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="production-capacity-stats">
              <div className="production-capacity-stat-card">
                <div className="stat-number">{stats.projects}+</div>
                <div className="stat-label">
                  {language === "ar" ? "مشروع" : "Projects"}
                </div>
              </div>

              <div className="production-capacity-stat-card">
                <div className="stat-number">{stats.clients}+</div>
                <div className="stat-label">
                  {language === "ar" ? "عميل" : "Clients"}
                </div>
              </div>

              <div className="production-capacity-stat-card">
                <div className="stat-number">{stats.satisfaction}%</div>
                <div className="stat-label">
                  {language === "ar" ? "نسبة رضا" : "Satisfaction"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductionCapacity;
