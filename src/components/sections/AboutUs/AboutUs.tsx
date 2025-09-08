import React from "react";
import { useLanguage } from "../../../context/LanguageContext";
import { aboutTranslations } from "../../../utils/aboutTranslations";
import SectionTitle from "../../layout/SectionTitle";
import "./AboutUs.css";
import { Link } from "react-router-dom";

const AboutUs: React.FC = () => {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const t = (key: string): string => {
    return (
      aboutTranslations[language as keyof typeof aboutTranslations][
        key as keyof typeof aboutTranslations.en
      ] || key
    );
  };

  return (
    <section className="about-section" id="about" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container">
        <SectionTitle title={t("aboutTitle")} />

        <div className="about-content">
          <div className="about-text">
            <p>{t("aboutContent")}</p>
            <div className="about-read-more">
              <div className="about-read-more">
                <Link to="/AboutDetailes" className="btn btn-primary">
                  {t("readMore")}
                </Link>
              </div>
            </div>
          </div>

          <div className="about-vision-mission">
            <div className="vision-mission-card">
              <h3>{t("ourVision")}</h3>
              <p>{t("vision")}</p>
            </div>

            <div className="vision-mission-card">
              <h3>{t("ourMission")}</h3>
              <p>{t("mission")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
