import React, { useRef } from "react";
import { Container, Row, Col, Card, ListGroup, Button } from "react-bootstrap";
import Header from "../component/Header";
import NavBarProfile from "../component/NavBarProfile";
import Footer from "../component/Footer";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const PatientReport = () => {
  const patientData = {
    Date_of_Examinayion: "18/4/2025",
    name: "Ahmed Hassan",
    gender: "Male",
    dob: "1990-05-14",
    ethnicity: "Arab",
    ID: "2223453753",
    medicalDiseases: ["Diabetes", "Hypertension"],
    eyeDiseases: ["Glaucoma", "Cataract"],
  };

  const reportRef = useRef();

  const handleDownloadPDF = () => {
    const input = reportRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("eye-examination-report.pdf");
    });
  };

  const rightEyeLinks = [
    "https://example.com/right-eye-image1.jpg",
    "https://example.com/right-eye-image2.jpg",
  ];

  const leftEyeLinks = [
    "https://example.com/left-eye-image1.jpg",
    "https://example.com/left-eye-image2.jpg",
  ];

  const prediction = "No signs of diabetic retinopathy detected in either eye.";

  const rightEyeExam = {
    visusCC: "20/30",
    previousValue: "20/40",
    since: "2023-06-01",
    sphere: "-1.25",
    cylinder: "-0.50",
    axis: "180",
    pressure: "15 mmHg",
    thickness: "540 µm",
    chamberAngle: "Open",
    amslerTestAbnormal: true,
  };

  const leftEyeExam = {
    visusCC: "20/25",
    previousValue: "20/30",
    since: "2023-06-01",
    sphere: "-1.00",
    cylinder: "-0.75",
    axis: "170",
    pressure: "14 mmHg",
    thickness: "530 µm",
    chamberAngle: "Open",
    amslerTestAbnormal: false,
  };

  return (
    <>
      <Header />
      <NavBarProfile />
      <Container
        ref={reportRef}
        className="mt-5 mb-5 p-4 border rounded shadow bg-light"
      >
        <h2 className="mb-4 text-center">Patient Eye Examination Report</h2>

        {/* Patient Info */}
        <Card className="mb-4 shadow rounded-2">
          <Card.Header className="custom-card-header">
            Patient Information
          </Card.Header>
          <Card.Body>
            <Row>
              {/* Right Column */}
              <Col md={6}>
                <div className="mb-2">
                  <strong>Name:</strong> {patientData.name}
                </div>
                <div className="mb-2">
                  <strong>Gender:</strong> {patientData.gender}
                </div>
                <div className="mb-2">
                  <strong>Ethnicity:</strong> {patientData.ethnicity}
                </div>
              </Col>
              {/* Left Column */}
              <Col md={6}>
                <div className="mb-2">
                  <strong>ID:</strong> {patientData.ID}
                </div>
                <div className="mb-2">
                  <strong>Date of Birth:</strong> {patientData.dob}
                </div>
                <div className="mb-2">
                  <strong>Date Of Examination:</strong>{" "}
                  {patientData.Date_of_Examinayion}
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Medical History */}
        <Card className="mb-4">
          <Card.Header className="custom-card-header">
            Medical History
          </Card.Header>
          <Card.Body>
            <ListGroup>
              {patientData.medicalDiseases.map((disease, idx) => (
                <ListGroup.Item key={idx}>{disease}</ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>

        {/* Eye Diseases */}
        <Card className="mb-4">
          <Card.Header className="custom-card-header">Eye Diseases</Card.Header>
          <Card.Body>
            <ListGroup>
              {patientData.eyeDiseases.map((disease, idx) => (
                <ListGroup.Item key={idx}>{disease}</ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>

        {/* Right Eye Exam */}
        <Card className="mb-4">
          <Card.Header className="custom-card-header">
            Right Eye Examination
          </Card.Header>
          <Card.Body>
            <Row>
              <Col>
                <strong>Visus (CC):</strong> {rightEyeExam.visusCC}
              </Col>
              <Col>
                <strong>Previous Value:</strong> {rightEyeExam.previousValue}
              </Col>
              <Col>
                <strong>Since:</strong> {rightEyeExam.since}
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <strong>Sphere:</strong> {rightEyeExam.sphere}
              </Col>
              <Col>
                <strong>Cylinder:</strong> {rightEyeExam.cylinder}
              </Col>
              <Col>
                <strong>Axis:</strong> {rightEyeExam.axis}
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <strong>Intraocular Pressure:</strong> {rightEyeExam.pressure}
              </Col>
              <Col>
                <strong>Corneal Thickness:</strong> {rightEyeExam.thickness}
              </Col>
              <Col>
                <strong>Chamber Angle:</strong> {rightEyeExam.chamberAngle}
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <strong>Amsler Test Abnormal:</strong>{" "}
                {rightEyeExam.amslerTestAbnormal ? "Yes" : "No"}
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Left Eye Exam */}
        <Card className="mb-4">
          <Card.Header className="custom-card-header">
            Left Eye Examination
          </Card.Header>
          <Card.Body>
            <Row>
              <Col>
                <strong>Visus (CC):</strong> {leftEyeExam.visusCC}
              </Col>
              <Col>
                <strong>Previous Value:</strong> {leftEyeExam.previousValue}
              </Col>
              <Col>
                <strong>Since:</strong> {leftEyeExam.since}
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <strong>Sphere:</strong> {leftEyeExam.sphere}
              </Col>
              <Col>
                <strong>Cylinder:</strong> {leftEyeExam.cylinder}
              </Col>
              <Col>
                <strong>Axis:</strong> {leftEyeExam.axis}
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <strong>Intraocular Pressure:</strong> {leftEyeExam.pressure}
              </Col>
              <Col>
                <strong>Corneal Thickness:</strong> {leftEyeExam.thickness}
              </Col>
              <Col>
                <strong>Chamber Angle:</strong> {leftEyeExam.chamberAngle}
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <strong>Amsler Test Abnormal:</strong>{" "}
                {leftEyeExam.amslerTestAbnormal ? "Yes" : "No"}
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Eye Images */}
        <Card className="mb-4">
          <Card.Header className="custom-card-header">
            Uploaded Eye Images
          </Card.Header>
          <Card.Body>
            <h5>Right Eye</h5>
            <ul>
              {rightEyeLinks.map((link, idx) => (
                <li key={idx}>
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    {link}
                  </a>
                </li>
              ))}
            </ul>

            <h5 className="mt-3">Left Eye</h5>
            <ul>
              {leftEyeLinks.map((link, idx) => (
                <li key={idx}>
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </Card.Body>
        </Card>

        {/* Prediction */}
        <Card className="mb-4 border-success">
          <Card.Header className="bg-success text-white">
            Model Prediction
          </Card.Header>
          <Card.Body>
            <h5>Final Prediction:</h5>
            <p>
              <strong>{prediction}</strong>
            </p>
          </Card.Body>
        </Card>
        <div className="d-flex justify-content-center mt-4 gap-3">
          <Button href="/DoctorCard" variant="primary">
            Refer To a Doctor
          </Button>
          <Button onClick={handleDownloadPDF} variant="danger">
            Download Report
          </Button>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default PatientReport;
