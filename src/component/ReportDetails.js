import React, { Fragment } from "react";
import MultiImageInputCustom from "../component/MultiImageInputCustom";
import Barcode from "react-barcode";
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
    rightAmslerTest,
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
    leftAmslerTest,
    HandelSendingData,
    ispress,
    loading,
    handleAddEyeDisease,
    onChangeMedicalDisease,
    onChangeLeftAmslerTest,
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
    onChangeRightAmslerTest,
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
    RightDic,
    onChangeRightDic,
    LeftDic,
    onChangeLeftDic,
    rightFileNames,
    setRightFileNames,
    leftFileNames,
    setLeftFileNames,
    newMedicalMedication,
    setNewMedicalMedication,
    newEyeMedication,
    setNewEyeMedication,
    handleAddMedicalMedication,
    handleRemoveMedicalMedication,
    handleAddEyeMedication,
    handleRemoveEyeMedication,
    medicalMedications,
    eyeMedications,
    nextVisitDate,
    onChangeNextVisitDate,
  ] = ReportDetails_Hook();

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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
                  {patient?.firstName || patient?.lastName ? (
                    `${patient?.firstName || ""} ${patient?.lastName || ""}`
                  ) : (
                    <span style={{ color: "red" }}>---</span>
                  )}
                </span>
              </div>
              <div className="patient-info-block">
                <span className="patient-label">
                  {t("reportForm.patientInfo.labels.salutation")}
                </span>
                <span className="patient-data">
                  {patient?.salutation ? (
                    patient.salutation
                  ) : (
                    <span style={{ color: "red" }}>---</span>
                  )}
                </span>
              </div>
              <div className="patient-info-block">
                <span className="patient-label">
                  {t("reportForm.patientInfo.labels.dateOfBirth")}
                </span>
                <span className="patient-data">
                  {patient?.dateOfBirth ? (
                    new Date(patient.dateOfBirth).toLocaleDateString("de-DE")
                  ) : (
                    <span style={{ color: "red" }}>---</span>
                  )}
                </span>
              </div>
              <div className="patient-info-block">
                <span className="patient-label">
                  {t("reportForm.patientInfo.labels.ethnicity")}
                </span>
                <span className="patient-data">
                  {patient?.ethnicity ? (
                    patient.ethnicity
                  ) : (
                    <span style={{ color: "red" }}>---</span>
                  )}
                </span>
              </div>
              <div className="patient-info-block">
                <span className="patient-label">
                  {t("reportForm.patientInfo.labels.patientId")}
                </span>
                <span
                  className="patient-data"
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  {patient?.patientId ? (
                    <>
                      <div style={{ marginTop: "10px" }}>
                        <Barcode
                          value={patient.patientId.toString()}
                          height={50}
                          width={2}
                          fontSize={14}
                        />
                      </div>
                    </>
                  ) : (
                    <span style={{ color: "red" }}>---</span>
                  )}
                </span>
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
            {/* ================= Medical Tab ================= */}
            <Tab eventKey="medical" title={t("reportForm.tabs.medical")}>
              <Form>
                {allMedicalDiseases.map((disease, index) => {
                  const existing =
                    historyData.medical.find((item) => item.name === disease) ||
                    {};
                  return (
                    <React.Fragment key={index}>
                      <Row className="mb-2 align-items-center">
                        <Col md={4}>
                          <Form.Label>
                            {t(
                              `reportForm.medicalHistory.diseases.${disease
                                .toLowerCase()
                                .replace(/[\s.]/g, "")}`,
                              { defaultValue: disease },
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
                                e.target.checked,
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
                                e.target.checked ? "Self" : null,
                              )
                            }
                          />
                        </Col>
                        <Col>
                          <Form.Check
                            type="checkbox"
                            label={t(
                              "reportForm.medicalHistory.labels.inFamily",
                            )}
                            checked={existing.appliesTo === "In Family"}
                            onChange={(e) =>
                              updateMedicalData(
                                disease,
                                "appliesTo",
                                e.target.checked ? "In Family" : null,
                              )
                            }
                          />
                        </Col>
                      </Row>

                      {disease === "Diabetes M." &&
                        existing.hasCondition &&
                        existing.appliesTo === "Self" && (
                          <Row className="mb-3 ps-4">
                            <Col md={6}>
                              <Form.Label>
                                {t(
                                  "reportForm.medicalHistory.diabetes.sinceWhen",
                                )}
                              </Form.Label>
                              <Form.Control
                                type="date"
                                value={existing?.sinceWhen || ""}
                                onChange={(e) =>
                                  updateMedicalData(
                                    "Diabetes M.",
                                    "sinceWhen",
                                    e.target.value,
                                  )
                                }
                              />
                            </Col>
                            <Col md={6}>
                              <Form.Label>
                                {t(
                                  "reportForm.medicalHistory.diabetes.hba1cValue",
                                )}
                              </Form.Label>
                              <Form.Control
                                type="number"
                                step="0.1"
                                min="4"
                                max="15"
                                value={existing?.hba1cValue || ""}
                                onChange={(e) =>
                                  updateMedicalData(
                                    "Diabetes M.",
                                    "hba1cValue",
                                    e.target.value,
                                  )
                                }
                              />
                            </Col>
                            <Col md={6} className="mt-2">
                              <Form.Label>
                                {t(
                                  "reportForm.medicalHistory.diabetes.hba1cDate",
                                )}
                              </Form.Label>
                              <Form.Control
                                type="date"
                                value={existing?.hba1cDate || ""}
                                onChange={(e) =>
                                  updateMedicalData(
                                    "Diabetes M.",
                                    "hba1cDate",
                                    e.target.value,
                                  )
                                }
                              />
                            </Col>
                            <Col md={6} className="mt-2">
                              <Form.Label>
                                {t(
                                  "reportForm.medicalHistory.diabetes.treatment",
                                )}
                              </Form.Label>
                              <Form.Select
                                value={existing?.diabetesTreatment || ""}
                                onChange={(e) =>
                                  updateMedicalData(
                                    "Diabetes M.",
                                    "diabetesTreatment",
                                    e.target.value,
                                  )
                                }
                              >
                                <option value="">
                                  {t(
                                    "reportForm.medicalHistory.diabetes.selectTreatment",
                                  )}
                                </option>
                                <option value="tablets">
                                  {t(
                                    "reportForm.medicalHistory.diabetes.treatments.tablets",
                                  )}
                                </option>
                                <option value="insulin">
                                  {t(
                                    "reportForm.medicalHistory.diabetes.treatments.insulin",
                                  )}
                                </option>
                                <option value="weeklySemaglutide">
                                  {t(
                                    "reportForm.medicalHistory.diabetes.treatments.weeklySemaglutide",
                                  )}
                                </option>
                                <option value="other">
                                  {t(
                                    "reportForm.medicalHistory.diabetes.treatments.other",
                                  )}
                                </option>
                              </Form.Select>
                            </Col>
                          </Row>
                        )}
                    </React.Fragment>
                  );
                })}

                {/* إضافة مرض طبى جديد */}
                <Row className="mt-3">
                  <Col md={6}>
                    <Form.Control
                      placeholder={t(
                        "reportForm.medicalHistory.placeholders.newDisease",
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

                <hr className="my-4" />

                {/* 🟢 🟢 قسم العلاجات الطبية العامة (Systemic Medications) 🟢 🟢 */}
                <div className="mt-3">
                  <h5>{t("reportForm.medicalHistory.medications.title")}</h5>
                  <p className="text-muted small">
                    {t("reportForm.medicalHistory.medications.subtitle")}
                  </p>

                  {/* قائمة الأدوية المضافة */}
                  {medicalMedications.map((med, idx) => (
                    <div
                      key={idx}
                      className="d-flex align-items-center mb-2 gap-2"
                    >
                      <span className="badge bg-secondary p-2">{med.name}</span>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoveMedicalMedication(idx)}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}

                  {/* مدخل إضافة دوا جديد */}
                  <Row className="mt-2">
                    <Col md={6}>
                      <Form.Control
                        placeholder={t(
                          "reportForm.medicalHistory.medications.placeholder",
                        )}
                        value={newMedicalMedication}
                        onChange={(e) =>
                          setNewMedicalMedication(e.target.value)
                        }
                      />
                    </Col>
                    <Col md={4}>
                      <Button
                        variant="outline-primary"
                        onClick={handleAddMedicalMedication}
                      >
                        {t("reportForm.medicalHistory.medications.addButton")}
                      </Button>
                    </Col>
                  </Row>
                </div>

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

            {/* ================= Eye Tab ================= */}
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
                            { defaultValue: disease },
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
                              e.target.checked,
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
                              e.target.checked ? "Self" : null,
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
                              e.target.checked ? "In Family" : null,
                            )
                          }
                        />
                      </Col>
                    </Row>
                  );
                })}

                {/* إضافة مرض عيون جديد */}
                <Row className="mt-3">
                  <Col md={6}>
                    <Form.Control
                      placeholder={t(
                        "reportForm.eyeHistory.placeholders.newDisease",
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

                <hr className="my-4" />

                {/* 🟢 🟢 قسم علاجات العيون (Eye Medications) 🟢 🟢 */}
                <div className="mt-3">
                  <h5>{t("reportForm.eyeHistory.medications.title")}</h5>
                  <p className="text-muted small">
                    {t("reportForm.eyeHistory.medications.subtitle")}
                  </p>

                  {/* قائمة علاجات العيون المضافة */}
                  {eyeMedications.map((med, idx) => (
                    <div
                      key={idx}
                      className="d-flex align-items-center mb-2 gap-2"
                    >
                      <span className="badge bg-info p-2">{med.name}</span>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoveEyeMedication(idx)}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}

                  {/* مدخل إضافة قطرة/علاج عين جديد */}
                  <Row className="mt-2">
                    <Col md={6}>
                      <Form.Control
                        placeholder={t(
                          "reportForm.eyeHistory.medications.placeholder",
                        )}
                        value={newEyeMedication}
                        onChange={(e) => setNewEyeMedication(e.target.value)}
                      />
                    </Col>
                    <Col md={4}>
                      <Button
                        variant="outline-primary"
                        onClick={handleAddEyeMedication}
                      >
                        {t("reportForm.eyeHistory.medications.addButton")}
                      </Button>
                    </Col>
                  </Row>
                </div>

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
              </Form>
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
                          <span className="text-danger ms-1">*</span>
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

                  <MultiImageInputCustom
                    images={Rightimages}
                    setImages={setRightImages}
                    fileNames={rightFileNames}
                    setFileNames={setRightFileNames}
                    max={8}
                  />
                  <Form.Text className="text-muted">
                    {t("reportForm.eyeExamination.imageNote")}
                  </Form.Text>
                  <Row>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Control
                          type="file"
                          accept=".dcm" // عشان يحدد نوع الملفات DICOM فقط
                          onChange={onChangeRightDic}
                          className="mb-2"
                        />
                        {/* عرض اسم الملف المختار حالياً للتأكيد للمستخدم */}
                        {RightDic && (
                          <div className="text-success small">
                            <i className="fa fa-file-medical me-1"></i>
                            {RightDic.name}
                          </div>
                        )}
                        <Form.Text className="text-muted">
                          {t("reportForm.eyeExamination.dicomNote") ||
                            "Upload DICOM files (.dcm) for professional analysis."}
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>
                          {t(
                            "reportForm.eyeExamination.labels.imageCaptureDate",
                          )}
                        </Form.Label>
                        <div className="d-flex gap-2">
                          <Form.Control
                            type="date"
                            value={rightImageCaptureDate}
                            onChange={onChangeRightImageCaptureDate}
                          />
                          <Button
                            type="button"
                            variant="outline-secondary"
                            onClick={() => {
                              const today = getTodayDate();
                              onChangeRightImageCaptureDate({
                                target: { value: today },
                              });
                            }}
                          >
                            {t("reportForm.eyeExamination.buttons.today")}
                          </Button>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col md={4}>
                      <Form.Label>
                        {t("reportForm.eyeExamination.labels.sphere")}
                        <span className="text-danger ms-1">*</span>
                      </Form.Label>
                      <Form.Control
                        placeholder={t(
                          "reportForm.eyeExamination.placeholders.sphere",
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
                        <span className="text-danger ms-1">*</span>
                      </Form.Label>
                      <Form.Control
                        placeholder={t(
                          "reportForm.eyeExamination.placeholders.cylinder",
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
                        <span className="text-danger ms-1">*</span>
                      </Form.Label>
                      <Form.Control
                        placeholder={t(
                          "reportForm.eyeExamination.placeholders.axis",
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
                          "reportForm.eyeExamination.labels.intraocularPressure",
                        )}
                      </Form.Label>
                      <Form.Select
                        value={rightIntraocularPressure}
                        onChange={onChangeRightIntraocularPressure}
                      >
                        <option value="">
                          {t(
                            "reportForm.eyeExamination.placeholders.intraocularPressure",
                          )}
                        </option>
                        {[...Array(91)].map((_, i) => (
                          <option key={i}>{i}</option>
                        ))}
                        <option>
                          {t(
                            "reportForm.eyeExamination.options.intraocularPressure.notMeasurable",
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
                        min="356"
                        max="700"
                        placeholder={t(
                          "reportForm.eyeExamination.placeholders.cornealThickness",
                        )}
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
                            "reportForm.eyeExamination.placeholders.chamberAngle",
                          )}
                        </option>
                        <option value="Narrow">
                          {t(
                            "reportForm.eyeExamination.options.chamberAngle.narrow",
                          )}
                        </option>
                        <option value="Within Normal Limits">
                          {t(
                            "reportForm.eyeExamination.options.chamberAngle.normal",
                          )}
                        </option>
                        <option value="wide">
                          {t(
                            "reportForm.eyeExamination.options.chamberAngle.wide",
                          )}
                        </option>
                      </Form.Select>
                    </Col>
                  </Row>

                  <div className="mt-2">
                    <Form.Label className="d-block">
                      {t("reportForm.eyeExamination.labels.amslerTest")}
                    </Form.Label>
                    <Form.Check
                      inline
                      type="radio"
                      name="rightAmslerTest"
                      label={t(
                        "reportForm.eyeExamination.options.amslerTest.normal",
                      )}
                      value="normal"
                      checked={rightAmslerTest === "normal"}
                      onChange={onChangeRightAmslerTest}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      name="rightAmslerTest"
                      label={t(
                        "reportForm.eyeExamination.options.amslerTest.abnormal",
                      )}
                      value="abnormal"
                      checked={rightAmslerTest === "abnormal"}
                      onChange={onChangeRightAmslerTest}
                    />
                  </div>
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
                          <span className="text-danger ms-1">*</span>
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
                  <MultiImageInputCustom
                    images={Leftimages}
                    setImages={setLeftImages}
                    fileNames={leftFileNames}
                    setFileNames={setLeftFileNames}
                    max={8}
                  />

                  <Form.Text className="text-muted">
                    {t("reportForm.eyeExamination.imageNote")}
                  </Form.Text>
                  <div className="text-form pb-2 pt-4">
                    {t("reportForm.eyeExamination.labels.uploadDicom", {
                      eye: t("reportForm.tabs.leftEye"),
                    })}
                  </div>

                  <Row>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Control
                          type="file"
                          accept=".dcm" // عشان يحدد نوع الملفات DICOM فقط
                          onChange={onChangeLeftDic}
                          className="mb-2"
                        />
                        {/* عرض اسم الملف المختار حالياً للتأكيد للمستخدم */}
                        {LeftDic && (
                          <div className="text-success small">
                            <i className="fa fa-file-medical me-1"></i>
                            {LeftDic.name}
                          </div>
                        )}
                        <Form.Text className="text-muted">
                          {t("reportForm.eyeExamination.dicomNote") ||
                            "Upload DICOM files (.dcm) for professional analysis."}
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>
                          {t(
                            "reportForm.eyeExamination.labels.imageCaptureDate",
                          )}
                        </Form.Label>
                        <div className="d-flex gap-2">
                          <Form.Control
                            type="date"
                            value={leftImageCaptureDate}
                            onChange={onChangeLeftImageCaptureDate}
                          />
                          <Button
                            type="button"
                            variant="outline-secondary"
                            onClick={() => {
                              const today = getTodayDate();
                              onChangeLeftImageCaptureDate({
                                target: { value: today },
                              });
                            }}
                          >
                            {t("reportForm.eyeExamination.buttons.today")}
                          </Button>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md={4}>
                      <Form.Label>
                        {t("reportForm.eyeExamination.labels.sphere")}
                        <span className="text-danger ms-1">*</span>
                      </Form.Label>
                      <Form.Control
                        placeholder={t(
                          "reportForm.eyeExamination.placeholders.sphere",
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
                        <span className="text-danger ms-1">*</span>
                      </Form.Label>
                      <Form.Control
                        placeholder={t(
                          "reportForm.eyeExamination.placeholders.cylinder",
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
                        <span className="text-danger ms-1">*</span>
                      </Form.Label>
                      <Form.Control
                        placeholder={t(
                          "reportForm.eyeExamination.placeholders.axis",
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
                          "reportForm.eyeExamination.labels.intraocularPressure",
                        )}
                      </Form.Label>
                      <Form.Select
                        value={leftIntraocularPressure}
                        onChange={onChangeLeftIntraocularPressure}
                      >
                        <option value="">
                          {t(
                            "reportForm.eyeExamination.placeholders.intraocularPressure",
                          )}
                        </option>
                        {[...Array(91)].map((_, i) => (
                          <option key={i}>{i}</option>
                        ))}
                        <option>
                          {t(
                            "reportForm.eyeExamination.options.intraocularPressure.notMeasurable",
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
                        min="356"
                        max="700"
                        placeholder={t(
                          "reportForm.eyeExamination.placeholders.cornealThickness",
                        )}
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
                            "reportForm.eyeExamination.placeholders.chamberAngle",
                          )}
                        </option>
                        <option value="Narrow">
                          {t(
                            "reportForm.eyeExamination.options.chamberAngle.narrow",
                          )}
                        </option>
                        <option value="Within Normal Limits">
                          {t(
                            "reportForm.eyeExamination.options.chamberAngle.normal",
                          )}
                        </option>
                        <option value="wide">
                          {t(
                            "reportForm.eyeExamination.options.chamberAngle.wide",
                          )}
                        </option>
                      </Form.Select>
                    </Col>
                  </Row>

                  <div className="mt-2">
                    <Form.Label className="d-block">
                      {t("reportForm.eyeExamination.labels.amslerTest")}
                    </Form.Label>
                    <Form.Check
                      inline
                      type="radio"
                      name="leftAmslerTest"
                      label={t(
                        "reportForm.eyeExamination.options.amslerTest.normal",
                      )}
                      value="normal"
                      checked={leftAmslerTest === "normal"}
                      onChange={onChangeLeftAmslerTest}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      name="leftAmslerTest"
                      label={t(
                        "reportForm.eyeExamination.options.amslerTest.abnormal",
                      )}
                      value="abnormal"
                      checked={leftAmslerTest === "abnormal"}
                      onChange={onChangeLeftAmslerTest}
                    />
                  </div>
                </Card.Body>
              </Card>
              {/* 🟢 ميعاد الزيارة القادمة - خاص بالتقرير مش بعين معينة */}
              <Card className="mb-4">
                <Card.Body>
                  <h5 className="mb-3">
                    {t("reportForm.nextVisit.title", "Next Visit")}
                  </h5>
                  <Row>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>
                          {t("reportForm.nextVisit.label", "Next visit date")}
                        </Form.Label>
                        <Form.Control
                          type="date"
                          value={nextVisitDate}
                          onChange={onChangeNextVisitDate}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
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
