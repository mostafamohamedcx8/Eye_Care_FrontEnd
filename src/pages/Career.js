import Header from "../component/Header";
import NavBar from "../component/NavBar";
import { Link } from "react-router-dom";
import Footer from "../component/Footer";
import React from "react";
import { Container, Row } from "react-bootstrap";
import usePageData from "../Hooks/usePageData";
import { useTranslation } from "react-i18next";

const CareerSection = () => {
  const { i18n, t } = useTranslation();
  const pageId = i18n.language === "de" ? 102 : 100; // غير الـ IDs

  const { data, loading } = usePageData(pageId, []);
  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Row>
        <div className="hero-section">
          <div className="overlay hero-section">
            <div className="breadcrumb">
              <Link to="/" className="breadcrumb-link">
                {t("career.breadcrumb_home")}
              </Link>
              <span className="separator">/</span>
              <span className="active">{data?.career_title}</span>
            </div>
            <h1 className="title">{data?.career_title}</h1>
          </div>
        </div>
      </Row>

      <Container className="py-5">
        <h2>{data?.career_section_title}</h2>
        <p>{data?.career_paragraph_1}</p>
        <p>{data?.career_paragraph_2}</p>
        <h5>{data?.career_current_openings}</h5>
        <ul>
          <li>{data?.opening_1}</li>
          <li>{data?.opening_2}</li>
          <li>{data?.opening_3}</li>
          <li>{data?.opening_4}</li>
        </ul>
        <p>
          📧 {data?.contact_text}{" "}
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
