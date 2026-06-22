import Header from "../component/Header";
import NavBar from "../component/NavBar";
import { Link } from "react-router-dom";
import Footer from "../component/Footer";
import React from "react";
import { Container, Row } from "react-bootstrap";
import usePageData from "../Hooks/usePageData";
import { useTranslation } from "react-i18next";

const TeamSection = () => {
  const { i18n, t } = useTranslation();
  const pageId = i18n.language === "de" ? 128 : 126; // غير الـ IDs

  const { data, loading } = usePageData(pageId, []);
  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Row>
        <div className="hero-section">
          <div className="overlay hero-section">
            <div className="breadcrumb">
              <Link to="/" className="breadcrumb-link">
                {t("team.breadcrumb_home")}
              </Link>
              <span className="separator">/</span>
              <span className="active">{data?.team_title}</span>
            </div>
            <h1 className="title">{data?.team_title}</h1>
          </div>
        </div>
      </Row>

      <Container className="py-5">
        <h2 className="text-center mb-4">{data?.team_section_title}</h2>

        <div className="mb-4">
          <h4 className="text-primary">{data?.supervisory_team_title}</h4>
          <ul className="list-unstyled">
            <li>{data?.supervisor_1}</li>
            <li>{data?.supervisor_2}</li>
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="text-primary">{data?.development_team_title}</h4>
          <ul className="list-unstyled">
            <li>{data?.developer_1}</li>
            <li>{data?.developer_2}</li>
            <li>{data?.developer_3}</li>
            <li>{data?.developer_4}</li>
            <li>{data?.developer_5}</li>
            <li>{data?.developer_6}</li>
            <li>{data?.developer_7}</li>
            <li>{data?.developer_8}</li>
          </ul>
        </div>
      </Container>
    </>
  );
};
const Team = () => {
  return (
    <div className="color-body">
      <Header />
      <NavBar />
      <TeamSection />
      <Footer />
    </div>
  );
};

export default Team;
