import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

const WelcomeSection = ({ data }) => {
  return (
    <div className="welcome-section">
      <Container>
        <Row className="align-items-center">
          <Col md={6}>
            <h2 className="welcome-title">{data?.welcome_title}</h2>
            <p className="welcome-text">{data?.welcome_text}</p>
            <Button className="welcome-button" href={data?.welcome_button_url}>
              {data?.welcome_button_text}
            </Button>
          </Col>
          <Col md={6}>
            <img
              src={data?.welcome_image}
              alt="welcome"
              className="welcome-image"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default WelcomeSection;
