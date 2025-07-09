import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Form, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { CreatePatient } from "../Redux/actions/Patientaction";
import { validatePatientForm } from "../Validations/patientValidation";
import notify from "../Hook/useNotification";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
const PatientTab = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const res = useSelector((state) => state.allpatient.patient);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [salutation, setSalutation] = useState("");
  const [dateOfBirth, setDob] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [loading, setloading] = useState(true);
  const [ispress, setispress] = useState(false);

  const handelSubmit = async (event) => {
    event.preventDefault();

    // validate first
    const isValid = validatePatientForm({
      firstname,
      lastname,
      salutation,
      dateOfBirth,
      ethnicity,
    });
    if (!isValid) return; // لو في خطأ وقف التنفيذ

    const patientData = {
      firstname,
      lastname,
      salutation,
      dateOfBirth,
      ethnicity,
    };

    setloading(true);
    setispress(true);
    await dispatch(CreatePatient(patientData));
    setloading(false);
  };

  useEffect(() => {
    if (loading === false) {
      if (res.status === 201) {
        const id = res?.data?.data?._id;
        notify(t("patientForm.notifications.createSuccess"), "success");
        navigate(`/Examination/${id}`);
      }
      setFirstname("");
      setLastname("");
      setSalutation("");
      setDob("");
      setEthnicity("");
      setloading(true);
      setispress(false);
      setTimeout(() => {
        setispress(false);
      }, 3000);
    }
  }, [loading, t]);

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
                required
                onChange={(e) => setFirstname(e.target.value)}
                value={firstname}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>{t("patientForm.labels.lastName")}</Form.Label>
              <Form.Control
                placeholder={t("patientForm.placeholders.lastName")}
                required
                onChange={(e) => setLastname(e.target.value)}
                value={lastname}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>{t("patientForm.labels.salutation")}</Form.Label>
              <Form.Select
                required
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
              <Form.Label>{t("patientForm.labels.dateOfBirth")}</Form.Label>

              <Form.Control
                type="date"
                required
                onChange={(e) => setDob(e.target.value)}
                value={dateOfBirth}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>{t("patientForm.labels.ethnicity")}</Form.Label>

              <Form.Select
                required
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
                      "patientForm.ethnicityOptions.mixed.whiteBlackCaribbean"
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

        <Row className="mt-4">
          <Col>
            <Button type="submit" variant="primary">
              {t("patientForm.buttons.create")}
            </Button>
          </Col>
        </Row>

        {ispress ? (
          loading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <h4> done </h4>
          )
        ) : null}
      </Form>
    </Container>
  );
};

export default PatientTab;
