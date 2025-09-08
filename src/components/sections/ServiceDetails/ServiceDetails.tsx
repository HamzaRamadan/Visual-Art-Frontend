import { useParams } from "react-router-dom";
import { servicesData } from "../../../utils/data";
import { useLanguageHook } from "../../../hooks/useLanguage";
import { useState } from "react";
import "./ServiceDetails.css"; 

const ServiceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguageHook();
  const service = servicesData[language].find((s) => s.id.toString() === id);

  const [currentIndex, setCurrentIndex] = useState(0);

  if (!service) {
    return <h2>Service not found</h2>;
  }

  return (
    <div className="service-details-container">
      <h1 className="service-details-title">{service.title}</h1>

      {/* الصورة الرئيسية */}
      <div className="main-image-container">
        <img
          src={service.images[currentIndex]}
          alt={service.title}
          className="main-image"
        />
      </div>

      {/* الصور الصغيرة (Thumbnails) */}
      <div className="thumbnails-container">
        {service.images.slice(0, 3).map((img, index) => (
          <div
            key={index}
            className={`thumbnail-box ${
              index === currentIndex ? "active" : ""
            }`}
            onClick={() => setCurrentIndex(index)}
          >
            <img
              src={img}
              alt={`Thumbnail ${index + 1}`}
              className="thumbnail-img"
            />
          </div>
        ))}
      </div>

      <p className="service-description">{service.description}</p>
      <p className="service-details-text">{service.details}</p>
    </div>
  );
};

export default ServiceDetails;
