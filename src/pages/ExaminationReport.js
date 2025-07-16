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
import { useTranslation } from "react-i18next";
const PatientReport = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [
    reportRef,
    Report,
    handleMarkAsRead,
    userFromStorage,
    handlePrint,
    setSelectedImage,
    selectedImage,
    displayValue,
    displayDate,
    displayBoolean,
    opticianName,
    opticianAddress,
  ] = Examination_Hook();
  return (
    <>
      <div ref={reportRef} className="report-content">
        <Header />
        <NavBar className="no-print" />
        <Container className="mt-5 mb-5 p-4 border rounded shadow bg-light">
          <div
            className="d-flex justify-content-between align-items-center flex-wrap"
            style={{
              padding: "10px 20px",
              borderBottom: "2px solid #ccc",
              marginBottom: "20px",
            }}
          >
            {/* Optician Info - left */}
            <div style={{ fontSize: "0.8rem", textAlign: "left" }}>
              <div>
                <strong>{t("reportdata.opticianLabel")}:</strong> {opticianName}
              </div>
              <div>
                <strong>{t("reportdata.addressLabel")}:</strong>{" "}
                {opticianAddress}
              </div>
            </div>

            {/* Title - center */}
            <div className="mx-auto text-center">
              <h2 style={{ fontWeight: "bold", margin: 0 }}>
                {t("reportdata.title")}
              </h2>
            </div>
          </div>

          {/* Patient Info */}
          <Card className="mb-4 shadow rounded-2">
            <Card.Header className="custom-card-header">
              {t("reportdata.patientInfo.header")}
            </Card.Header>
            <Card.Body>
              <Row>
                {/* Right Column */}
                <Col md={6}>
                  <div className="mb-2">
                    <strong>{t("reportdata.patientInfo.name")}:</strong>{" "}
                    {Report?.patient?.firstname} {Report?.patient?.lastname}
                  </div>
                  <div className="mb-2">
                    <strong>{t("reportdata.patientInfo.salutation")}:</strong>{" "}
                    {t(`reportdata.salutations.${Report?.patient?.salutation}`)}
                  </div>
                  <div className="mb-2">
                    <strong>{t("reportdata.patientInfo.ethnicity")}:</strong>{" "}
                    {t(
                      `reportdata.ethnicityOptions.${Report?.patient?.ethnicity}`
                    )}
                  </div>
                </Col>
                {/* Left Column */}
                <Col md={6}>
                  <div className="mb-2">
                    <strong>{t("reportdata.patientInfo.id")}:</strong>{" "}
                    {Report?.patient?._id}
                  </div>
                  <div className="mb-2">
                    <strong>{t("reportdata.patientInfo.dateOfBirth")}:</strong>{" "}
                    {displayDate(Report?.patient?.dateOfBirth)}
                  </div>
                  <div className="mb-2">
                    <strong>
                      {t("reportdata.patientInfo.dateOfExamination")}:
                    </strong>{" "}
                    {displayDate(Report?.createdAt)}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Medical History */}
          <Card className="mb-4">
            <Card.Header className="custom-card-header">
              {t("reportdata.medicalHistory.header")}
            </Card.Header>
            <Card.Body>
              <ListGroup>
                {Report?.history?.medical?.map((disease, idx) => (
                  <ListGroup.Item key={idx}>
                    <div className="d-flex justify-content-between">
                      <strong>
                        {t(`reportdata.medicalHistory.values.${disease.name}`)}
                      </strong>
                      <div className="ms-3">
                        <span>
                          <strong>
                            {t("reportdata.medicalHistory.hasCondition")}:
                          </strong>{" "}
                          {t(
                            `reportdata.medicalHistory.values.${
                              disease.hasCondition ? "Yes" : "No"
                            }`
                          )}
                        </span>
                        <span className="ms-3">
                          <strong>
                            {" "}
                            {t("reportdata.medicalHistory.appliesTo")}:
                          </strong>{" "}
                          {t(
                            `reportdata.medicalHistory.values.${disease.appliesTo}`
                          )}
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
            <Card.Header className="custom-card-header">
              {t("reportdata.eyeHistory.header")}
            </Card.Header>
            <Card.Body>
              <ListGroup>
                {Report?.history?.eye?.map((disease, idx) => (
                  <ListGroup.Item key={idx}>
                    <div className="d-flex justify-content-between">
                      <strong>
                        {t(`reportdata.medicalHistory.values.${disease.name}`)}
                      </strong>

                      <div className="ms-3">
                        <span>
                          <strong>
                            {t("reportdata.medicalHistory.hasCondition")}:
                          </strong>{" "}
                          {t(
                            `reportdata.medicalHistory.values.${
                              disease.hasCondition ? "Yes" : "No"
                            }`
                          )}
                        </span>
                        <span className="ms-3">
                          <strong>
                            {t("reportdata.medicalHistory.appliesTo")}:
                          </strong>{" "}
                          {t(
                            `reportdata.medicalHistory.values.${disease.appliesTo}`
                          )}
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
              {t("reportdata.rightEye.header")}
            </Card.Header>

            {/* الصور والعنوان وتاريخ الالتقاط */}
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">{t("reportdata.rightEye.header")}</h5>
                {Report?.eyeExamination?.rightEye?.imageCaptureDate && (
                  <span className="text-muted">
                    {t("reportdata.rightEye.imageCaptureDate")}:{" "}
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
                        alt={`${t("reportdata.rightEye.header")} Image ${
                          idx + 1
                        }`}
                        style={{
                          width: "100%", // أو ممكن تستخدم "auto"
                          height: "auto",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p>{t("reportdata.rightEye.noImages")}</p>
              )}

              {/* Modal for showing full image */}
              <Modal
                show={!!selectedImage}
                onHide={() => setSelectedImage(null)}
                centered
                size="lg"
              >
                <Modal.Header closeButton>
                  <Modal.Title>
                    {t("reportdata.rightEye.imagePreview")}
                  </Modal.Title>
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
                  <strong>{t("reportdata.rightEye.visusCC")}:</strong>{" "}
                  {displayValue(Report?.eyeExamination?.rightEye?.visusCC)}
                </Col>
                <Col>
                  <strong>{t("reportdata.rightEye.previousValue")}:</strong>{" "}
                  {displayValue(
                    Report?.eyeExamination?.rightEye?.previousValue
                  )}
                </Col>
                <Col>
                  <strong>{t("reportdata.rightEye.since")}:</strong>{" "}
                  {displayDate(Report?.eyeExamination?.rightEye?.since)}
                </Col>
              </Row>
              <Row className="mt-2">
                <Col>
                  <strong>{t("reportdata.rightEye.sphere")}:</strong>{" "}
                  {displayValue(Report?.eyeExamination?.rightEye?.sphere)}
                </Col>
                <Col>
                  <strong>{t("reportdata.rightEye.cylinder")}:</strong>{" "}
                  {displayValue(Report?.eyeExamination?.rightEye?.cylinder)}
                </Col>
                <Col>
                  <strong>{t("reportdata.rightEye.axis")}:</strong>{" "}
                  {displayValue(Report?.eyeExamination?.rightEye?.axis)}
                </Col>
              </Row>
              <Row className="mt-2">
                <Col>
                  <strong>
                    {t("reportdata.rightEye.intraocularPressure")}:
                  </strong>{" "}
                  {displayValue(
                    Report?.eyeExamination?.rightEye?.intraocularPressure
                  )}
                </Col>
                <Col>
                  <strong>{t("reportdata.rightEye.cornealThickness")}:</strong>{" "}
                  {displayValue(
                    Report?.eyeExamination?.rightEye?.cornealThickness
                  )}
                </Col>
                <Col>
                  <strong>{t("reportdata.rightEye.chamberAngle")}:</strong>{" "}
                  {Report?.eyeExamination?.rightEye?.chamberAngle ? (
                    t(
                      `reportdata.commonValues.${Report.eyeExamination.rightEye.chamberAngle}`
                    )
                  ) : (
                    <span style={{ color: "red" }}>--</span>
                  )}
                </Col>
              </Row>
              <Row className="mt-2">
                <Col>
                  <strong>
                    {t("reportdata.rightEye.amslerTestAbnormal")}:
                  </strong>{" "}
                  {t(
                    `reportdata.commonValues.${
                      Report?.eyeExamination?.rightEye?.amslerTestAbnormal
                        ? "Yes"
                        : "No"
                    }`
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
                        <p>
                          <strong>{t("reportdata.image_quality")} : </strong>
                          <span
                            style={{
                              color: isImageQualityBad ? "red" : "green",
                            }}
                          >
                            {isImageQualityBad
                              ? t("reportdata.image_quality_bad")
                              : t("reportdata.image_quality_good")}
                          </span>
                        </p>
                        {filteredDiseases.length > 0 ? (
                          <table className="table table-bordered mt-2">
                            <thead>
                              <tr>
                                <th>{t("reportdata.rightEye.disease")}</th>
                                <th>{t("reportdata.rightEye.confidence")}</th>
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
                          <p>{t("reportdata.rightEye.noDiseases")}</p>
                        )}

                        {isImageQualityBad && (
                          <div className="alert alert-warning mt-3">
                            <strong>
                              {t("reportdata.rightEye.badImageQuality")}
                            </strong>
                            <br />
                            Media Opacity due to: Corneal opacity, Cataract,
                            vitreous opacities, vitreous hemorrhage/
                            inflammation, tear film issues, etc. OR Optics
                            misalignment (or insufficient pupillary dilation,
                            focus)
                          </div>
                        )}
                      </>
                    );
                  })()
                ) : (
                  <p>{t("reportdata.rightEye.noPredictionData")}</p>
                )}
              </div>
              {Report?.eyeExamination?.rightEye?.images?.length > 0 &&
                Report?.doctorFeedbacks?.length > 0 && (
                  <>
                    <h5 className="mt-4 text-success no-print">
                      {t("reportdata.doctorFeedback.header")}
                    </h5>

                    <Accordion className="no-print">
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
                              <strong>
                                {t(
                                  "reportdata.doctorFeedback.predictionAccuracy"
                                )}
                                :
                              </strong>{" "}
                              <span
                                className={`badge ${
                                  feedback.rightEyeFeedback
                                    ?.aiPredictionCorrect === "correct"
                                    ? "bg-success"
                                    : "bg-danger"
                                }`}
                              >
                                {feedback.rightEyeFeedback
                                  ?.aiPredictionCorrect || "N/A"}
                              </span>
                            </p>
                            <p>
                              <strong>
                                {t("reportdata.doctorFeedback.comment")}:
                              </strong>{" "}
                              {feedback.rightEyeFeedback?.comment ||
                                t("reportdata.doctorFeedback.noComment")}
                            </p>
                            <p>
                              <strong>
                                {t("reportdata.doctorFeedback.diagnosis")}:
                              </strong>{" "}
                              {feedback.rightEyeFeedback?.diagnosis || "N/A"}
                            </p>
                            <p>
                              <strong>
                                {t(
                                  "reportdata.doctorFeedback.recommendedAction"
                                )}
                                :
                              </strong>{" "}
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
              {t("reportdata.leftEye.header")}
            </Card.Header>

            {/* الصور والعنوان وتاريخ الالتقاط */}
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">{t("reportdata.leftEye.header")}</h5>
                {Report?.eyeExamination?.leftEye?.imageCaptureDate && (
                  <span className="text-muted">
                    {t("reportdata.rightEye.imageCaptureDate")}:{" "}
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
                        alt={`${t("reportdata.leftEye.header")} Image ${
                          idx + 1
                        }`}
                        style={{
                          width: "100%", // أو ممكن تستخدم "auto"
                          height: "auto",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p>{t("reportdata.rightEye.noImages")}</p>
              )}

              {/* Modal for showing full image */}
              <Modal
                show={!!selectedImage}
                onHide={() => setSelectedImage(null)}
                centered
                size="lg"
              >
                <Modal.Header closeButton>
                  <Modal.Title>
                    {t("reportdata.rightEye.imagePreview")}
                  </Modal.Title>
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
                  <strong>{t("reportdata.rightEye.visusCC")}:</strong>{" "}
                  {displayValue(Report?.eyeExamination?.leftEye?.visusCC)}
                </Col>
                <Col>
                  <strong>{t("reportdata.rightEye.previousValue")}:</strong>{" "}
                  {displayValue(Report?.eyeExamination?.leftEye?.previousValue)}
                </Col>
                <Col>
                  <strong>{t("reportdata.rightEye.since")}:</strong>{" "}
                  {displayDate(Report?.eyeExamination?.leftEye?.since)}
                </Col>
              </Row>
              <Row className="mt-2">
                <Col>
                  <strong>{t("reportdata.rightEye.sphere")}:</strong>{" "}
                  {displayValue(Report?.eyeExamination?.leftEye?.sphere)}
                </Col>
                <Col>
                  <strong>{t("reportdata.rightEye.cylinder")}:</strong>{" "}
                  {displayValue(Report?.eyeExamination?.leftEye?.cylinder)}
                </Col>
                <Col>
                  <strong>{t("reportdata.rightEye.axis")}:</strong>{" "}
                  {displayValue(Report?.eyeExamination?.leftEye?.axis)}
                </Col>
              </Row>
              <Row className="mt-2">
                <Col>
                  <strong>
                    {t("reportdata.rightEye.intraocularPressure")}:
                  </strong>{" "}
                  {displayValue(
                    Report?.eyeExamination?.leftEye?.intraocularPressure
                  )}
                </Col>
                <Col>
                  <strong>{t("reportdata.rightEye.cornealThickness")}:</strong>{" "}
                  {displayValue(
                    Report?.eyeExamination?.leftEye?.cornealThickness
                  )}
                </Col>
                <Col>
                  <strong>{t("reportdata.rightEye.chamberAngle")}:</strong>{" "}
                  {Report?.eyeExamination?.leftEye?.chamberAngle ? (
                    t(
                      `reportdata.commonValues.${Report.eyeExamination.leftEye.chamberAngle}`
                    )
                  ) : (
                    <span style={{ color: "red" }}>--</span>
                  )}
                </Col>
              </Row>
              <Row className="mt-2">
                <Col>
                  <strong>
                    {t("reportdata.rightEye.amslerTestAbnormal")}:
                  </strong>{" "}
                  {t(
                    `reportdata.commonValues.${
                      Report?.eyeExamination?.leftEye?.amslerTestAbnormal
                        ? "Yes"
                        : "No"
                    }`
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
                        <p>
                          <strong>{t("reportdata.image_quality")} : </strong>
                          <span
                            style={{
                              color: isImageQualityBad ? "red" : "green",
                            }}
                          >
                            {isImageQualityBad
                              ? t("reportdata.image_quality_bad")
                              : t("reportdata.image_quality_good")}
                          </span>
                        </p>
                        {filteredDiseases.length > 0 ? (
                          <table className="table table-bordered mt-2">
                            <thead>
                              <tr>
                                <th>{t("reportdata.rightEye.disease")}</th>
                                <th>{t("reportdata.rightEye.confidence")}</th>
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
                          <p>{t("reportdata.leftEye.noDiseases")}</p>
                        )}

                        {isImageQualityBad && (
                          <div className="alert alert-warning mt-3">
                            <strong>
                              {t("reportdata.rightEye.badImageQuality")}
                            </strong>
                            <br />
                            Media Opacity due to: Corneal opacity, Cataract,
                            vitreous opacities, vitreous hemorrhage/
                            inflammation, tear film issues, etc. OR Optics
                            misalignment (or insufficient pupillary dilation,
                            focus)
                          </div>
                        )}
                      </>
                    );
                  })()
                ) : (
                  <p>{t("reportdata.leftEye.noPredictionData")}</p>
                )}
              </div>
              {Report?.eyeExamination?.leftEye?.images?.length > 0 &&
                Report?.doctorFeedbacks?.length > 0 && (
                  <>
                    <h5 className="mt-4 text-success no-print">
                      {t("reportdata.doctorFeedback.header")}
                    </h5>

                    <Accordion className="no-print">
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
                              <strong>
                                {t(
                                  "reportdata.doctorFeedback.predictionAccuracy"
                                )}
                              </strong>{" "}
                              <span
                                className={`badge ${
                                  feedback.leftEyeFeedback
                                    ?.aiPredictionCorrect === "correct"
                                    ? "bg-success"
                                    : "bg-danger"
                                }`}
                              >
                                {feedback.leftEyeFeedback
                                  ?.aiPredictionCorrect || "N/A"}
                              </span>
                            </p>
                            <p>
                              <strong>
                                {t("reportdata.doctorFeedback.comment")}:
                              </strong>{" "}
                              {feedback.leftEyeFeedback?.comment ||
                                t("reportdata.doctorFeedback.noComment")}
                            </p>
                            <p>
                              <strong>
                                {t("reportdata.doctorFeedback.diagnosis")}:
                              </strong>{" "}
                              {feedback.leftEyeFeedback?.diagnosis || "N/A"}
                            </p>
                            <p>
                              <strong>
                                {t(
                                  "reportdata.doctorFeedback.recommendedAction"
                                )}
                                :
                              </strong>{" "}
                              {feedback.leftEyeFeedback?.recommendedAction ||
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

          <div className="d-flex justify-content-center mt-4 gap-3">
            {userFromStorage?.role !== "doctor" && (
              <Button
                onClick={() => navigate(`/DoctorCard/${Report?.patient?._id}`)}
                variant="primary"
                className="no-print"
              >
                {t("reportdata.buttons.referToDoctor")}
              </Button>
            )}

            <Button onClick={handlePrint} variant="danger" className="no-print">
              {t("reportdata.buttons.downloadReport")}
            </Button>
          </div>
          <div className="d-flex justify-content-end mt-4">
            <span style={{ fontStyle: "italic" }}>
              {" "}
              {t("reportdata.optician")}: {opticianName}
            </span>
          </div>
        </Container>

        <Footer />
      </div>
    </>
  );
};

export default PatientReport;
