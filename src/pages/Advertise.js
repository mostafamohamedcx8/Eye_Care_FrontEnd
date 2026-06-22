import Header from "../component/Header";
import NavBar from "../component/NavBar";
import { Link } from "react-router-dom";
import Footer from "../component/Footer";
import React from "react";
import { Container, Row } from "react-bootstrap";
import usePageData from "../Hooks/usePageData";
import { useTranslation } from "react-i18next";

const AdvertiseSection = () => {
  const { i18n, t } = useTranslation();
  const pageId = i18n.language === "de" ? 229 : 227; // غير الـ IDs

  const { data, loading } = usePageData(pageId, []);
  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Row>
        <div className="hero-section">
          <div className="overlay hero-section">
            <div className="breadcrumb">
              <Link to="/" className="breadcrumb-link">
                {t("advertise.breadcrumb_home")}
              </Link>
              <span className="separator">/</span>
              <span className="active">{data?.advertise_title}</span>
            </div>
            <h1 className="title">{data?.advertise_title}</h1>
          </div>
        </div>
      </Row>

      <Container className="py-5">
        <h2>{data?.advertise_section_title}</h2>
        <p>{data?.paragraph_1}</p>
        <ul>
          <li>{data?.list_item_1}</li>
          <li>{data?.list_item_2}</li>
          <li>{data?.list_item_3}</li>
        </ul>
        <p>
          📩 {data?.contact_text}
          <a href="mailto:advertise@augenarzt.cloud">jobs@augenarzt.cloud</a>
        </p>
      </Container>
    </>
  );
};
const Advertise = () => {
  return (
    <div className="color-body">
      <Header />
      <NavBar />
      <AdvertiseSection />
      <Footer />
    </div>
  );
};

export default Advertise;
