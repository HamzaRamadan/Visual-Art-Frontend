import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguageHook } from "../../hooks/useLanguage";
import SectionTitle from "../../components/layout/SectionTitle";
import "./ProductDetail.css";
import { API_BASE } from "../../components/admin/api";

interface ProductLang {
  img: string;
  imgList?: string[];
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

const getIdString = (prod: Product | ProductLang): string => {
  if (!prod._id) return "";
  if (typeof prod._id === "string") return prod._id;
  if ("$oid" in prod._id) return prod._id.$oid;
  return "";
};

export default function ProductDetailPage() {
  const { language } = useLanguageHook();
  const isRTL = language === "ar";
  const { id } = useParams<{ id: string }>();

  const [productData, setProductData] = useState<Product | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true); // ✅ حالة تحميل

  // تحميل جميع المنتجات
  useEffect(() => {
    fetch(`${API_BASE}/products`)
      .then((res) => res.json())
      .then((data) => setAllProducts(data))
      .catch((err) => console.error("❌ Error fetching products:", err));
  }, []);

  // تحميل المنتج الحالي
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true); // ✅ يبدأ تحميل
        const res = await fetch(`${API_BASE}/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProductData(data);
        setCurrentImage(0);
      } catch (err) {
        console.error("❌ Error fetching product:", err);
        setProductData(null);
      } finally {
        setLoading(false); // ✅ ينتهي تحميل
      }
    };

    fetchProduct();
  }, [id, language]);

  // ✅ لو لسه بيحمل
  if (loading) {
    return (
      <div className="container flex justify-center items-center min-h-[50vh]">
        <div className="loader"></div> {/* spinner */}
      </div>
    );
  }

  // ✅ لو المنتج مش موجود بعد التحميل
  if (!productData) {
    return (
      <div className="container" dir={isRTL ? "rtl" : "ltr"}>
        <SectionTitle
          title={language === "ar" ? "المنتج غير موجود" : "Product Not Found"}
        />
        <p>
          {language === "ar"
            ? "عذراً، المنتج الذي تبحث عنه غير موجود."
            : "Sorry, the product you are looking for does not exist."}
        </p>
      </div>
    );
  }

  const product = productData[language]?.[0];
  if (!product) return null;

  const displayImages: string[] =
    product.imgList && product.imgList.length > 0 ? product.imgList : [product.img];

  const relatedProducts = allProducts
    .filter((p) => getIdString(p) !== getIdString(productData))
    .map((p) => {
      const langProd = p[language]?.[0];
      if (!langProd) return null;
      return { ...langProd, _id: getIdString(p) };
    })
    .filter(Boolean) as ProductLang[];

  return (
    <div
      key={getIdString(product)}
      className="page product-detail-page"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container">
        <SectionTitle title={product.title} />

        <div className="product-detail-content">
          <div className="product-detail-image">
            <div className="main-image-container">
              <img
                src={displayImages[currentImage]}
                alt={product.title}
                className="main-image"
              />
            </div>

            <div className="image-thumbnails">
              {displayImages.map((img: string, index: number) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index}`}
                  onClick={() => setCurrentImage(index)}
                  className={`thumbnail ${
                    currentImage === index ? "active" : ""
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="product-detail-info">
            <h2>{language === "ar" ? "وصف المنتج" : "Product Description"}</h2>
            <p>{product.description}</p>
            <h3>{language === "ar" ? "المميزات" : "Features"}</h3>
            <ul className="product-features">
              {product.features.map((feature: string, index: number) => (
                <li key={index}>
                  <div className="icon">
                    <i className="fas fa-check"></i>
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="related-products">
          <SectionTitle
            title={language === "ar" ? "منتجات ذات صلة" : "Related Products"}
          />
          <div className="grid grid-3">
            {relatedProducts.slice(0, 3).map((relatedProduct, index) => (
              <div className="related-product-card card" key={index}>
                <div className="product-image">
                  <img src={relatedProduct.img} alt={relatedProduct.title} />
                </div>
                <div className="product-content">
                  <h3>{relatedProduct.title}</h3>
                  <p>
                    {relatedProduct.description?.substring(0, 100) ||
                      (language === "ar"
                        ? "لا يوجد وصف متاح."
                        : "No description available.")}
                  </p>
                  <Link
                    to={`/products/${relatedProduct._id}`}
                    className="btn"
                  >
                    {language === "ar" ? "عرض التفاصيل" : "View Details"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
