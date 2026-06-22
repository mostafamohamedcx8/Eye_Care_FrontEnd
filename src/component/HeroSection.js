import React from "react";
import { Container, Button } from "react-bootstrap";

const HeroSection = ({ data }) => {
  return (
    <div
      className="hero-section"
      style={{ backgroundImage: `url(${data?.hero_background})` }}
    >
      <div className="overlay">
        <Container className="text-center text-white hero-content">
          <img src={data?.hero_logo} alt="logo" className="hero-logo" />
          <h5 className="hero-subtitle">{data?.hero_subtitle}</h5>
          <Button href={data?.hero_button_url} className="hero-button">
            {data?.hero_button_text}
          </Button>
        </Container>
      </div>
    </div>
  );
};

export default HeroSection;
