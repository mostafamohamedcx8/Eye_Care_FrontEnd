/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaFacebookF,
  FaTwitter,
  FaGooglePlusG,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <div className="footer">
      <Container>
        <Row>
          <Col md={4}>
            <h5>Company</h5>
            <ul>
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="#">Career</a>
              </li>
              <li>
                <a href="#">Editorial Team</a>
              </li>
              <li>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a href="#">Protection</a>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>More</h5>
            <ul>
              <li>
                <a href="#">Terms & Condition</a>
              </li>
              <li>
                <a href="#">Privacy</a>
              </li>
              <li>
                <a href="#">Advertise</a>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Social Media</h5>
            <div className="social-icons">
              <a href="#">
                <FaFacebookF />
              </a>
              <a href="#">
                <FaTwitter />
              </a>
              <a href="#">
                <FaGooglePlusG />
              </a>
              <a href="#">
                <FaInstagram />
              </a>
              <a href="#">
                <FaLinkedinIn />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Footer;
