import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const WelcomeSection = () => {
  const { t } = useTranslation(); // Initialize translation hook

  return (
    <div className="welcome-section">
      <Container>
        <Row className="align-items-center">
          <Col md={6}>
            <h2 className="welcome-title">{t("welcome.title")}</h2>
            <p className="welcome-text">{t("welcome.text")}</p>
            <Button className="welcome-button" href="/about">
              {t("welcome.learn_more")}
            </Button>
          </Col>
          <Col md={6}>
            <img
              src={"Doctorimage.png"}
              alt={t("welcome.image_alt")}
              className="welcome-image"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default WelcomeSection;
