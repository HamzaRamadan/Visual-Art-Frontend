import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguageHook } from "../../hooks/useLanguage";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import SectionTitle from "../layout/SectionTitle";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "../../../public/assets/styles/swiper.css";
import { API_BASE } from "../admin/api";

interface ProductLang {
  img: string;
  category: string;
  title: string;
  description: string;
  features: string[];
  _id: string | { $oid: string };
}

interface Product {
  _id: string | { $oid: string };
  ar: ProductLang[];
  en: ProductLang[];
}

// دالة لتحويل _id لأي شكل إلى string
const getIdString = (prod: Product | ProductLang): string => {
  if (!prod._id) return "";
  if (typeof prod._id === "string") return prod._id;
  if ("$oid" in prod._id) return prod._id.$oid;
  return "";
};

const Products: React.FC = () => {
  const { language } = useLanguageHook();
  const isRTL = language === "ar";
  const productsRef = useScrollAnimation();
  const [products, setProducts] = useState<(ProductLang & { mainId: string })[]>([]);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const [swiperKey, setSwiperKey] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/products`)
      .then((res) => res.json())
      .then((data: Product[]) => {
        const mapped = data
          .map((p) => {
            const langData = p[language]?.[0];
            if (!langData) return null;
            return {
              ...langData,
              mainId: getIdString(p),
            };
          })
          .filter(Boolean) as (ProductLang & { mainId: string })[];
        setProducts(mapped);
        setSwiperKey((prev) => prev + 1);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching products:", err);
        setLoading(false);
      });
  }, [language]);

  useEffect(() => {
    const updateSlidesPerView = () => {
      if (window.innerWidth >= 992) setSlidesPerView(3);
      else if (window.innerWidth >= 768) setSlidesPerView(2);
      else setSlidesPerView(1);
    };
    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);
    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, []);

  return (
    <section
      className="products section"
      ref={productsRef}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container">
        <SectionTitle title={language === "ar" ? "منتجاتنا" : "Our Products"} />

        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p>
              {language === "ar"
                ? "جارٍ تحميل المنتجات..."
                : "Loading products..."}
            </p>

            {/* ✅ CSS جوه نفس الملف كـ style */}
            <style>
              {`
                .spinner-container {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  padding: 2rem;
                }

                .spinner {
                  --spinner-size: 48px;
                  --spinner-color: #3498db;
                  --spinner-border: 4px;

                  border: var(--spinner-border) solid #f3f3f3;
                  border-top: var(--spinner-border) solid var(--spinner-color);
                  border-radius: 50%;
                  width: var(--spinner-size);
                  height: var(--spinner-size);
                  animation: spin 1s linear infinite;
                  margin-bottom: 1rem;
                }

                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        ) : products.length === 0 ? (
          <p className="no-products">
            {language === "ar" ? "لا توجد منتجات متاحة" : "No products available"}
          </p>
        ) : (
          <div className="products-slider-wrapper">
            <Swiper
              key={swiperKey}
              modules={[Navigation, Autoplay]}
              navigation={{
                nextEl: ".swiper-button-next-custom",
                prevEl: ".swiper-button-prev-custom",
              }}
              loop={products.length > 1}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              spaceBetween={20}
              slidesPerView={slidesPerView}
              dir={isRTL ? "rtl" : "ltr"}
              className="products-swiper"
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 10 },
                480: { slidesPerView: 1, spaceBetween: 15 },
                640: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 25 },
                992: { slidesPerView: 3, spaceBetween: 30 },
              }}
            >
              {products.map((product, index) => (
                <SwiperSlide key={product.mainId}>
                  <div className="product-card card">
                    <div className="product-image">
                      <img
                        src={
                          product.img || `/assets/images/product-${index + 1}.jpg`
                        }
                        alt={product.title}
                      />
                    </div>
                    <div className="product-content">
                      <h3>{product.title}</h3>
                      <Link to={`/products/${product.mainId}`} className="btn">
                        {language === "ar" ? "المزيد" : "Learn More"}
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="swiper-button-prev-custom"></div>
            <div className="swiper-button-next-custom"></div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
