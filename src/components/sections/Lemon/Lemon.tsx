import React from "react";
import lemonImg from "/assets/images/lemon.png";
import "./Lemon.css";
import SectionTitle from "../../layout/SectionTitle";
import { useLanguageHook } from "../../../hooks/useLanguage";

const Lemon: React.FC = () => {
  const { language } = useLanguageHook();
  const isRTL = language === 'ar';

  return (
    <div className={`news-page ${isRTL ? 'rtl' : 'ltr'}`}>
        <SectionTitle title={language === 'ar' ? 'تواصل معنا' : 'Contact Us'} centered={true} />
      <section className="lemon-container">
        {/* العنوان داخل السكشن */}

        <img src={lemonImg} alt="Lemon" className="lemon-image" />
      </section>
    </div>
  );
};

export default Lemon;
