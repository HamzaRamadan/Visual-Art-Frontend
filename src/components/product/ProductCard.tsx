import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';
import './productCard.css';
import { useLanguageHook } from '../../hooks/useLanguage';

interface ProductCardProps {
  product: Product & { mainId: string }; // mainId ده _id الأساسي
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const { language } = useLanguageHook();

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.img || `/assets/images/product-${index + 1}.jpg`}
          alt={product.title}
          className="product-image"
        />
        <div className="product-overlay">
          <Link to={`/products/${product.mainId}`} className="view-details-btn">
            {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
          </Link>
        </div>
      </div>
      <div className="product-content">
        <h3>{product.title}</h3>
        <p>{product.description.substring(0, 100)}...</p>
        <div className="product-features">
          {product.features.slice(0, 3).map((feature, idx) => (
            <div key={idx} className="feature-item">
              <i className="fas fa-check-circle"></i>
              <span>{feature}</span>
            </div>
          ))}
        </div>
        <Link to={`/products/${product.mainId}`} className="product-btn">
          {language === 'ar' ? 'تعلم المزيد' : 'Learn More'}
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
