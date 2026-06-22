import Header from "../component/Header";
import NavBar from "../component/NavBar";
import { Link } from "react-router-dom";
import Footer from "../component/Footer";
import React from "react";
import { Container, Row } from "react-bootstrap";
import usePageData from "../Hooks/usePageData";
import { useTranslation } from "react-i18next";

const PrivacySection = () => {
  const { i18n, t } = useTranslation();
  const pageId = i18n.language === "de" ? 217 : 215; // غير الـ IDs

  const { data, loading } = usePageData(pageId, []);
  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Row>
        <div className="hero-section">
          <div className="overlay hero-section">
            <div className="breadcrumb">
              <Link to="/" className="breadcrumb-link">
                {t("privacy.breadcrumb_home")}
              </Link>
              <span className="separator">/</span>
              <span className="active">{data?.privacy_title}</span>
            </div>
            <h1 className="title">{data?.privacy_title}</h1>
          </div>
        </div>
      </Row>

      <Container className="py-5">
        <h2>{data?.privacy_section_title}</h2>
        <p>
          <strong>{data?.effective_date}</strong>
        </p>
        <p>
          <strong>{data?.last_updated}</strong>
        </p>
        <p>{data?.intro_1}</p>
        <p>{data?.intro_2}</p>

        <h5>{data?.section_1_title}</h5>
        <p>
          {data?.section_1_text}
          <br />
          Email:{" "}
          <a href="mailto:support@augenarzt.cloud">support@augenarzt.cloud</a>
        </p>

        <h5>{data?.section_2_title}</h5>
        <p>{data?.section_2_text}</p>
        <ul>
          <li>
            <strong>{data?.section_2_general}</strong>
          </li>
          <ul>
            {data?.section_2_general_list?.split("\n").map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <li>
            <strong>{data?.section_2_health}</strong>
          </li>
          <ul>
            {data?.section_2_health_list?.split("\n").map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </ul>
        <p>{data?.section_2_note}</p>

        <h5>{data?.section_3_title}</h5>
        <p>{data?.section_3_text}</p>
        <ul>
          {data?.section_3_list?.split("\n").map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <h5>{data?.section_4_title}</h5>
        <ul>
          {data?.section_4_list?.split("\n").map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <h5>{data?.section_5_title}</h5>
        <p>{data?.section_5_text}</p>
        <ul>
          {data?.section_5_list?.split("\n").map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <h5>{data?.section_6_title}</h5>
        <ul>
          {data?.section_6_list?.split("\n").map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <h5>{data?.section_7_title}</h5>
        <ul>
          {data?.section_7_list?.split("\n").map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <h5>{data?.section_8_title}</h5>
        <ul>
          {data?.section_8_list?.split("\n").map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <p>
          {data?.section_8_complaint}
          <a
            href="https://www.bfdi.bund.de"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.bfdi.bund.de
          </a>
        </p>

        <h5>{data?.section_9_title}</h5>
        <p>{data?.section_9_text}</p>

        <h5>{data?.section_10_title}</h5>
        <p>{data?.section_10_text}</p>

        <h5>{data?.section_11_title}</h5>
        <p>{data?.section_11_text}</p>

        <h5>{data?.section_12_title}</h5>
        <p>{data?.section_12_text}</p>

        <h5>{data?.section_13_title}</h5>
        <p>
          {data?.section_13_text}
          <a href="https://auge.cloud">https://auge.cloud</a>
        </p>

        <h5>{data?.section_14_title}</h5>
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
