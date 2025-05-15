import React from "react";
import Header from "../component/Header";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";
import PatientTab from "../component/patientDetails";

const PatientPage = () => {
  return (
    <div className="color-body">
      <Header />
      <NavBar />
      <PatientTab />
      <Footer />
    </div>
  );
};

export default PatientPage;
