import Header from "../component/Header";

import { Link } from "react-router-dom";
import Footer from "../component/Footer";
import React from "react";
import { Row } from "react-bootstrap";
import NavBarProfile from "./../component/NavBarProfile";
import ExaminationDetails from "./../component/ExaminationDetails";

const HistorySection = () => {
  return (
    <Row>
      <div className="about-hero">
        <div className="overlay about-hero">
          <div className="breadcrumb">
            <Link to="/Examination" className="breadcrumb-link">
              Home
            </Link>
            <span className="separator">/</span>
            <span className="active">Your History</span>
          </div>
          <h1 className="title">your Eye Examination</h1>
        </div>
      </div>
    </Row>
  );
};
const DetailsExam = () => {
  return (
    <div className="color-body">
      <Header />
      <NavBarProfile />
      <HistorySection />
      <ExaminationDetails />
      <Footer />
    </div>
  );
};

export default DetailsExam;
