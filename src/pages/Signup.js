import Header from "../component/Header";
import NavBar from "../component/NavBar";
import { Link } from "react-router-dom";
import Footer from "../component/Footer";
import {
  Button,
  Container,
  Form,
  Row,
  Col,
  Spinner,
  Modal,
} from "react-bootstrap";
import { Signup_Hook } from "../Hook/Signup_Hook";
import { useTranslation } from "react-i18next";

const SignupSection = () => {
  const { t } = useTranslation();
  const [
    handleShowModal,
    firstname,
    lastname,
    dateOfBirthDay,
    dateOfBirthMonth,
    dateOfBirthYear,
    salutation,
    email,
    password,
    confirmPassword,
    selectedState,
    states,
    selectedcity,
    cities,
    postalCode,
    fullAddress,
    ispress,
    loading,
    showModal,
    handleCloseModal,
    handelSubmit,
    imagemedicallicense,
    onChangefirstname,
    onChangelastname,
    onChangeEmail,
    onChangedFullAddress,
    onChangedPostalCode,
    onChangedSelectedState,
    onChangedSelectedcity,
    onChangedateOfBirthDay,
    onChangedateOfBirthMonth,
    onChangedateOfBirthYear,
    onChangedimagemedicallicense,
    onChangedsalutation,
    onChangedPassword,
    onChangeConfirmPassword,
    onChangePhoneNumber,
    phoneNumber,
    onChangeCountryCode,
    countryCode,
  ] = Signup_Hook(t);

  // ✅ الزرار يكون مفعّل بس لما الحقول الأساسية متملية
  const isFormValid =
    firstname.trim() !== "" &&
    lastname.trim() !== "" &&
    email.trim() !== "" &&
    password.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    phoneNumber.trim() !== "" &&
    salutation !== "" &&
    dateOfBirthDay !== "" &&
    dateOfBirthMonth !== "" &&
    dateOfBirthYear !== "" &&
    selectedState !== "" &&
    selectedcity !== "" &&
    postalCode.trim() !== "" &&
    fullAddress.trim() !== "";

  return (
    <>
      {/* Hero Section */}
      <Row>
        <div className="hero-section">
          <div className="overlay hero-section">
            <div className="breadcrumb">
              <Link to="/" className="breadcrumb-link">
                {t("signup.breadcrumb_home")}
              </Link>
              <span className="separator">/</span>
              <span className="active">{t("signup.breadcrumb_signup")}</span>
            </div>
            <h1 className="title">{t("signup.title")}</h1>
          </div>
        </div>
      </Row>

      {/* Content Section */}
      <Container
        className="mt-5 mb-5 p-4 border rounded shadow"
        style={{ maxWidth: "600px", backgroundColor: "#f8f9fa" }}
      >
        <h3 className="text-center mb-4">{t("signup.title")}</h3>

        <Form onSubmit={handleShowModal}>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>{t("signup.first_name")}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t("signup.first_name_placeholder")}
                  value={firstname}
                  onChange={onChangefirstname}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>{t("signup.last_name")}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t("signup.last_name_placeholder")}
                  value={lastname}
                  onChange={onChangelastname}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* تاريخ الميلاد */}
          <Form.Label>{t("signup.date_of_birth")}</Form.Label>
          <Row className="mb-3">
            <Col>
              {/* ✅ إضافة value="" disabled للـ placeholder option */}
              <Form.Select
                value={dateOfBirthDay}
                onChange={onChangedateOfBirthDay}
              >
                <option value="" disabled>
                  {t("signup.day")}
                </option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {" "}
                    {/* ✅ إضافة value */}
                    {i + 1}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col>
              <Form.Select
                value={dateOfBirthMonth}
                onChange={onChangedateOfBirthMonth}
              >
                <option value="">{t("signup.month")}</option>
                {t("signup.months", { returnObjects: true }).map(
                  (monthLabel, i) => (
                    <option key={i} value={i + 1}>
                      {monthLabel}
                    </option>
                  ),
                )}
              </Form.Select>
            </Col>
            <Col>
              {/* ✅ إضافة value="" disabled للـ placeholder option */}
              <Form.Select
                value={dateOfBirthYear}
                onChange={onChangedateOfBirthYear}
              >
                <option value="" disabled>
                  {t("signup.year")}
                </option>
                {Array.from({ length: 100 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year}>
                      {" "}
                      {/* ✅ إضافة value */}
                      {year}
                    </option>
                  );
                })}
              </Form.Select>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>{t("signup.salutation")}</Form.Label>
            <Form.Select value={salutation} onChange={onChangedsalutation}>
              <option value="" disabled hidden>
                {t("signup.salutation_placeholder")}
              </option>
              {t("signup.salutations", { returnObjects: true }).map(
                (sal, index) => (
                  <option key={index} value={sal.value}>
                    {sal.label}
                  </option>
                ),
              )}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t("signup.email")}</Form.Label>
            <Form.Control
              type="email"
              placeholder={t("signup.email_placeholder")}
              value={email}
              onChange={onChangeEmail}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t("signup.password")}</Form.Label>
            <Form.Control
              type="password"
              placeholder={t("signup.password_placeholder")}
              value={password}
              onChange={onChangedPassword}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>{t("signup.confirm_password")}</Form.Label>
            <Form.Control
              type="password"
              placeholder={t("signup.confirm_password_placeholder")}
              value={confirmPassword}
              onChange={onChangeConfirmPassword}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>{t("signup.phone_number")}</Form.Label>
            <div className="d-flex">
              <Form.Select
                value={countryCode}
                onChange={onChangeCountryCode}
                style={{ maxWidth: "120px", marginRight: "8px" }}
              >
                <option value="+49">🇩🇪 +49</option>
                <option value="+1">🇺🇸 +1</option>
              </Form.Select>
              <Form.Control
                type="tel"
                placeholder={t("signup.phone_number_placeholder")}
                value={phoneNumber}
                onChange={onChangePhoneNumber}
              />
            </div>
            <Form.Text className="text-muted">
              {countryCode === "+49"
                ? "+49XXXXXXXXXX (Germany)"
                : "+1XXXXXXXXXX (USA)"}
            </Form.Text>
          </Form.Group>

          {/* Address */}
          <Form.Group className="mb-3">
            <Form.Label>{t("signup.state")}</Form.Label>
            <Form.Select
              name="state"
              value={selectedState}
              onChange={onChangedSelectedState}
            >
              <option value="" disabled>
                {t("signup.state_placeholder")}
              </option>
              {states.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t("signup.city")}</Form.Label>
            <Form.Select value={selectedcity} onChange={onChangedSelectedcity}>
              <option value="">{t("signup.city_placeholder")}</option>
              {/* ✅ إضافة value لكل city option */}
              {cities.map((city, i) => (
                <option key={i} value={city.name}>
                  {city.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>{t("signup.postal_code")}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t("signup.postal_code_placeholder")}
              value={postalCode}
              onChange={onChangedPostalCode}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>{t("signup.full_address")}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t("signup.full_address_placeholder")}
              value={fullAddress}
              onChange={onChangedFullAddress}
            />
          </Form.Group>

          {/* ✅ زرار Signup مع Display كامل */}
          <Button
            type="submit"
            className="w-100 mb-2 welcome-button"
            disabled={!isFormValid || ispress} // ✅ معطّل لو الفورم ناقص أو جاري التحميل
            style={{
              opacity: !isFormValid ? 0.6 : 1, // ✅ شفافية لما يكون معطّل
              cursor: !isFormValid ? "not-allowed" : "pointer", // ✅ cursor مناسب
              transition: "opacity 0.3s ease",
            }}
          >
            {ispress && loading ? (
              // ✅ Spinner جوه الزرار أثناء التحميل
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                {t("signup.loading") || "Loading..."}
              </>
            ) : (
              t("signup.submit_button")
            )}
          </Button>

          {/* ✅ رسالة توضيحية لو الفورم ناقص */}
          {!isFormValid && (
            <p
              className="text-center text-muted mt-1"
              style={{ fontSize: "0.85rem" }}
            >
              {t("signup.fill_all_fields") ||
                "يرجى ملء جميع الحقول لتفعيل زر التسجيل"}
            </p>
          )}
        </Form>
      </Container>

      {/* Modal رفع الصورة */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{t("signup.modal_title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>{t("signup.modal_label")}</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={onChangedimagemedicallicense}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            {t("signup.modal_cancel_button")}
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              // ✅ إزالة e — مش محتاجينها
              handleCloseModal();
              handelSubmit(); // ✅ بدون event
            }}
            disabled={!imagemedicallicense}
          >
            {t("signup.modal_confirm_button")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const Signup = () => {
  return (
    <div className="color-body">
      <Header />
      <NavBar />
      <SignupSection />
      <Footer />
    </div>
  );
};

export default Signup;
