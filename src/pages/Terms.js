import Header from "../component/Header";
import NavBar from "../component/NavBar";
import { Link } from "react-router-dom";
import Footer from "../component/Footer";
import React from "react";
import { Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import usePageData from "../Hooks/usePageData";

const TermsSection = () => {
  const { t, i18n } = useTranslation();
  const pageId = i18n.language === "de" ? 163 : 161; // غير الـ IDs

  const { data, loading } = usePageData(pageId, []);
  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Row>
        <div className="hero-section">
          <div className="overlay hero-section">
            <div className="breadcrumb">
              <Link to="/" className="breadcrumb-link">
                {t("terms.breadcrumb_home")}
              </Link>
              <span className="separator">/</span>
              <span className="active">{data?.terms_title}</span>
            </div>
            <h1 className="title">{data?.terms_title}</h1>
          </div>
        </div>
      </Row>

      <Container className="py-5">
        <h2>{data?.terms_section_title}</h2>
        <p>
          <strong>{data?.effective_date}</strong>
        </p>
        <p>
          <strong>{data?.last_updated}</strong>
        </p>
        <p>{data?.intro_text}</p>

        <h5>{data?.section_1_title}</h5>
        <ul>
          {data?.section_1_list?.split("\n").map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <p>{data?.section_1_text}</p>

        <h5>{data?.section_2_title}</h5>
        <p>{data?.section_2_text}</p>

        <h5>{data?.section_3_title}</h5>
        <ul>
          {data?.section_3_list?.split("\n").map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <h5>{data?.section_4_title}</h5>
        <p>{data?.section_4_text}</p>

        <h5>{data?.section_5_title}</h5>
        <p>{data?.section_5_text}</p>

        <h5>{data?.section_6_title}</h5>
        <ul>
          {data?.section_6_list?.split("\n").map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <p>{data?.section_6_text}</p>

        <h5>{data?.section_7_title}</h5>
        <p>{data?.section_7_text}</p>

        <h5>{data?.section_8_title}</h5>
        <p>{data?.section_8_text}</p>

        <h5>{data?.section_9_title}</h5>
        <p>{data?.section_9_text}</p>

        <h5>{data?.section_10_title}</h5>
        <p>
          Email:{" "}
          <a href="mailto:support@augenarzt.cloud">support@augenarzt.cloud</a>
          <br />
          Website: <a href="https://auge.cloud">auge.cloud</a>
        </p>
      </Container>
    </>
  );
};
const Terms = () => {
  return (
    <div className="color-body">
      <Header />
      <NavBar />
      <TermsSection />
      <Footer />
    </div>
  );
};

export default Terms;
