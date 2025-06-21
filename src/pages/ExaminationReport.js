import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Button,
  Accordion,
  Modal,
} from "react-bootstrap";
import Header from "../component/Header";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { Examination_Hook } from "../Hook/Examination_Hook";
const PatientReport = () => {
  const navigate = useNavigate();

  const [
    reportRef,
    Report,
    handleMarkAsRead,
    userFromStorage,
    handleDownloadPDF,
    setSelectedImage,
    selectedImage,
    displayValue,
    displayDate,
    displayBoolean,
  ] = Examination_Hook();
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

        <Card className="mb-4">
          <Card.Header className="custom-card-header">
            Right Eye Examination & Analysis
          </Card.Header>

          {/* الصور والعنوان وتاريخ الالتقاط */}
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
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
              <div className="d-flex flex-wrap gap-3 mb-4">
                {Report.eyeExamination.rightEye.images.map((link, idx) => (
                  <div
                    key={idx}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedImage(link)}
                  >
                    <img
                      src={link}
                      crossOrigin="anonymous"
                      loading="lazy"
                      alt={`Right Eye Image ${idx + 1}`}
                      style={{
                        width: "160px",
                        height: "160px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p>No images available</p>
            )}

            {/* Modal for showing full image */}
            <Modal
              show={!!selectedImage}
              onHide={() => setSelectedImage(null)}
              centered
              size="lg"
            >
              <Modal.Header closeButton>
                <Modal.Title>Image Preview</Modal.Title>
              </Modal.Header>
              <Modal.Body className="text-center">
                <img
                  src={selectedImage}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "80vh",
                    borderRadius: "8px",
                  }}
                />
              </Modal.Body>
            </Modal>

            {/* بيانات الفحص */}
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

            {/* تحليل النموذج */}
            <div className="mt-4">
              {Report?.modelResults?.rightEye ? (
                (() => {
                  const rightData = JSON.parse(Report.modelResults.rightEye);
                  const isImageQualityBad =
                    rightData.image_quality?.status !== "Adequate";

                  const filteredDiseases = Object.entries(rightData).filter(
                    ([key, value]) =>
                      key !== "image_quality" &&
                      key !== "eye_side" &&
                      value.status === "Detected"
                  );

                  return (
                    <>
                      {filteredDiseases.length > 0 ? (
                        <table className="table table-bordered mt-2">
                          <thead>
                            <tr>
                              <th>Disease</th>
                              <th>Confidence (%)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredDiseases.map(([key, value]) => (
                              <tr key={key}>
                                <td>{key}</td>
                                <td>
                                  <span className="badge bg-info text-dark">
                                    {value.confidence ?? "N/A"}%
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p>No detected diseases in the right eye.</p>
                      )}

                      {isImageQualityBad && (
                        <div className="alert alert-warning mt-3">
                          <strong>Bad image quality: - can be due to :</strong>
                          <br />
                          Media Opacity due to: Corneal opacity, Cataract,
                          vitreous opacities, vitreous hemorrhage/ inflammation,
                          tear film issues, etc. OR Optics misalignment (or
                          insufficient pupillary dilation, focus)
                        </div>
                      )}
                    </>
                  );
                })()
              ) : (
                <p>No prediction data available for the right eye.</p>
              )}
            </div>
            {Report?.doctorFeedbacks?.length > 0 && (
              <>
                <h5 className="mt-4 text-success">Doctor Feedback</h5>

                <Accordion>
                  {Report.doctorFeedbacks.map((feedback, index) => (
                    <Accordion.Item
                      eventKey={index.toString()}
                      key={feedback._id}
                      onClick={() => handleMarkAsRead(feedback)}
                    >
                      <Accordion.Header>
                        Dr. {feedback.doctor?.firstname || "Unknown"}{" "}
                        {feedback.doctor?.lastname || ""} –{" "}
                        {moment(feedback.createdAt).format(
                          "DD MMM YYYY, h:mm A"
                        )}
                      </Accordion.Header>
                      <Accordion.Body>
                        <p>
                          <strong>Prediction Accuracy:</strong>{" "}
                          <span
                            className={`badge ${
                              feedback.rightEyeFeedback?.aiPredictionCorrect ===
                              "correct"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {feedback.rightEyeFeedback?.aiPredictionCorrect ||
                              "N/A"}
                          </span>
                        </p>
                        <p>
                          <strong>Comment:</strong>{" "}
                          {feedback.rightEyeFeedback?.comment ||
                            "No comment provided."}
                        </p>
                        <p>
                          <strong>Diagnosis:</strong>{" "}
                          {feedback.rightEyeFeedback?.diagnosis || "N/A"}
                        </p>
                        <p>
                          <strong>Recommended Action:</strong>{" "}
                          {feedback.rightEyeFeedback?.recommendedAction ||
                            "N/A"}
                        </p>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </>
            )}
          </Card.Body>
        </Card>
        <Card className="mb-4">
          <Card.Header className="custom-card-header">
            Left Eye Examination & Analysis
          </Card.Header>

          {/* الصور والعنوان وتاريخ الالتقاط */}
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
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
              <div className="d-flex flex-wrap gap-3 mb-4">
                {Report.eyeExamination.leftEye.images.map((link, idx) => (
                  <div
                    key={idx}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedImage(link)}
                  >
                    <img
                      src={link}
                      crossOrigin="anonymous"
                      loading="lazy"
                      alt={`Left Eye Image ${idx + 1}`}
                      style={{
                        width: "160px",
                        height: "160px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p>No images available</p>
            )}

            {/* Modal for showing full image */}
            <Modal
              show={!!selectedImage}
              onHide={() => setSelectedImage(null)}
              centered
              size="lg"
            >
              <Modal.Header closeButton>
                <Modal.Title>Image Preview</Modal.Title>
              </Modal.Header>
              <Modal.Body className="text-center">
                <img
                  src={selectedImage}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "80vh",
                    borderRadius: "8px",
                  }}
                />
              </Modal.Body>
            </Modal>

            {/* بيانات الفحص */}
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

            {/* تحليل النموذج */}
            <div className="mt-4">
              {Report?.modelResults?.leftEye ? (
                (() => {
                  const leftData = JSON.parse(Report.modelResults.leftEye);
                  const isImageQualityBad =
                    leftData.image_quality?.status !== "Adequate";

                  const filteredDiseases = Object.entries(leftData).filter(
                    ([key, value]) =>
                      key !== "image_quality" &&
                      key !== "eye_side" &&
                      value.status === "Detected"
                  );

                  return (
                    <>
                      {filteredDiseases.length > 0 ? (
                        <table className="table table-bordered mt-2">
                          <thead>
                            <tr>
                              <th>Disease</th>
                              <th>Confidence (%)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredDiseases.map(([key, value]) => (
                              <tr key={key}>
                                <td>{key}</td>
                                <td>
                                  <span className="badge bg-info text-dark">
                                    {value.confidence ?? "N/A"}%
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p>No detected diseases in the left eye.</p>
                      )}

                      {isImageQualityBad && (
                        <div className="alert alert-warning mt-3">
                          <strong>Bad image quality: - can be due to :</strong>
                          <br />
                          Media Opacity due to: Corneal opacity, Cataract,
                          vitreous opacities, vitreous hemorrhage/ inflammation,
                          tear film issues, etc. OR Optics misalignment (or
                          insufficient pupillary dilation, focus)
                        </div>
                      )}
                    </>
                  );
                })()
              ) : (
                <p>No prediction data available for the left eye.</p>
              )}
            </div>
            {Report?.doctorFeedbacks?.length > 0 && (
              <>
                <h5 className="mt-4 text-success">Doctor Feedback</h5>

                <Accordion>
                  {Report.doctorFeedbacks.map((feedback, index) => (
                    <Accordion.Item
                      eventKey={index.toString()}
                      key={feedback._id}
                      onClick={() => handleMarkAsRead(feedback)}
                    >
                      <Accordion.Header>
                        Dr. {feedback.doctor?.firstname || "Unknown"}{" "}
                        {feedback.doctor?.lastname || ""} –{" "}
                        {moment(feedback.createdAt).format(
                          "DD MMM YYYY, h:mm A"
                        )}
                      </Accordion.Header>
                      <Accordion.Body>
                        <p>
                          <strong>Prediction Accuracy:</strong>{" "}
                          <span
                            className={`badge ${
                              feedback.leftEyeFeedback?.aiPredictionCorrect ===
                              "correct"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {feedback.leftEyeFeedback?.aiPredictionCorrect ||
                              "N/A"}
                          </span>
                        </p>
                        <p>
                          <strong>Comment:</strong>{" "}
                          {feedback.leftEyeFeedback?.comment ||
                            "No comment provided."}
                        </p>
                        <p>
                          <strong>Diagnosis:</strong>{" "}
                          {feedback.leftEyeFeedback?.diagnosis || "N/A"}
                        </p>
                        <p>
                          <strong>Recommended Action:</strong>{" "}
                          {feedback.leftEyeFeedback?.recommendedAction || "N/A"}
                        </p>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </>
            )}
          </Card.Body>
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
