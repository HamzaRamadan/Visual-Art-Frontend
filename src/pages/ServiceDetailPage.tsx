import React from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguageHook } from "../hooks/useLanguage";
import { servicesData } from "../utils/data";
import SectionTitle from "../components/layout/SectionTitle";

const ServiceDetailPage: React.FC = () => {
  const { language } = useLanguageHook();
  const isRTL = language === "ar";
  const { id } = useParams<{ id: string }>();

  const services = servicesData[language];
  const service = services.find((s) => s.id.toString() === id);

  if (!service) {
    return (
      <div className="container" dir={isRTL ? "rtl" : "ltr"}>
        <SectionTitle title={language === "ar" ? "الخدمة غير موجودة" : "Service Not Found"} />
        <p>
          {language === "ar"
            ? "عذراً، الخدمة التي تبحث عنها غير موجودة."
            : "Sorry, the service you are looking for does not exist."}
        </p>
      </div>
    );
  }

  return (
    <div className="page service-detail-page" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container">
        <SectionTitle title={service.title} />

        <div className="service-detail-content">
          <div className="service-detail-image">
            <img src={service.image} alt={service.title} className="main-image" />
          </div>

          <div className="service-detail-info">
            <h2>{language === "ar" ? "وصف الخدمة" : "Service Description"}</h2>
            <p>{service.description}</p>
          </div>
        </div>

        <div className="related-services">
          <SectionTitle title={language === "ar" ? "خدمات ذات صلة" : "Related Services"} />
          <div className="grid grid-3">
            {services
              .filter((s) => s.id.toString() !== id)
              .slice(0, 3)
              .map((relatedService) => (
                <div className="related-service-card card" key={relatedService.id}>
                  <div className="service-image">
                    <img src={relatedService.image} alt={relatedService.title} />
                  </div>
                  <div className="service-content">
                    <h3>{relatedService.title}</h3>
                    <p>{relatedService.description.substring(0, 100)}...</p>
                    <Link to={`/services/${relatedService.id}`} className="btn">
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
};

export default ServiceDetailPage;
