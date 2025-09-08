import React, { useEffect, useRef, useState } from "react";

const StaticImage2 = () => {
  const bgRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [height, setHeight] = useState(getResponsiveHeight());
  const [width, setWidth] = useState(getResponsiveWidth());

  function getResponsiveHeight() {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768 ? "35vh" : "60vh";
    }
    return "60vh";
  }

  function getResponsiveWidth() {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768 ? "100%" : "90%";
    }
    return "90%";
  }

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current && bgRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const scrollTop = window.scrollY || window.pageYOffset;
        const elementOffsetTop = rect.top + scrollTop;
        const parallaxOffset = (scrollTop - elementOffsetTop) * 0.4;
        setOffset(parallaxOffset);
      }
    };

    const handleResize = () => {
      setHeight(getResponsiveHeight());
      setWidth(getResponsiveWidth());
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      style={{
        ...styles.container,
        height,
        paddingTop: "0px", // تقليل المسافات فوق
        paddingBottom: "0px", // تقليل المسافات تحت
      }}
    >
      <div
        ref={bgRef}
        style={{
          ...styles.background,
          width,
          transform: `translateX(-50%) translateY(${offset}px)`,
          boxShadow: "none", // إزالة أي شادو
          backgroundBlendMode: "normal", // لضمان وضوح الصورة
        }}
      />
      {/* محتوى اختياري */}
      {/* <div style={styles.content}>
        <h2 style={styles.title}>State-of-the-Art Printing Facility</h2>
        <p style={styles.subtitle}>Equipped with modern KBA offset technology</p>
      </div> */}
    </section>
  );
};

export default StaticImage2;

// 🎨 Styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: "relative",
    width: "100%",
    overflow: "hidden",
    transition: "height 0.3s ease",
  },
  background: {
    position: "absolute",
    top: 0,
    left: "50%",
    height: "100%",
    backgroundImage: 'url("/assets/images/KBA.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    willChange: "transform",
    transition: "transform 0.1s linear",
    boxShadow: "none",
    backgroundBlendMode: "normal",
  },
  content: {
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    color: "#fff",
    padding: "20px", // تقليل البادينج
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "10px",
    textShadow: "none", // إزالة أي شادو
  },
  subtitle: {
    fontSize: "1.2rem",
    fontWeight: "500",
    color: "#f39c12",
    textShadow: "none", // إزالة أي شادو
  },
};
