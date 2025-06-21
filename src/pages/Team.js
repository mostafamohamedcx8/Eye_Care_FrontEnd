import Header from "../component/Header";
import NavBar from "../component/NavBar";
import { Link } from "react-router-dom";
import Footer from "../component/Footer";
import React from "react";
import { Container, Row } from "react-bootstrap";

const TeamSection = () => {
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
              <span className="active">Team</span>
            </div>
            <h1 className="title">Team</h1>
          </div>
        </div>
      </Row>

      {/* Content Section */}
      <Container className="py-5">
        <h2 className="text-center mb-4">Our Team</h2>

        <div className="mb-4">
          <h4 className="text-primary">Supervisory Team</h4>
          <ul className="list-unstyled">
            <li>
              <strong>Dr. Ahmed Farag</strong> – Product Owner & Testing
              Supervisor
            </li>
            <li>
              <strong>Dr. Samah Abou Samrah</strong> – Project Supervisor
            </li>
            <li>
              <strong>Dr. Ahmed Farag</strong> – Ophthalmologist & Medical
              Advisor
            </li>
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="text-primary">Development Team</h4>
          <ul className="list-unstyled">
            <li>
              <strong>Eng. Mostafa Mohamed</strong> – Full Stack Developer, AI
              Integration Lead, Server Deployment & Domain Integration
            </li>
            <li>
              <strong>Eng. Yasmin Ashraf</strong> – Frontend Developer (React &
              Redux) & UI/UX Design Support
            </li>
            <li>
              <strong>Eng. Maiven Daniel</strong> – Frontend Developer (React &
              Redux) & UI/UX Design Support
            </li>
            <li>
              <strong>Eng. Youssef Helmy</strong> – Devops & software engineer
            </li>
            <li>
              <strong>Eng. Sara AbdelFattah</strong> – Backend Developer
            </li>
            <li>
              <strong>Eng. Rana Alaa</strong> – Data Collection & Model Building
            </li>
            <li>
              <strong>Eng. Yasmin Yasser</strong> – AI Model Building
            </li>
            <li>
              <strong>Eng. Eslam Ahmed</strong> – Mobile Application Developer
            </li>
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
