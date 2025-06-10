import Header from "../component/Header";
import NavBar from "../component/NavBar";
import { Link } from "react-router-dom";
import Footer from "../component/Footer";
import React from "react";
import { Container, Row } from "react-bootstrap";

const AboutSection = () => {
  return (
    <>
      {/* Hero Section */}
      <Row>
        <div className="hero-section">
          <div className="overlay hero-section">
            <div className="breadcrumb">
              <Link to="/" className="breadcrumb-link">
                Home
              </Link>
              <span className="separator">/</span>
              <span className="active">About</span>
            </div>
            <h1 className="title">About Us</h1>
          </div>
        </div>
      </Row>

      {/* Content Section */}
      <Container className="about-content text-center py-5">
        <h2 className="section-title mb-4">Welcome to Eye Care Website</h2>
        <p className="section-paragraph mx-auto">
          where cutting-edge technology meets healthcare innovation. Our mission
          is to revolutionize eye care through advanced imaging and analysis. We
          understand the vital role that vision plays in your life, and we are
          dedicated to ensuring that everyone has access to comprehensive eye
          health assessments. At Eye Care Website, we utilize state-of-the-art
          imaging techniques to capture detailed pictures of the eye. Our
          sophisticated algorithms analyze these images to detect potential eye
          diseases at their earliest stages, allowing for timely intervention
          and treatment. Whether it's glaucoma, diabetic retinopathy, or other
          eye conditions, our goal is to empower individuals with the knowledge
          they need to maintain their eye health.
        </p>
      </Container>
    </>
  );
};
const About = () => {
  return (
    <div className="color-body">
      <Header />
      <NavBar />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default About;
