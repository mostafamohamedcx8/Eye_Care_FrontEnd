import Header from "../component/Header";
import NavBar from "../component/NavBar";
import { Link } from "react-router-dom";
import Footer from "../component/Footer";
import { Button, Container, Form, Row, Spinner } from "react-bootstrap";
import { Login_Hook } from "../Hook/Login_Hook";
import { useTranslation } from "react-i18next";
const LoginSection = () => {
  const { t } = useTranslation();
  const [
    email,
    password,
    loading,
    ispress,
    HandelSubmit,
    onChangeEmail,
    onChangePassword,
  ] = Login_Hook(t);

  return (
    <>
      {/* Hero Section */}
      <Row>
        <div className="hero-section">
          <div className="overlay hero-section">
            <div className="breadcrumb">
              <Link to="/" className="breadcrumb-link">
                {t("login.breadcrumbHome")}
              </Link>
              <span className="separator">
                {t("login.breadcrumbSeparator")}
              </span>
              <span className="active">{t("login.breadcrumbLogin")}</span>
            </div>
            <h1 className="title">{t("login.title")}</h1>
          </div>
        </div>
      </Row>

      {/* Content Section */}
      <Container
        className="mt-5 mb-5 p-4 border rounded shadow"
        style={{ maxWidth: "600px", backgroundColor: "#f8f9fa" }}
      >
        <h2 className="text-center mb-4">{t("login.formHeading")}</h2>
        <Form onSubmit={HandelSubmit}>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>{t("login.emailLabel")}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t("login.emailPlaceholder")}
              value={email}
              onChange={onChangeEmail}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>{t("login.passwordLabel")}</Form.Label>
            <Form.Control
              type="password"
              placeholder={t("login.passwordPlaceholder")}
              value={password}
              onChange={onChangePassword}
            />
          </Form.Group>

          <Button type="submit" className="w-100 mb-2 welcome-button">
            {t("login.button")}
          </Button>

          <div className="text-center">
            <small>
              {t("login.forgottenPassword")}{" "}
              <a href="/ResetPassword">{t("login.clickHere")}</a>
            </small>
            <br />
            <small>
              {t("login.noAccount")} <a href="/Signup">{t("login.signUp")}</a>
            </small>
          </div>
        </Form>
        {ispress ? (
          loading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <h4>{t("login.done")} </h4>
          )
        ) : null}
      </Container>
    </>
  );
};
const Login = () => {
  return (
    <div className="color-body">
      <Header />
      <NavBar />
      <LoginSection />
      <Footer />
    </div>
  );
};

export default Login;
