import Header from "../component/Header";
import NavBar from "../component/NavBar";
import { Link } from "react-router-dom";
import Footer from "../component/Footer";
import React from "react";
import { Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const CareerSection = () => {
  const { t } = useTranslation();
  return (
    <>
      {/* Hero Section */}
      <Row>
        <div className="hero-section">
          <div className="overlay hero-section">
            <div className="breadcrumb">
              <Link to="/" className="breadcrumb-link">
                {t("career.breadcrumb_home")}
              </Link>
              <span className="separator">/</span>
              <span className="active">{t("career.breadcrumb_career")}</span>
            </div>
            <h1 className="title">{t("career.title")}</h1>
          </div>
        </div>
      </Row>

      {/* Content Section */}
      <Container className="py-5">
        <h2>{t("career.section_title")}</h2>
        <p>{t("career.paragraph_1")}</p>
        <p>{t("career.paragraph_2")}</p>
        <h5>{t("career.current_openings")}</h5>
        <ul>
          <li>{t("career.opening_1")}</li>
          <li>{t("career.opening_2")}</li>
          <li>{t("career.opening_3")}</li>
          <li>{t("career.opening_4")}</li>
        </ul>
        <p>
          📧 {t("career.contact")}{" "}
          <a href="mailto:jobs@augenarzt.cloud">jobs@augenarzt.cloud</a>
        </p>
      </Container>
    </>
  );
};
const Career = () => {
  return (
    <div className="color-body">
      <Header />
      <NavBar />
      <CareerSection />
      <Footer />
    </div>
  );
};

export default Career;
