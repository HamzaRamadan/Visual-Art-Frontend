import React, { useState, useEffect } from "react";
import { useLanguageHook } from "../hooks/useLanguage";

const Contact: React.FC = () => {
  const { language } = useLanguageHook();
  const isRTL = language === "ar";
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const styles: { [key: string]: React.CSSProperties } = {
    section: {
      backgroundColor: "#f9f9f9",
      padding: "3rem 1rem",
      direction: isRTL ? "rtl" : "ltr",
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      display: "flex",
      flexDirection:
        windowWidth < 768 ? "column" : isRTL ? "row-reverse" : "row",
      gap: "2rem",
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
      padding: "2rem",
      flex: "1 1 400px",
      minWidth: "300px",
      minHeight: "350px",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    heading: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "#4b0082",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      marginBottom: "1.5rem",
    },
    item: {
      marginBottom: "1rem",
    },
    label: {
      fontWeight: "bold",
      marginBottom: "0.25rem",
    },
    text: {
      color: "#333",
      fontSize: "1rem",
    },
    icon: {
      width: "20px",
      height: "20px",
      verticalAlign: "middle",
      marginInlineEnd: "0.5rem",
    },
    iframe: {
      width: "100%",
      height: "100%",
      border: "none",
      display: "block",
      borderRadius: "12px",
    },
  };

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        {/* 🧾 Contact Info Card */}
        <div style={styles.card}>
          <div style={styles.heading}>
            <img
              src="/assets/images/headset.svg"
              alt="Contact"
              style={styles.icon}
            />
            {isRTL ? "تواصل معنا" : "Contact Us"}
          </div>

          <div style={styles.item}>
            <div style={styles.label}>
              <img
                src="/assets/images/location.svg"
                alt="Location"
                style={styles.icon}
              />
              {isRTL ? "العنوان" : "Address"}
            </div>
            <div style={styles.text}>
              {isRTL
                ? "العراق، بغداد، الكرادة الخارجية"
                : "Iraq, Baghdad, Outer Karrada"}
            </div>
          </div>

          <div style={styles.item}>
            <div style={styles.label}>
              <img
                src="/assets/images/phone.svg"
                alt="Phone"
                style={styles.icon}
              />
              {isRTL ? "الهاتف" : "Phone"}
            </div>
          
            {/* <div style={{ ...styles.text, direction: "ltr", unicodeBidi: "bidi-override" }}>
  +964 782 450 0000
</div> */}
<div
  style={{
    ...styles.text,
    direction: "ltr", // نخلي الرقم من الشمال لليمين دايمًا
    unicodeBidi: "bidi-override",
    textAlign: isRTL ? "right" : "left", // يخلي مكان الرقم ثابت حسب اتجاه النص
  }}
>
  +964 782 450 0000
</div>

          </div>

          <div style={styles.item}>
            <div style={styles.label}>
              <img
                src="/assets/images/email.svg"
                alt="Email"
                style={styles.icon}
              />
              {isRTL ? "البريد الإلكتروني" : "Email"}
            </div>
            <div style={styles.text}>info@visualart-iraq.com</div>
          </div>
        </div>

        {/* 🗺️ Map Card */}
        <div style={{ ...styles.card, padding: 0 }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3335.0317643573844!2d44.44382857568429!3d33.29183197345271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzPCsDE3JzMwLjYiTiA0NMKwMjYnNDcuMSJF!5e0!3m2!1sen!2sjo!4v1751873356231!5m2!1sen!2sjo"
            allowFullScreen
            loading="lazy"
            title="Google Map"
            style={styles.iframe}
          />
        </div>
      </div>
    </section>
  );
};

export default Contact;