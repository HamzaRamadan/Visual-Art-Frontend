import React from 'react';
import { useLanguageHook } from '../../hooks/useLanguage';

const LanguageSwitcher: React.FC = () => {
  const { language, toggleLanguage } = useLanguageHook();

  return (
    <button 
      className="language-switcher" 
      onClick={toggleLanguage}
      aria-label="Switch language"
    >
      {language === 'ar' ? 'EN' : 'AR'}
    </button>
  );
};

export default LanguageSwitcher;