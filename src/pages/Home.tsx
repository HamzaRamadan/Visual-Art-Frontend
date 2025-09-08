import React from "react";
import HeroSection from "../components/layout/HeroSection/HeroSection";
import AboutUs from "../components/sections/AboutUs/AboutUs";
import ServicesSection from "../components/sections/ServicesSection/ServicesSection";
import Products from "../components/sections/Products";
import ProductionCapacity from "../components/sections/ProductionCapacity/ProductionCapacity";
import Logistics from "../components/sections/Logistics/Logistics";
import StaticImage from "../components/layout/StaticImage/StaticImage";
import StaticImage2 from "../components/layout/StaticImage2/StaticImage2";
import Contact from "./Contact";
import Zepra from "../components/sections/Zepra/Zepra";
import News from "./News/News";
import Lemon from "../components/sections/Lemon/Lemon";

const Home: React.FC = () => {
  return (
    <>
      <HeroSection />
      <AboutUs />
      <StaticImage2 />
      <Products />
      <StaticImage />
      <ServicesSection />
      <Zepra />
      <ProductionCapacity />
      <Logistics />
      <News />
      <Lemon />
      <Contact />
      
    </>
  );
};

export default Home;
