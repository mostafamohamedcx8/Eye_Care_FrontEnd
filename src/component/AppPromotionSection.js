import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const AppPromotionSection = () => {
  return (
    <div className="app-promotion-section">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-center">
            <img
              src={"mobile_app.png"} // الصورة التي رفعتها بيد تمسك الهاتف
              alt="Mobile App"
              className="phone-image"
            />
          </Col>
          <Col md={6} className="text-center">
            <div className="store-buttons">
              <a
                href="https://play.google.com/store/apps/details?id=your.app.id"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play"
                  className="store-badge"
                />
              </a>
              <a
                href="https://apps.apple.com/app/your-app-id"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="Download on the App Store"
                  className="store-badge"
                />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AppPromotionSection;
