import React, { useRef, useEffect } from "react";
import { Container, Row, Col, Card, ListGroup, Button } from "react-bootstrap";
import Header from "../component/Header";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSpecificReport } from "./../Redux/actions/Reportaction";

const PatientReport = () => {
  const userFromStorage = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const { id } = useParams();
  useEffect(() => {
    dispatch(getSpecificReport(id));
  }, []);

  const ReportData = useSelector((state) => state.allreport.specificreport);
  // Add optional chaining for safety

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

  const Report = ReportData.data || [];
  console.log(Report);

  return (
    <>
      <Header />
      <NavBar />
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
                  <strong>Name:</strong> {Report?.patient?.name}
                </div>
                <div className="mb-2">
                  <strong>Gender:</strong> {Report?.patient?.gender}
                </div>
                <div className="mb-2">
                  <strong>Ethnicity:</strong> {Report?.patient?.ethnicity}
                </div>
              </Col>
              {/* Left Column */}
              <Col md={6}>
                <div className="mb-2">
                  <strong>ID:</strong> {Report?.patient?._id}
                </div>
                <div className="mb-2">
                  <strong>Date of Birth:</strong>{" "}
                  {new Date(Report?.patient?.dateOfBirth).toLocaleDateString()}
                </div>
                <div className="mb-2">
                  <strong>Date Of Examination:</strong>{" "}
                  {new Date(Report?.createdAt).toLocaleDateString()}
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
              {Report?.history?.medical?.map((disease, idx) => (
                <ListGroup.Item key={idx}>
                  <div className="d-flex justify-content-between">
                    <strong>{disease.name}</strong>
                    <div className="ms-3">
                      <span>
                        <strong>Has Condition:</strong>{" "}
                        {disease.hasCondition ? "Yes" : "No"}
                      </span>
                      <span className="ms-3">
                        <strong>Applies To:</strong> {disease.appliesTo}
                      </span>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>

        {/* Eye Diseases */}
        <Card className="mb-4">
          <Card.Header className="custom-card-header">Eye History</Card.Header>
          <Card.Body>
            <ListGroup>
              {Report?.history?.eye?.map((disease, idx) => (
                <ListGroup.Item key={idx}>
                  <div className="d-flex justify-content-between">
                    <strong>{disease.name}</strong>
                    <div className="ms-3">
                      <span>
                        <strong>Has Condition:</strong>{" "}
                        {disease.hasCondition ? "Yes" : "No"}
                      </span>
                      <span className="ms-3">
                        <strong>Applies To:</strong> {disease.appliesTo}
                      </span>
                    </div>
                  </div>
                </ListGroup.Item>
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
                <strong>Visus (CC):</strong>{" "}
                {Report?.eyeExamination?.rightEye?.visusCC}
              </Col>
              <Col>
                <strong>Previous Value:</strong>{" "}
                {Report?.eyeExamination?.rightEye?.previousValue}
              </Col>
              <Col>
                <strong>Since:</strong>{" "}
                {new Date(
                  Report?.eyeExamination?.rightEye?.since
                ).toLocaleDateString()}
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <strong>Sphere:</strong>{" "}
                {Report?.eyeExamination?.rightEye?.sphere}
              </Col>
              <Col>
                <strong>Cylinder:</strong>{" "}
                {Report?.eyeExamination?.rightEye?.cylinder}
              </Col>
              <Col>
                <strong>Axis:</strong> {Report?.eyeExamination?.rightEye?.axis}
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <strong>Intraocular Pressure:</strong>{" "}
                {Report?.eyeExamination?.rightEye?.intraocularPressure}
              </Col>
              <Col>
                <strong>Corneal Thickness:</strong>{" "}
                {Report?.eyeExamination?.rightEye?.cornealThickness}
              </Col>
              <Col>
                <strong>Chamber Angle:</strong>{" "}
                {Report?.eyeExamination?.rightEye?.chamberAngle}
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <strong>Amsler Test Abnormal:</strong>{" "}
                {Report?.eyeExamination?.rightEye?.amslerTestAbnormal
                  ? "Yes"
                  : "No"}
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
                <strong>Visus (CC):</strong>{" "}
                {Report?.eyeExamination?.leftEye?.visusCC}
              </Col>
              <Col>
                <strong>Previous Value:</strong>{" "}
                {Report?.eyeExamination?.leftEye?.previousValue}
              </Col>
              <Col>
                <strong>Since:</strong>{" "}
                {new Date(
                  Report?.eyeExamination?.leftEye?.since
                ).toLocaleDateString()}
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <strong>Sphere:</strong>{" "}
                {Report?.eyeExamination?.leftEye?.sphere}
              </Col>
              <Col>
                <strong>Cylinder:</strong>{" "}
                {Report?.eyeExamination?.leftEye?.cylinder}
              </Col>
              <Col>
                <strong>Axis:</strong> {Report?.eyeExamination?.leftEye?.axis}
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <strong>Intraocular Pressure:</strong>{" "}
                {Report?.eyeExamination?.leftEye?.intraocularPressure}
              </Col>
              <Col>
                <strong>Corneal Thickness:</strong>{" "}
                {Report?.eyeExamination?.leftEye?.cornealThickness}
              </Col>
              <Col>
                <strong>Chamber Angle:</strong>{" "}
                {Report?.eyeExamination?.leftEye?.chamberAngle}
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <strong>Amsler Test Abnormal:</strong>{" "}
                {Report?.eyeExamination?.leftEye?.amslerTestAbnormal
                  ? "Yes"
                  : "No"}
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
            {Report?.eyeExamination?.rightEye?.images?.length > 0 ? (
              <ul>
                {Report.eyeExamination.rightEye.images.map((link, idx) => (
                  <li key={idx}>
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No images available</p>
            )}

            <h5 className="mt-3">Left Eye</h5>
            {Report?.eyeExamination?.leftEye?.images?.length > 0 ? (
              <ul>
                {Report.eyeExamination.leftEye.images.map((link, idx) => (
                  <li key={idx}>
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No images available</p>
            )}
          </Card.Body>
        </Card>
        {/* Prediction */}
        <Card className="mb-4 border-success">
          <Card.Header className="bg-success text-white">
            Model Prediction
          </Card.Header>
          <Card.Body>
            <h5>Final Prediction:</h5>
            <ul>
              <li>
                <strong>{Report?.modelResults?.disease1?.name}:</strong>{" "}
                {Report?.modelResults?.disease1?.percentage}%
              </li>
              <li>
                <strong>{Report?.modelResults?.disease2?.name}:</strong>{" "}
                {Report?.modelResults?.disease2?.percentage}%
              </li>
              <li>
                <strong>{Report?.modelResults?.disease3?.name}:</strong>{" "}
                {Report?.modelResults?.disease3?.percentage}%
              </li>
            </ul>
          </Card.Body>
        </Card>

        <div className="d-flex justify-content-center mt-4 gap-3">
          {userFromStorage?.role !== "doctor" && (
            <Button href="/DoctorCard" variant="primary">
              Refer To a Doctor
            </Button>
          )}

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
