import React, { useRef, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Button,
  Accordion,
} from "react-bootstrap";
import Header from "../component/Header";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSpecificReport } from "./../Redux/actions/Reportaction";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const PatientReport = () => {
  const navigate = useNavigate();
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

  const displayValue = (value) => {
    return value !== undefined && value !== null && value !== "" ? (
      value
    ) : (
      <span style={{ color: "red" }}>X</span>
    );
  };

  const displayDate = (date) => {
    return date ? (
      new Date(date).toLocaleDateString("de-DE")
    ) : (
      <span style={{ color: "red" }}>X</span>
    );
  };

  // دالة لعرض نعم/لا أو X حمراء لو مش موجود
  const displayBoolean = (value) => {
    return value !== undefined ? (
      value ? (
        "Yes"
      ) : (
        "No"
      )
    ) : (
      <span style={{ color: "red" }}>X</span>
    );
  };

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
                  <strong>Name:</strong> {Report?.patient?.firstname}{" "}
                  {Report?.patient?.lastname}
                </div>
                <div className="mb-2">
                  <strong>Salutation:</strong> {Report?.patient?.salutation}
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
                  {new Date(Report?.patient?.dateOfBirth).toLocaleDateString(
                    "de-DE"
                  )}
                </div>
                <div className="mb-2">
                  <strong>Date Of Examination:</strong>{" "}
                  {new Date(Report?.createdAt).toLocaleDateString("de-DE")}
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
        {/* <Card className="mb-4">
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
                {Report?.eyeExamination?.rightEye?.since
                  ? new Date(
                      Report.eyeExamination.rightEye.since
                    ).toLocaleDateString("de-DE")
                  : "N/A"}
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
        </Card> */}

        {/* Left Eye Exam */}
        {/* <Card className="mb-4">
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
                {Report?.eyeExamination?.leftEye?.since
                  ? new Date(
                      Report.eyeExamination.leftEye.since
                    ).toLocaleDateString("de-DE")
                  : "N/A"}
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
        </Card> */}

        <Card className="mb-4">
          <Card.Header className="custom-card-header">
            Right Eye Examination
          </Card.Header>
          <Card.Body>
            <Row>
              <Col>
                <strong>Visus (CC):</strong>{" "}
                {displayValue(Report?.eyeExamination?.rightEye?.visusCC)}
              </Col>
              <Col>
                <strong>Previous Value:</strong>{" "}
                {displayValue(Report?.eyeExamination?.rightEye?.previousValue)}
              </Col>
              <Col>
                <strong>Since:</strong>{" "}
                {displayDate(Report?.eyeExamination?.rightEye?.since)}
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <strong>Sphere:</strong>{" "}
                {displayValue(Report?.eyeExamination?.rightEye?.sphere)}
              </Col>
              <Col>
                <strong>Cylinder:</strong>{" "}
                {displayValue(Report?.eyeExamination?.rightEye?.cylinder)}
              </Col>
              <Col>
                <strong>Axis:</strong>{" "}
                {displayValue(Report?.eyeExamination?.rightEye?.axis)}
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <strong>Intraocular Pressure:</strong>{" "}
                {displayValue(
                  Report?.eyeExamination?.rightEye?.intraocularPressure
                )}
              </Col>
              <Col>
                <strong>Corneal Thickness:</strong>{" "}
                {displayValue(
                  Report?.eyeExamination?.rightEye?.cornealThickness
                )}
              </Col>
              <Col>
                <strong>Chamber Angle:</strong>{" "}
                {displayValue(Report?.eyeExamination?.rightEye?.chamberAngle)}
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <strong>Amsler Test Abnormal:</strong>{" "}
                {displayBoolean(
                  Report?.eyeExamination?.rightEye?.amslerTestAbnormal
                )}
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
                {displayValue(Report?.eyeExamination?.leftEye?.visusCC)}
              </Col>
              <Col>
                <strong>Previous Value:</strong>{" "}
                {displayValue(Report?.eyeExamination?.leftEye?.previousValue)}
              </Col>
              <Col>
                <strong>Since:</strong>{" "}
                {displayDate(Report?.eyeExamination?.leftEye?.since)}
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <strong>Sphere:</strong>{" "}
                {displayValue(Report?.eyeExamination?.leftEye?.sphere)}
              </Col>
              <Col>
                <strong>Cylinder:</strong>{" "}
                {displayValue(Report?.eyeExamination?.leftEye?.cylinder)}
              </Col>
              <Col>
                <strong>Axis:</strong>{" "}
                {displayValue(Report?.eyeExamination?.leftEye?.axis)}
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <strong>Intraocular Pressure:</strong>{" "}
                {displayValue(
                  Report?.eyeExamination?.leftEye?.intraocularPressure
                )}
              </Col>
              <Col>
                <strong>Corneal Thickness:</strong>{" "}
                {displayValue(
                  Report?.eyeExamination?.leftEye?.cornealThickness
                )}
              </Col>
              <Col>
                <strong>Chamber Angle:</strong>{" "}
                {displayValue(Report?.eyeExamination?.leftEye?.chamberAngle)}
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <strong>Amsler Test Abnormal:</strong>{" "}
                {displayBoolean(
                  Report?.eyeExamination?.leftEye?.amslerTestAbnormal
                )}
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
            {/* Right Eye Section */}
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Right Eye</h5>
              {Report?.eyeExamination?.rightEye?.imageCaptureDate && (
                <span className="text-muted">
                  Image Capture Date:{" "}
                  {new Date(
                    Report.eyeExamination.rightEye.imageCaptureDate
                  ).toLocaleDateString("de-DE")}
                </span>
              )}
            </div>
            {Report?.eyeExamination?.rightEye?.images?.length > 0 ? (
              <ul>
                <div className="d-flex flex-wrap gap-3 mt-2">
                  {Report.eyeExamination.rightEye.images.map((link, idx) => (
                    <a
                      key={idx}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="thumbnail-link"
                    >
                      <img
                        src={link}
                        alt={`Right Eye Image ${idx + 1}`}
                        className="eye-thumbnail"
                      />
                    </a>
                  ))}
                </div>
              </ul>
            ) : (
              <p>No images available</p>
            )}

            {/* Left Eye Section */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <h5 className="mb-0">Left Eye</h5>
              {Report?.eyeExamination?.leftEye?.imageCaptureDate && (
                <span className="text-muted">
                  Image Capture Date:{" "}
                  {new Date(
                    Report.eyeExamination.leftEye.imageCaptureDate
                  ).toLocaleDateString("de-DE")}
                </span>
              )}
            </div>
            {Report?.eyeExamination?.leftEye?.images?.length > 0 ? (
              <ul>
                <div className="d-flex flex-wrap gap-3 mt-2">
                  {Report.eyeExamination.leftEye.images.map((link, idx) => (
                    <a
                      key={idx}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="thumbnail-link"
                    >
                      <img
                        src={link}
                        alt={`Left Eye Image ${idx + 1}`}
                        className="eye-thumbnail"
                      />
                    </a>
                  ))}
                </div>
              </ul>
            ) : (
              <p>No images available</p>
            )}
          </Card.Body>
        </Card>
        {/* Prediction */}
        {/* <Card className="mb-4 border-success">
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
        </Card> */}
        {/* <Card className="mb-4 border-success">
          <Card.Header className="bg-success text-white">
            Model Prediction - Right Eye
          </Card.Header>
          <Card.Body>
            {Report?.modelResults?.rightEye ? (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Disease</th>
                    <th>Confidence (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(Report.modelResults.rightEye.entries()).map(
                    ([diseaseName, details]) => (
                      <tr key={diseaseName}>
                        <td>{details.name || diseaseName}</td>
                        <td>
                          <span className="badge bg-info text-dark">
                            {details.percentage}%
                          </span>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            ) : (
              <p>No prediction data available for the right eye.</p>
            )}
          </Card.Body>

          <Card.Header className="bg-success text-white">
            Model Prediction - Left Eye
          </Card.Header>
          <Card.Body>
            {Report?.modelResults?.leftEye ? (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Disease</th>
                    <th>Confidence (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(Report.modelResults.leftEye.entries()).map(
                    ([diseaseName, details]) => (
                      <tr key={diseaseName}>
                        <td>{details.name || diseaseName}</td>
                        <td>
                          <span className="badge bg-info text-dark">
                            {details.percentage}%
                          </span>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            ) : (
              <p>No prediction data available for the left eye.</p>
            )}
          </Card.Body>
        </Card> */}

        {/* <Card className="mb-4 border-primary">
          <Card.Header className="bg-primary text-white">
            Model Prediction - Right Eye
          </Card.Header>
          <Card.Body>
            {Report?.modelResults?.rightEye ? (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Disease</th>
                    <th>Confidence (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(JSON.parse(Report.modelResults.rightEye)).map(
                    ([diseaseName, details]) => (
                      <tr key={diseaseName}>
                        <td>{details.name || diseaseName}</td>
                        <td>
                          <span className="badge bg-info text-dark">
                            {details.percentage}%
                          </span>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            ) : (
              <p>No prediction data available for the right eye.</p>
            )}
          </Card.Body>

          <Card.Header className="bg-primary text-white">
            Model Prediction - Left Eye
          </Card.Header>
          <Card.Body>
            {Report?.modelResults?.leftEye ? (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Disease</th>
                    <th>Confidence (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(JSON.parse(Report.modelResults.leftEye)).map(
                    ([diseaseName, details]) => (
                      <tr key={diseaseName}>
                        <td>{details.name || diseaseName}</td>
                        <td>
                          <span className="badge bg-info text-dark">
                            {details.percentage}%
                          </span>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            ) : (
              <p>No prediction data available for the left eye.</p>
            )}
          </Card.Body>
        </Card> */}
        <Card className="mb-4 border-primary">
          <Card.Header className="bg-primary text-white">
            Model Prediction - Right Eye
          </Card.Header>
          <Card.Body>
            {/* Right Eye Table */}
            {Report?.modelResults?.rightEye ? (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Disease</th>
                    <th>Confidence (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(JSON.parse(Report.modelResults.rightEye)).map(
                    ([diseaseName, details]) => (
                      <tr key={diseaseName}>
                        <td>{details.name || diseaseName}</td>
                        <td>
                          <span className="badge bg-info text-dark">
                            {details.percentage}%
                          </span>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            ) : (
              <p>No prediction data available for the right eye.</p>
            )}
          </Card.Body>

          <Card.Header className="bg-primary text-white">
            Model Prediction - Left Eye
          </Card.Header>
          <Card.Body>
            {/* Left Eye Table */}
            {Report?.modelResults?.leftEye ? (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Disease</th>
                    <th>Confidence (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(JSON.parse(Report.modelResults.leftEye)).map(
                    ([diseaseName, details]) => (
                      <tr key={diseaseName}>
                        <td>{details.name || diseaseName}</td>
                        <td>
                          <span className="badge bg-info text-dark">
                            {details.percentage}%
                          </span>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            ) : (
              <p>No prediction data available for the left eye.</p>
            )}
          </Card.Body>

          {/* Doctor Feedback Section */}
          {Report?.doctorFeedbacks?.length > 0 && (
            <Card.Footer className="bg-light">
              <h5 className="mb-3 text-success">Doctor Feedback</h5>

              <Accordion>
                {Report.doctorFeedbacks.map((feedback, index) => (
                  <Accordion.Item
                    eventKey={index.toString()}
                    key={feedback._id}
                  >
                    <Accordion.Header>
                      DR. {feedback.doctor?.firstname || "Unknown"}{" "}
                      {feedback.doctor?.lastname || ""} –{" "}
                      {moment(feedback.createdAt).format("DD MMM YYYY, h:mm A")}
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="mb-3">
                        <h6>Right Eye</h6>
                        <p>
                          <strong>Prediction Accuracy:</strong>{" "}
                          <span
                            className={`badge ${
                              feedback.rightEyeFeedback.aiPredictionCorrect ===
                              "correct"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {feedback.rightEyeFeedback.aiPredictionCorrect}
                          </span>
                          <br />
                          <strong>Comment:</strong>{" "}
                          {feedback.rightEyeFeedback.comment}
                        </p>
                      </div>

                      <div className="mb-3">
                        <h6>Left Eye</h6>
                        <p>
                          <strong>Prediction Accuracy:</strong>{" "}
                          <span
                            className={`badge ${
                              feedback.leftEyeFeedback.aiPredictionCorrect ===
                              "correct"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {feedback.leftEyeFeedback.aiPredictionCorrect}
                          </span>
                          <br />
                          <strong>Comment:</strong>{" "}
                          {feedback.leftEyeFeedback.comment}
                        </p>
                      </div>

                      <div>
                        <h6>Diagnosis</h6>
                        <p>
                          <strong>Diagnosis:</strong> {feedback.diagnosis}
                        </p>
                        <p>
                          <strong>Recommended Action:</strong>{" "}
                          {feedback.recommendedAction}
                        </p>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Card.Footer>
          )}
        </Card>

        <div className="d-flex justify-content-center mt-4 gap-3">
          {userFromStorage?.role !== "doctor" && (
            <Button
              onClick={() => navigate(`/DoctorCard/${Report?.patient?._id}`)}
              variant="primary"
            >
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
