import React from 'react';
import { useLanguageHook } from '../../hooks/useLanguage';
import { companyData } from '../../utils/data';

const ContactCard: React.FC = () => {
  const { language } = useLanguageHook();
  const isRTL = language === 'ar';
  const contact = companyData[language].contact;

  return (
    <div className="contact-card" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="card">
        <div className="card-header">
          <h3>{language === 'ar' ? 'معلومات الاتصال' : 'Contact Information'}</h3>
        </div>
        
        <div className="card-body">
          <div className="contact-item">
            <i className="fas fa-map-marker-alt"></i>
            <span>{contact.address}</span>
          </div>
          
          <div className="contact-item">
            <i className="fas fa-phone"></i>
            <span>{contact.phone}</span>
          </div>
          
          <div className="contact-item">
            <i className="fas fa-envelope"></i>
            <span>{contact.email}</span>
          </div>
          
          <div className="contact-item">
            <i className="fas fa-globe"></i>
            <span>{contact.website}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;