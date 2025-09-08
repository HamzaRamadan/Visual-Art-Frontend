import "./ServicesSection.css";
import { sectionTitles, servicesData } from "../../../utils/data";
import { useLanguageHook } from "../../../hooks/useLanguage";
import { useScrollAnimation } from "../../../hooks/useScrollAnimation";
import { Link } from "react-router-dom";

const ServicesSection = () => {
  const { language } = useLanguageHook();
  const isRTL = language === "ar";
  const services = servicesData[language];
  const productsRef = useScrollAnimation();

  return (
    <section
      className="services-section"
      ref={productsRef}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container">
        <h2 className="section-title">{sectionTitles[language]}</h2>
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="flip-card">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <div className="service-icon">
                      <img src={service.image} alt={service.title} />
                    </div>
                    <h3 className="service-title">{service.title}</h3>
                  </div>
                  <div className="flip-card-back">
                    <p className="service-description">{service.description}</p>
                    <Link
                      to={`/services/${service.id}`}
                      className="service-btn"
                    >
                      {language === "ar" ? "عرض التفاصيل" : "View Details"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
