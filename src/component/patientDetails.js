import React, { useState } from "react";
import { Button, Container, Row, Col, Form, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { CreatePatient } from "../Redux/actions/Patientaction";
import { validatePatientForm } from "../Validations/patientValidation";
import notify from "../Hook/useNotification";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PatientTab = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [salutation, setSalutation] = useState("");
  const [dateOfBirth, setDob] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  // ✅ optician consent checkbox state (default false)
  const [opticianConsent, setOpticianConsent] = useState(false);

  const removeEmptyFields = (obj) =>
    Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== ""));

  const resetForm = () => {
    setFirstname("");
    setLastname("");
    setSalutation("");
    setDob("");
    setEmail("");
    setEthnicity("");
    setOpticianConsent(false);
  };

  const handelSubmit = async (event) => {
    event.preventDefault();

    const isValid = validatePatientForm({
      firstName,
      lastName,
      salutation,
      dateOfBirth,
      ethnicity,
      email,
    });
    if (!isValid) return;

    // Remove empty string fields, but keep opticianConsent as boolean always
    const patientData = {
      ...removeEmptyFields({
        firstName,
        lastName,
        salutation,
        dateOfBirth,
        ethnicity,
        email,
      }),
      consentFlag: opticianConsent, // always included even if false
    };

    setLoading(true);
    const result = await dispatch(CreatePatient(patientData));
    console.log("CreatePatient result:", result);
    setLoading(false);

    if (result?.status === 201) {
      notify(t("patientForm.notifications.createSuccess"), "success");
      resetForm();
      navigate(`/`);
    } else {
      const msg = result?.data?.message || "Something went wrong";
      notify(msg, "error");
    }
  };

  return (
    <Container className="mt-5 mb-5">
      <h2 className="text-center mb-4 fw-bold button-color">
        {t("patientForm.title")}
      </h2>
      <Form onSubmit={handelSubmit}>
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>{t("patientForm.labels.firstName")}</Form.Label>
              <Form.Control
                placeholder={t("patientForm.placeholders.firstName")}
                onChange={(e) => setFirstname(e.target.value)}
                value={firstName}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>{t("patientForm.labels.lastName")}</Form.Label>
              <Form.Control
                placeholder={t("patientForm.placeholders.lastName")}
                onChange={(e) => setLastname(e.target.value)}
                value={lastName}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>{t("patientForm.labels.salutation")}</Form.Label>
              <Form.Select
                onChange={(e) => setSalutation(e.target.value)}
                value={salutation}
              >
                <option value="" disabled hidden>
                  {t("patientForm.placeholders.salutation")}
                </option>
                <option value="Mr">
                  {t("patientForm.salutationOptions.mr")}
                </option>
                <option value="Mrs">
                  {t("patientForm.salutationOptions.mrs")}
                </option>
                <option value="Ms">
                  {t("patientForm.salutationOptions.ms")}
                </option>
                <option value="Mx">
                  {t("patientForm.salutationOptions.mx")}
                </option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group>
              <Form.Label>
                {t("patientForm.labels.email")}
                {/* Email is optional - no required asterisk */}
              </Form.Label>
              <Form.Control
                type="email"
                placeholder={
                  t("patientForm.placeholders.email") || "Enter patient email"
                }
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                // ✅ removed required - email is now optional
              />
              <Form.Text className="text-muted">
                {t("patientForm.messages.emailHelp") ||
                  "If provided, credentials and consent request will be sent to this email."}
              </Form.Text>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>{t("patientForm.labels.dateOfBirth")}</Form.Label>
              <Form.Control
                type="date"
                onChange={(e) => setDob(e.target.value)}
                value={dateOfBirth}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>{t("patientForm.labels.ethnicity")}</Form.Label>
              <Form.Select
                onChange={(e) => setEthnicity(e.target.value)}
                value={ethnicity}
              >
                <option value="" disabled hidden>
                  {t("patientForm.placeholders.ethnicity")}
                </option>
                <optgroup label={t("patientForm.ethnicityOptions.asian.label")}>
                  <option value="Indian">
                    {t("patientForm.ethnicityOptions.asian.indian")}
                  </option>
                  <option value="Pakistani">
                    {t("patientForm.ethnicityOptions.asian.pakistani")}
                  </option>
                  <option value="Bangladeshi">
                    {t("patientForm.ethnicityOptions.asian.bangladeshi")}
                  </option>
                  <option value="Chinese">
                    {t("patientForm.ethnicityOptions.asian.chinese")}
                  </option>
                  <option value="Any other Asian background">
                    {t("patientForm.ethnicityOptions.asian.other")}
                  </option>
                </optgroup>
                <optgroup label={t("patientForm.ethnicityOptions.black.label")}>
                  <option value="Caribbean">
                    {t("patientForm.ethnicityOptions.black.caribbean")}
                  </option>
                  <option value="African">
                    {t("patientForm.ethnicityOptions.black.african")}
                  </option>
                  <option value="Any other Black, Black British, or Caribbean background">
                    {t("patientForm.ethnicityOptions.black.other")}
                  </option>
                </optgroup>
                <optgroup label={t("patientForm.ethnicityOptions.mixed.label")}>
                  <option value="White and Black Caribbean">
                    {t(
                      "patientForm.ethnicityOptions.mixed.whiteBlackCaribbean",
                    )}
                  </option>
                  <option value="White and Black African">
                    {t("patientForm.ethnicityOptions.mixed.whiteBlackAfrican")}
                  </option>
                  <option value="White and Asian">
                    {t("patientForm.ethnicityOptions.mixed.whiteAsian")}
                  </option>
                  <option value="Any other Mixed or multiple ethnic background">
                    {t("patientForm.ethnicityOptions.mixed.other")}
                  </option>
                </optgroup>
                <optgroup label={t("patientForm.ethnicityOptions.white.label")}>
                  <option value="English, Welsh, Scottish, Northern Irish or British">
                    {t("patientForm.ethnicityOptions.white.british")}
                  </option>
                  <option value="Irish">
                    {t("patientForm.ethnicityOptions.white.irish")}
                  </option>
                  <option value="Gypsy or Irish Traveller">
                    {t("patientForm.ethnicityOptions.white.gypsy")}
                  </option>
                  <option value="Roma">
                    {t("patientForm.ethnicityOptions.white.roma")}
                  </option>
                  <option value="Any other White background">
                    {t("patientForm.ethnicityOptions.white.other")}
                  </option>
                </optgroup>
                <optgroup label={t("patientForm.ethnicityOptions.other.label")}>
                  <option value="Arab">
                    {t("patientForm.ethnicityOptions.other.arab")}
                  </option>
                  <option value="Any other ethnic group">
                    {t("patientForm.ethnicityOptions.other.anyOther")}
                  </option>
                </optgroup>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* ✅ Optician consent checkbox section */}
        <Row className="mt-4">
          <Col>
            <Form.Group>
              <Form.Check
                type="checkbox"
                id="opticianConsent"
                checked={opticianConsent}
                onChange={(e) => setOpticianConsent(e.target.checked)}
                label={
                  <span>
                    {t("patientForm.labels.opticianConsent") ||
                      "Patient has given verbal/written consent for the optician to create reports on their behalf"}
                  </span>
                }
              />
              <Form.Text className="text-muted ms-4">
                {opticianConsent
                  ? // ✅ checkbox is checked
                    t("patientForm.messages.consentGiven") ||
                    "✅ Consent recorded. No email will be sent for consent."
                  : email
                    ? // checkbox not checked but email exists
                      t("patientForm.messages.consentPending") ||
                      "⏳ A consent request will be sent to the patient's email."
                    : // no checkbox, no email
                      t("patientForm.messages.consentMissing") ||
                      "⚠️ No consent recorded. Add an email to send a consent request."}
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  {t("patientForm.buttons.creating") || "Creating..."}
                </>
              ) : (
                t("patientForm.buttons.create")
              )}
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default PatientTab;
