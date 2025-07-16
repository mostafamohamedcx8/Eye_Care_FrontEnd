import MultiImageInput from "react-multiple-image-input";
import {
  Container,
  Tabs,
  Tab,
  Form,
  Row,
  Col,
  Card,
  Button,
  Spinner,
} from "react-bootstrap";
import {
  validateEyeHistory,
  validateMedicalHistory,
  validateRightEyeSection,
} from "../Validations/reportValidation";
import { useTranslation } from "react-i18next";
import { ReportDetails_Hook } from "../Hook/ReportDetails_Hook";

const ReportDetails = () => {
  const { t } = useTranslation();
  const [
    patient,
    activeTab,
    handleOuterTabSelect,
    innerTab,
    handleInnerTabSelect,
    allMedicalDiseases,
    historyData,
    updateMedicalData,
    newMedicalDisease,
    handleAddMedicalDisease,
    setInnerTab,
    eyeDiseases,
    newEyeDisease,
    setActiveTab,
    rightVisusCC,
    rightPreviousValue,
    rightSince,
    Rightimages,
    setRightImages,
    crop,
    rightImageCaptureDate,
    rightSphere,
    rightCylinder,
    rightAxis,
    rightIntraocularPressure,
    rightCornealThickness,
    rightChamberAngle,
    rightAmslerTestAbnormal,
    rightEyeData,
    leftVisusCC,
    leftPreviousValue,
    leftSince,
    Leftimages,
    setLeftImages,
    leftImageCaptureDate,
    leftSphere,
    leftCylinder,
    leftAxis,
    leftIntraocularPressure,
    leftCornealThickness,
    leftChamberAngle,
    leftAmslerTestAbnormal,
    HandelSendingData,
    ispress,
    loading,
    handleAddEyeDisease,
    onChangeMedicalDisease,
    onChangeLeftAmslerTestAbnormal,
    onChangeLeftAxis,
    onChangeLeftChamberAngle,
    onChangeLeftCylinder,
    onChangeLeftVisusCC,
    onChangeLeftSphere,
    onChangeLeftSince,
    onChangeLeftPreviousValue,
    onChangeLeftIntraocularPressure,
    onChangeEyeDisease,
    onChangeRightIntraocularPressure,
    onChangeLeftCornealThickness,
    onChangeLeftImageCaptureDate,
    onChangeRightAmslerTestAbnormal,
    onChangeRightChamberAngle,
    onChangeRightCornealThickness,
    onChangeRightAxis,
    onChangeRightCylinder,
    onChangeRightSphere,
    onChangeRightImageCaptureDate,
    onChangeRightSince,
    onChangeRightPreviousValue,
    onChangeRightVisusCC,
    updateEyeData,
  ] = ReportDetails_Hook();

  return (
    <Container className="mt-5 mb-5">
      <h2 className="text-center mb-4 fw-bold button-color">
        {t("reportForm.title")}{" "}
      </h2>
      {patient && (
        <Card className="mb-4">
          <Card.Body>
            <h5 className="text-center mb-4">
              {t("reportForm.patientInfo.title")}
            </h5>
            <div className="patient-data-container">
              <div className="patient-info-block">
                <span className="patient-label">
                  {t("reportForm.patientInfo.labels.name")}
                </span>
                <span className="patient-data">
                  {patient?.data?.firstname} {patient?.data?.lastname}
                </span>
              </div>
              <div className="patient-info-block">
                <span className="patient-label">
                  {t("reportForm.patientInfo.labels.salutation")}
                </span>
                <span className="patient-data">
                  {patient?.data?.salutation}
                </span>
              </div>
              <div className="patient-info-block">
                <span className="patient-label">
                  {t("reportForm.patientInfo.labels.dateOfBirth")}
                </span>
                <span className="patient-data">
                  {new Date(patient?.data?.dateOfBirth).toLocaleDateString(
                    "de-DE"
                  )}
                </span>
              </div>
              <div className="patient-info-block">
                <span className="patient-label">
                  {t("reportForm.patientInfo.labels.ethnicity")}
                </span>
                <span className="patient-data">{patient?.data?.ethnicity}</span>
              </div>
              <div className="patient-info-block">
                <span className="patient-label">
                  {t("reportForm.patientInfo.labels.patientId")}
                </span>
                <span className="patient-data">{patient?.data?._id}</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      <Tabs
        activeKey={activeTab}
        onSelect={handleOuterTabSelect}
        className="mb-3"
      >
        <Tab eventKey="history" title={t("reportForm.tabs.history")}>
          <Tabs
            activeKey={innerTab}
            onSelect={handleInnerTabSelect}
            className="mb-3"
          >
            <Tab eventKey="medical" title={t("reportForm.tabs.medical")}>
              <Form>
                {allMedicalDiseases.map((disease, index) => {
                  const existing =
                    historyData.medical.find((item) => item.name === disease) ||
                    {};
                  return (
                    <Row key={index} className="mb-2 align-items-center">
                      <Col md={4}>
                        <Form.Label>
                          {t(
                            `reportForm.medicalHistory.diseases.${disease
                              .toLowerCase()
                              .replace(/[\s.]/g, "")}`,
                            { defaultValue: disease }
                          )}
                        </Form.Label>
                      </Col>
                      <Col>
                        <Form.Check
                          type="checkbox"
                          label={t("reportForm.medicalHistory.labels.yes")}
                          checked={existing.hasCondition || false}
                          onChange={(e) =>
                            updateMedicalData(
                              disease,
                              "hasCondition",
                              e.target.checked
                            )
                          }
                        />
                      </Col>
                      <Col>
                        <Form.Check
                          type="checkbox"
                          label={t("reportForm.medicalHistory.labels.self")}
                          checked={existing.appliesTo === "Self"}
                          onChange={(e) =>
                            updateMedicalData(
                              disease,
                              "appliesTo",
                              e.target.checked ? "Self" : null
                            )
                          }
                        />
                      </Col>
                      <Col>
                        <Form.Check
                          type="checkbox"
                          label={t("reportForm.medicalHistory.labels.inFamily")}
                          checked={existing.appliesTo === "In Family"}
                          onChange={(e) =>
                            updateMedicalData(
                              disease,
                              "appliesTo",
                              e.target.checked ? "In Family" : null
                            )
                          }
                        />
                      </Col>
                    </Row>
                  );
                })}
                <Row className="mt-3">
                  <Col md={6}>
                    <Form.Control
                      placeholder={t(
                        "reportForm.medicalHistory.placeholders.newDisease"
                      )}
                      value={newMedicalDisease}
                      onChange={onChangeMedicalDisease}
                    />
                  </Col>
                  <Col>
                    <Button onClick={handleAddMedicalDisease}>
                      {t("reportForm.medicalHistory.buttons.addDisease")}
                    </Button>
                  </Col>
                </Row>
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={() => {
                    const isValid = validateMedicalHistory(historyData);
                    if (isValid) {
                      setInnerTab("eye");
                    }
                  }}
                >
                  {t("reportForm.medicalHistory.buttons.next")}
                </Button>
              </Form>
            </Tab>

            <Tab eventKey="eye" title={t("reportForm.tabs.eye")}>
              <Form>
                {eyeDiseases.map((disease, index) => {
                  const existing =
                    historyData.eye.find((item) => item.name === disease) || {};
                  return (
                    <Row key={index} className="mb-2 align-items-center">
                      <Col md={4}>
                        <Form.Label>
                          {t(
                            `reportForm.eyeHistory.diseases.${disease
                              .toLowerCase()
                              .replace(/[\s-]/g, "")}`,
                            { defaultValue: disease }
                          )}
                        </Form.Label>
                      </Col>
                      <Col>
                        <Form.Check
                          type="checkbox"
                          label={t("reportForm.eyeHistory.labels.yes")}
                          checked={existing.hasCondition || false}
                          onChange={(e) =>
                            updateEyeData(
                              disease,
                              "hasCondition",
                              e.target.checked
                            )
                          }
                        />
                      </Col>
                      <Col>
                        <Form.Check
                          type="checkbox"
                          label={t("reportForm.eyeHistory.labels.self")}
                          checked={existing.appliesTo === "Self"}
                          onChange={(e) =>
                            updateEyeData(
                              disease,
                              "appliesTo",
                              e.target.checked ? "Self" : null
                            )
                          }
                        />
                      </Col>
                      <Col>
                        <Form.Check
                          type="checkbox"
                          label={t("reportForm.eyeHistory.labels.inFamily")}
                          checked={existing.appliesTo === "In Family"}
                          onChange={(e) =>
                            updateEyeData(
                              disease,
                              "appliesTo",
                              e.target.checked ? "In Family" : null
                            )
                          }
                        />
                      </Col>
                    </Row>
                  );
                })}

                <Row className="mt-3">
                  <Col md={6}>
                    <Form.Control
                      placeholder={t(
                        "reportForm.eyeHistory.placeholders.newDisease"
                      )}
                      value={newEyeDisease}
                      onChange={onChangeEyeDisease}
                    />
                  </Col>
                  <Col>
                    <Button onClick={handleAddEyeDisease}>
                      {t("reportForm.eyeHistory.buttons.addDisease")}
                    </Button>
                  </Col>
                </Row>
              </Form>

              <Button
                className="mt-4"
                variant="primary"
                onClick={() => {
                  const isValid = validateEyeHistory(historyData);
                  if (isValid) {
                    setActiveTab("exam");
                    setInnerTab("rightEye");
                  }
                }}
              >
                {t("reportForm.eyeHistory.buttons.next")}
              </Button>
            </Tab>
          </Tabs>
        </Tab>

        <Tab eventKey="exam" title={t("reportForm.tabs.eyeExamination")}>
          <Tabs
            activeKey={innerTab}
            onSelect={handleInnerTabSelect}
            className="mb-3"
          >
            {/* Right Eye Card */}
            <Tab eventKey="rightEye" title={t("reportForm.tabs.rightEye")}>
              <Card className="mb-4">
                <Card.Body>
                  <h5 className="mb-3">{t("reportForm.tabs.rightEye")}</h5>

                  <Row>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>
                          {t("reportForm.eyeExamination.labels.visusCC")}{" "}
                          <span className="text-muted">
                            {t("reportForm.eyeExamination.labels.visusDecimal")}
                          </span>
                        </Form.Label>
                        <Form.Select
                          value={rightVisusCC}
                          onChange={onChangeRightVisusCC}
                        >
                          <option value="">
                            {t("reportForm.eyeExamination.placeholders.visus")}
                          </option>
                          {t("reportForm.eyeExamination.options.visus", {
                            returnObjects: true,
                          }).map((option, index) => (
                            <option key={index}>{option}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>
                          {t("reportForm.eyeExamination.labels.previousValue")}{" "}
                          <span className="text-muted">
                            {t("reportForm.eyeExamination.labels.visusDecimal")}
                          </span>
                        </Form.Label>
                        <Form.Select
                          value={rightPreviousValue}
                          onChange={onChangeRightPreviousValue}
                        >
                          <option value="">
                            {t("reportForm.eyeExamination.placeholders.visus")}
                          </option>
                          {t("reportForm.eyeExamination.options.visus", {
                            returnObjects: true,
                          }).map((option, index) => (
                            <option key={index}>{option}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>
                          {t("reportForm.eyeExamination.labels.since")}
                        </Form.Label>
                        <Form.Control
                          type="date"
                          value={rightSince}
                          onChange={onChangeRightSince}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="text-form pb-2 pt-2">
                    {t("reportForm.eyeExamination.labels.uploadImages", {
                      eye: t("reportForm.tabs.rightEye"),
                    })}
                  </div>

                  <MultiImageInput
                    className="multi-image-input__image"
                    images={Rightimages}
                    setImages={setRightImages}
                    theme={"light"}
                    max={8}
                    cropConfig={{ crop, ruleOfThirds: true }}
                  />
                  <Form.Text className="text-muted">
                    {t("reportForm.eyeExamination.imageNote")}
                  </Form.Text>
                  <Row className="mt-3">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>
                          {t(
                            "reportForm.eyeExamination.labels.imageCaptureDate"
                          )}
                        </Form.Label>
                        <Form.Control
                          type="date"
                          value={rightImageCaptureDate}
                          onChange={onChangeRightImageCaptureDate}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col md={4}>
                      <Form.Label>
                        {t("reportForm.eyeExamination.labels.sphere")}
                      </Form.Label>
                      <Form.Control
                        placeholder={t(
                          "reportForm.eyeExamination.placeholders.sphere"
                        )}
                        type="number"
                        step="0.25"
                        min="-25.0"
                        max="25.0"
                        value={rightSphere}
                        onChange={onChangeRightSphere}
                      />
                    </Col>
                    <Col md={4}>
                      <Form.Label>
                        {t("reportForm.eyeExamination.labels.cylinder")}
                      </Form.Label>
                      <Form.Control
                        placeholder={t(
                          "reportForm.eyeExamination.placeholders.cylinder"
                        )}
                        type="number"
                        step="0.25"
                        value={rightCylinder}
                        onChange={onChangeRightCylinder}
                      />
                    </Col>
                    <Col md={4}>
                      <Form.Label>
                        {t("reportForm.eyeExamination.labels.axis")}
                      </Form.Label>
                      <Form.Control
                        placeholder={t(
                          "reportForm.eyeExamination.placeholders.axis"
                        )}
                        type="number"
                        min="0"
                        max="180"
                        value={rightAxis}
                        onChange={onChangeRightAxis}
                      />
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col>
                      <Form.Label>
                        {t(
                          "reportForm.eyeExamination.labels.intraocularPressure"
                        )}
                      </Form.Label>
                      <Form.Select
                        value={rightIntraocularPressure}
                        onChange={onChangeRightIntraocularPressure}
                      >
                        <option value="">
                          {t(
                            "reportForm.eyeExamination.placeholders.intraocularPressure"
                          )}
                        </option>
                        {[...Array(91)].map((_, i) => (
                          <option key={i}>{i}</option>
                        ))}
                        <option>
                          {t(
                            "reportForm.eyeExamination.options.intraocularPressure.notMeasurable"
                          )}
                        </option>
                      </Form.Select>
                    </Col>
                    <Col>
                      <Form.Label>
                        {t("reportForm.eyeExamination.labels.cornealThickness")}
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={rightCornealThickness}
                        onChange={onChangeRightCornealThickness}
                      />
                    </Col>
                    <Col>
                      <Form.Label>
                        {t("reportForm.eyeExamination.labels.chamberAngle")}
                      </Form.Label>
                      <Form.Select
                        value={rightChamberAngle}
                        onChange={onChangeRightChamberAngle}
                      >
                        <option value="">
                          {t(
                            "reportForm.eyeExamination.placeholders.chamberAngle"
                          )}
                        </option>
                        <option value="Narrow">
                          {t(
                            "reportForm.eyeExamination.options.chamberAngle.narrow"
                          )}
                        </option>
                        <option value="Within Normal Limits">
                          {t(
                            "reportForm.eyeExamination.options.chamberAngle.normal"
                          )}
                        </option>
                        <option value="wide">
                          {t(
                            "reportForm.eyeExamination.options.chamberAngle.wide"
                          )}
                        </option>
                      </Form.Select>
                    </Col>
                  </Row>

                  <Form.Check
                    className="mt-2"
                    type="checkbox"
                    label={t(
                      "reportForm.eyeExamination.labels.amslerTestAbnormal"
                    )}
                    checked={rightAmslerTestAbnormal}
                    onChange={onChangeRightAmslerTestAbnormal}
                  />
                  <Button
                    variant="primary"
                    className="mt-4"
                    onClick={() => {
                      const isValid = validateRightEyeSection(rightEyeData);
                      if (!isValid) return;
                      setInnerTab("leftEye");
                    }}
                  >
                    {t("reportForm.eyeExamination.buttons.next")}
                  </Button>
                </Card.Body>
              </Card>
            </Tab>
            {/* Left Eye Card */}
            <Tab eventKey="leftEye" title={t("reportForm.tabs.leftEye")}>
              <Card className="mb-4">
                <Card.Body>
                  <h5 className="mb-3">{t("reportForm.tabs.leftEye")}</h5>

                  <Row>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>
                          {t("reportForm.eyeExamination.labels.visusCC")}{" "}
                          <span className="text-muted">
                            {t("reportForm.eyeExamination.labels.visusDecimal")}
                          </span>
                        </Form.Label>
                        <Form.Select
                          value={leftVisusCC}
                          onChange={onChangeLeftVisusCC}
                        >
                          <option value="">
                            {t("reportForm.eyeExamination.placeholders.visus")}
                          </option>
                          {t("reportForm.eyeExamination.options.visus", {
                            returnObjects: true,
                          }).map((option, index) => (
                            <option key={index}>{option}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>
                          {t("reportForm.eyeExamination.labels.previousValue")}{" "}
                          <span className="text-muted">
                            {t("reportForm.eyeExamination.labels.visusDecimal")}
                          </span>
                        </Form.Label>
                        <Form.Select
                          value={leftPreviousValue}
                          onChange={onChangeLeftPreviousValue}
                        >
                          <option value="">
                            {t("reportForm.eyeExamination.placeholders.visus")}
                          </option>
                          {t("reportForm.eyeExamination.options.visus", {
                            returnObjects: true,
                          }).map((option, index) => (
                            <option key={index}>{option}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>
                          {t("reportForm.eyeExamination.labels.since")}
                        </Form.Label>
                        <Form.Control
                          type="date"
                          value={leftSince}
                          onChange={onChangeLeftSince}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="text-form pb-2 pt-2">
                    <div className="text-form pb-2 pt-2">
                      {t("reportForm.eyeExamination.labels.uploadImages", {
                        eye: t("reportForm.tabs.leftEye"),
                      })}
                    </div>
                  </div>

                  <MultiImageInput
                    images={Leftimages}
                    setImages={setLeftImages}
                    theme={"light"}
                    max={8}
                    cropConfig={{ crop, ruleOfThirds: true }}
                  />
                  <Form.Text className="text-muted">
                    {t("reportForm.eyeExamination.imageNote")}
                    diagnosis.
                  </Form.Text>
                  <Row className="mt-3">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>
                          {t(
                            "reportForm.eyeExamination.labels.imageCaptureDate"
                          )}
                        </Form.Label>
                        <Form.Control
                          type="date"
                          value={leftImageCaptureDate}
                          onChange={onChangeLeftImageCaptureDate}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md={4}>
                      <Form.Label>
                        {t("reportForm.eyeExamination.labels.sphere")}
                      </Form.Label>
                      <Form.Control
                        placeholder={t(
                          "reportForm.eyeExamination.placeholders.sphere"
                        )}
                        type="number"
                        step="0.25"
                        min="-25.0"
                        max="25.0"
                        value={leftSphere}
                        onChange={onChangeLeftSphere}
                      />
                    </Col>
                    <Col md={4}>
                      <Form.Label>
                        {t("reportForm.eyeExamination.labels.cylinder")}
                      </Form.Label>
                      <Form.Control
                        placeholder={t(
                          "reportForm.eyeExamination.placeholders.cylinder"
                        )}
                        type="number"
                        step="0.25"
                        value={leftCylinder}
                        onChange={onChangeLeftCylinder}
                      />
                    </Col>
                    <Col md={4}>
                      <Form.Label>
                        {t("reportForm.eyeExamination.labels.axis")}
                      </Form.Label>
                      <Form.Control
                        placeholder={t(
                          "reportForm.eyeExamination.placeholders.axis"
                        )}
                        type="number"
                        min="0"
                        max="180"
                        value={leftAxis}
                        onChange={onChangeLeftAxis}
                      />
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col>
                      <Form.Label>
                        {t(
                          "reportForm.eyeExamination.labels.intraocularPressure"
                        )}
                      </Form.Label>
                      <Form.Select
                        value={leftIntraocularPressure}
                        onChange={onChangeLeftIntraocularPressure}
                      >
                        <option value="">
                          {t(
                            "reportForm.eyeExamination.placeholders.intraocularPressure"
                          )}
                        </option>
                        {[...Array(91)].map((_, i) => (
                          <option key={i}>{i}</option>
                        ))}
                        <option>
                          {t(
                            "reportForm.eyeExamination.options.intraocularPressure.notMeasurable"
                          )}
                        </option>
                      </Form.Select>
                    </Col>
                    <Col>
                      <Form.Label>
                        {t("reportForm.eyeExamination.labels.cornealThickness")}
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={leftCornealThickness}
                        onChange={onChangeLeftCornealThickness}
                      />
                    </Col>
                    <Col>
                      <Form.Label>
                        {t("reportForm.eyeExamination.labels.chamberAngle")}
                      </Form.Label>
                      <Form.Select
                        value={leftChamberAngle}
                        onChange={onChangeLeftChamberAngle}
                      >
                        <option value="">
                          {t(
                            "reportForm.eyeExamination.placeholders.chamberAngle"
                          )}
                        </option>
                        <option value="Narrow">
                          {t(
                            "reportForm.eyeExamination.options.chamberAngle.narrow"
                          )}
                        </option>
                        <option value="Within Normal Limits">
                          {t(
                            "reportForm.eyeExamination.options.chamberAngle.normal"
                          )}
                        </option>
                        <option value="wide">
                          {t(
                            "reportForm.eyeExamination.options.chamberAngle.wide"
                          )}
                        </option>
                      </Form.Select>
                    </Col>
                  </Row>

                  <Form.Check
                    className="mt-2"
                    type="checkbox"
                    label={t(
                      "reportForm.eyeExamination.labels.amslerTestAbnormal"
                    )}
                    checked={leftAmslerTestAbnormal}
                    onChange={onChangeLeftAmslerTestAbnormal}
                  />
                </Card.Body>
              </Card>
              <Button
                variant="primary"
                className="mt-2"
                onClick={HandelSendingData}
              >
                {t("reportForm.eyeExamination.buttons.save")}
              </Button>
            </Tab>
          </Tabs>
        </Tab>
      </Tabs>
      {ispress ? (
        loading ? (
          <Spinner animation="border" variant="primary" />
        ) : (
          <h4> done </h4>
        )
      ) : null}
    </Container>
  );
};

export default ReportDetails;
