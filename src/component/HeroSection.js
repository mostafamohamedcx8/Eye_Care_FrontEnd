import React from "react";
import { Container, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
const HeroSection = () => {
  const { t } = useTranslation(); // Initialize translation hook

  return (
    <div className="hero-section">
      <div className="overlay">
        <Container className="text-center text-white hero-content">
          <img
            src={"logo.png"}
            alt={t("hero.logo_alt")}
            className="hero-logo"
          />
          <h5 className="hero-subtitle">{t("hero.subtitle")}</h5>
          <Button href="/Signup" className="hero-button">
            {t("hero.sign_up")}
          </Button>
        </Container>
      </div>
    </div>
  );
};

export default HeroSection;
