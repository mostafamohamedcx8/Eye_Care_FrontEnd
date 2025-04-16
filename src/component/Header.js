import React from "react";
import { FaPhone, FaEnvelope } from "react-icons/fa";
import { Container, Col, Row } from "react-bootstrap";
const Header = () => {
  return (
    <div className="topbar border-bottom">
      <Container>
        <Row className="align-items-center">
          <Col xs={12}>
            <div className="d-flex flex-wrap justify-content-center justify-content-sm-start gap-3 py-2">
              <a
                href="tel:+201068396936"
                className="d-flex align-items-center text-decoration-none site-text-info"
              >
                <FaPhone className="me-2 icon-color" />
                +20 01068396936
              </a>
              <span className="text-muted">|</span>
              <a
                href="mailto:yasminashraf048@gmail.com"
                className="d-flex align-items-center text-decoration-none site-text-info"
              >
                <FaEnvelope className="me-2 icon-color" />
                yasminashraf048@gmail.com
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Header;
