import Header from "../component/Header";
import NavBar from "../component/NavBar";
import { Link } from "react-router-dom";
import Footer from "../component/Footer";
import React from "react";
import { Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const PrivacySection = () => {
  const { t } = useTranslation();
  return (
    <>
      {/* Hero Section */}
      <Row>
        <div className="hero-section">
          <div className="overlay hero-section">
            <div className="breadcrumb">
              <Link to="/" className="breadcrumb-link">
                {t("privacy.breadcrumb_home")}
              </Link>
              <span className="separator">/</span>
              <span className="active">{t("privacy.breadcrumb_privacy")}</span>
            </div>
            <h1 className="title">{t("privacy.title")}</h1>
          </div>
        </div>
      </Row>

      {/* Content Section */}
      <Container className="py-5">
        <h2>{t("privacy.section_title")}</h2>
        <p>
          <strong>{t("privacy.effective_date")}</strong>
        </p>
        <p>
          <strong>{t("privacy.last_updated")}</strong>
        </p>

        <p>
          {t("privacy.intro_1").split("auge.cloud")[0]}
          <strong>auge.cloud</strong>
          {t("privacy.intro_1").split("auge.cloud")[1]}
        </p>

        <p>
          {t("privacy.intro_2").split("https://auge.cloud")[0]}
          <a href="https://auge.cloud">https://auge.cloud</a>
          {t("privacy.intro_2").split("https://auge.cloud")[1]}
        </p>

        <h5>{t("privacy.section_1_title")}</h5>
        <p>
          {t("privacy.section_1_text").split("auge.cloud")[0]}
          <strong>auge.cloud</strong>
          <br />
          Email:{" "}
          <a href="mailto:support@augenarzt.cloud">support@augenarzt.cloud</a>
        </p>

        <h5>{t("privacy.section_2_title")}</h5>
        <p>{t("privacy.section_2_text")}</p>
        <ul>
          <li>
            <strong>{t("privacy.section_2_general")}</strong>
          </li>
          <ul>
            {t("privacy.section_2_general_list", { returnObjects: true }).map(
              (item, index) => (
                <li key={index}>{item}</li>
              )
            )}
          </ul>
          <li>
            <strong>{t("privacy.section_2_health")}</strong>
          </li>
          <ul>
            {t("privacy.section_2_health_list", { returnObjects: true }).map(
              (item, index) => (
                <li key={index}>{item}</li>
              )
            )}
          </ul>
        </ul>
        <p>{t("privacy.section_2_note")}</p>

        <h5>{t("privacy.section_3_title")}</h5>
        <p>{t("privacy.section_3_text")}</p>
        <ul>
          {t("privacy.section_3_list", { returnObjects: true }).map(
            (item, index) => (
              <li key={index}>{item}</li>
            )
          )}
        </ul>

        <h5>{t("privacy.section_4_title")}</h5>
        <ul>
          {t("privacy.section_4_list", { returnObjects: true }).map(
            (item, index) => (
              <li key={index}>{item}</li>
            )
          )}
        </ul>

        <h5>{t("privacy.section_5_title")}</h5>
        <p>{t("privacy.section_5_text")}</p>
        <ul>
          {t("privacy.section_5_list", { returnObjects: true }).map(
            (item, index) => (
              <li key={index}>{item}</li>
            )
          )}
        </ul>

        <h5>{t("privacy.section_6_title")}</h5>
        <ul>
          {t("privacy.section_6_list", { returnObjects: true }).map(
            (item, index) => (
              <li key={index}>{item}</li>
            )
          )}
        </ul>

        <h5>{t("privacy.section_7_title")}</h5>
        <ul>
          {t("privacy.section_7_list", { returnObjects: true }).map(
            (item, index) => (
              <li key={index}>{item}</li>
            )
          )}
        </ul>

        <h5>{t("privacy.section_8_title")}</h5>
        <ul>
          {t("privacy.section_8_list", { returnObjects: true }).map(
            (item, index) => (
              <li key={index}>{item}</li>
            )
          )}
        </ul>
        <p>
          {
            t("privacy.section_8_complaint").split(
              "https://www.bfdi.bund.de"
            )[0]
          }
          <a
            href="https://www.bfdi.bund.de"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.bfdi.bund.de
          </a>
        </p>

        <h5>{t("privacy.section_9_title")}</h5>
        <p>{t("privacy.section_9_text")}</p>

        <h5>{t("privacy.section_10_title")}</h5>
        <p>{t("privacy.section_10_text")}</p>

        <h5>{t("privacy.section_11_title")}</h5>
        <p>{t("privacy.section_11_text")}</p>

        <h5>{t("privacy.section_12_title")}</h5>
        <p>{t("privacy.section_12_text")}</p>

        <h5>{t("privacy.section_13_title")}</h5>
        <p>
          {t("privacy.section_13_text").split("https://auge.cloud")[0]}
          <a href="https://auge.cloud">https://auge.cloud</a>
          {t("privacy.section_13_text").split("https://auge.cloud")[1]}
        </p>

        <h5>{t("privacy.section_14_title")}</h5>
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
const Privacy = () => {
  return (
    <div className="color-body">
      <Header />
      <NavBar />
      <PrivacySection />
      <Footer />
    </div>
  );
};

export default Privacy;
