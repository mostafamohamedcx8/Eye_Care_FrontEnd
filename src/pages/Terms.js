import Header from "../component/Header";
import NavBar from "../component/NavBar";
import { Link } from "react-router-dom";
import Footer from "../component/Footer";
import React from "react";
import { Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";

const TermsSection = () => {
  const { t } = useTranslation();

  return (
    <>
      {/* Hero Section */}
      <Row>
        <div className="hero-section">
          <div className="overlay hero-section">
            <div className="breadcrumb">
              <Link to="/" className="breadcrumb-link">
                {t("terms.breadcrumb_home")}
              </Link>
              <span className="separator">/</span>
              <span className="active">{t("terms.breadcrumb_terms")}</span>
            </div>
            <h1 className="title">{t("terms.title")}</h1>
          </div>
        </div>
      </Row>

      {/* Content Section */}
      <Container className="py-5">
        <h2>{t("terms.section_title")}</h2>
        <p>
          <strong>{t("terms.effective_date")}</strong>
        </p>
        <p>
          <strong>{t("terms.last_updated")}</strong>
        </p>

        <p>
          <Trans
            i18nKey="terms.intro"
            components={{
              0: <strong />,
              1: <a href="https://auge.cloud" />,
            }}
          />
        </p>

        <h5>{t("terms.section_1_title")}</h5>
        <ul>
          {t("terms.section_1_list", { returnObjects: true }).map(
            (item, index) => (
              <li key={index}>{item}</li>
            )
          )}
        </ul>
        <p>{t("terms.section_1_text")}</p>

        <h5>{t("terms.section_2_title")}</h5>
        <p>{t("terms.section_2_text")}</p>

        <h5>{t("terms.section_3_title")}</h5>
        <ul>
          {t("terms.section_3_list", { returnObjects: true }).map(
            (item, index) => (
              <li key={index}>{item}</li>
            )
          )}
        </ul>

        <h5>{t("terms.section_4_title")}</h5>
        <p>
          <Trans
            i18nKey="terms.section_4_text"
            components={{
              0: <Link to="/privacy" />,
            }}
          />
        </p>

        <h5>{t("terms.section_5_title")}</h5>
        <p>
          <Trans
            i18nKey="terms.section_5_text"
            components={{
              0: <strong />,
            }}
          />
        </p>

        <h5>{t("terms.section_6_title")}</h5>
        <ul>
          {t("terms.section_6_list", { returnObjects: true }).map(
            (item, index) => (
              <li key={index}>{item}</li>
            )
          )}
        </ul>
        <p>{t("terms.section_6_text")}</p>

        <h5>{t("terms.section_7_title")}</h5>
        <p>
          <Trans
            i18nKey="terms.section_7_text"
            components={{
              0: <a href="https://auge.cloud" />,
            }}
          />
        </p>

        <h5>{t("terms.section_8_title")}</h5>
        <p>{t("terms.section_8_text")}</p>

        <h5>{t("terms.section_9_title")}</h5>
        <p>{t("terms.section_9_text")}</p>

        <h5>{t("terms.section_10_title")}</h5>
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
