import Header from "../component/Header";
import NavBar from "../component/NavBar";
import { Link } from "react-router-dom";
import Footer from "../component/Footer";
import React from "react";
import { Container, Row } from "react-bootstrap";
import usePageData from "../Hooks/usePageData";
import { useTranslation } from "react-i18next";

const AboutSection = () => {
  const { t, i18n } = useTranslation();
  const pageId = i18n.language === "de" ? 81 : 79;

  const { data, loading } = usePageData(pageId, []);
  console.log("About data:", data);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Row>
        <div className="hero-section">
          <div className="overlay hero-section">
            <div className="breadcrumb">
              <Link to="/" className="breadcrumb-link">
                {t("about.breadcrumb_home")}
              </Link>
              <span className="separator">/</span>
              <span className="active">{t("about.breadcrumb_about")}</span>
            </div>
            <h1 className="title">{data?.about_title}</h1>
          </div>
        </div>
      </Row>

      <Container className="about-content text-center py-5">
        <h2 className="section-title mb-4">{data?.about_section_title}</h2>
        <p className="section-paragraph mx-auto">
          {data?.about_section_paragraph}
        </p>
      </Container>
    </>
  );
};
const About = () => {
  return (
    <div className="color-body">
      <Header />
      <NavBar />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default About;
