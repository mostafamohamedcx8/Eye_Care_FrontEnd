import Header from "../component/Header";
import NavBar from "../component/NavBar";
import HeroSection from "../component/HeroSection";
import WelcomeSection from "../component/WelcomeSection";
import Footer from "../component/Footer";
import usePageData from "../Hooks/usePageData";
import { useTranslation } from "react-i18next";

import React from "react";

const Home = () => {
  const { i18n } = useTranslation();

  // حط الـ ID حسب اللغة
  const pageId = i18n.language === "de" ? 52 : 50; // 50 EN, 52 DE

  const { data, loading } = usePageData(pageId);

  if (loading) return <div>Loading...</div>;
  return (
    <div className="color-body">
      <Header />
      <NavBar />
      <HeroSection data={data} />
      <WelcomeSection data={data} />
      {/* <AppPromotionSection /> */}
      <Footer />
    </div>
  );
};

export default Home;
