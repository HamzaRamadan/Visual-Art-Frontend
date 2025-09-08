import { useLanguage } from '../context/LanguageContext';

export const useLanguageHook = () => {
  const { language, toggleLanguage } = useLanguage();
  
  return { language, toggleLanguage };
};