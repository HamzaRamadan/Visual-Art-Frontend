import React from "react";
import { useLanguageHook } from "../../../hooks/useLanguage";
import { useScrollAnimation } from "../../../hooks/useScrollAnimation";
import "./HeroSection.css"; 

const HeroSection: React.FC = () => {
  const { language } = useLanguageHook();
  const isRTL = language === "ar";
  const heroRef = useScrollAnimation();

  return (
    <section
      className="hero"
      id="heroSection"
      ref={heroRef}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="hero-background">
        <video autoPlay muted loop playsInline>
          <source src="/assets/videos/hero.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
};

export default HeroSection;
