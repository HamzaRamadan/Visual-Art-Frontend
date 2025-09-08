// SectionTitle.tsx
import React from 'react';
import { useLanguageHook } from '../../hooks/useLanguage';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, centered = true }) => {
  const { language } = useLanguageHook();
  const isRTL = language === 'ar';

  return (
    <div className={`section-title-container ${centered ? 'centered' : ''} ${isRTL ? 'rtl' : 'ltr'}`}>
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
};

export default SectionTitle;
