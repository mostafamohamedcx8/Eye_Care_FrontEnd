import Header from "../component/Header";
import NavBar from "../component/NavBar";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../component/Footer";
import React, { useState, useEffect } from "react";
import { Button, Container, Form, Row, Card, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ForgetPassword } from "../Redux/actions/Useraction";
import { validateForgetPassword } from "../Validations/validateSignupForm";
import notify from "../Hook/useNotification";
import { useTranslation } from "react-i18next";
const ResetSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPress, setIsPress] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForgetPassword({ email, t });
    if (!isValid) return;

    localStorage.setItem("user-email", email);
    setLoading(true);
    setIsPress(true);

    await dispatch(ForgetPassword({ email }));
    setLoading(false);
  };

  const res = useSelector((state) => state.alluser.forgetPassword);

  useEffect(() => {
    if (!loading && isPress && res) {
      if (res.message === "Check your email for further instructions") {
        notify(t("resetPassword.notifySuccess"), "success");
        setTimeout(() => navigate("/OtpCode"), 1500);
      } else if (res.data?.message === "No user found with this email") {
        notify(t("resetPassword.notifyError"), "warn");
      }
      setIsPress(false); // نرجعها false عشان نجهز للمحاولة الجاية
    }
  }, [loading, res, t, navigate, isPress]);

  return (
    <>
      {/* Hero Section */}
      <Row>
        <div className=" hero-section">
          <div className="overlay hero-section">
            <div className="breadcrumb">
              <Link to="/" className="breadcrumb-link">
                {t("resetPassword.breadcrumbHome")}
              </Link>
              <span className="separator">
                {t("resetPassword.breadcrumbSeparator")}
              </span>
              <span className="active">
                {t("resetPassword.breadcrumbResetPassword")}
              </span>
            </div>
            <h1 className="title">{t("resetPassword.title")}</h1>
          </div>
        </div>
      </Row>

      {/* Content Section */}
      <Container
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <Card style={{ width: "100%", maxWidth: "400px" }}>
          <Card.Body>
            <h4 className="text-center mb-3">
              {t("resetPassword.formHeading")}
            </h4>
            <Form onSubmit={handleSubmit}>
              {" "}
              {/* استخدمنا onSubmit هنا */}
              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  required
                  placeholder={t("resetPassword.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <div className="d-flex justify-content-end gap-2">
                <Button
                  onClick={() => navigate("/Login")}
                  className="w-100 mb-2"
                  variant="secondary"
                >
                  {t("resetPassword.cancelButton")}
                </Button>
                <Button
                  type="submit"
                  className="w-100 mb-2 welcome-button"
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner size="sm" animation="border" />
                  ) : (
                    t("resetPassword.searchButton")
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>

        {/* عرض رسالة النجاح تحت الكارد بشكل أفضل */}
        {!loading && isPress && res?.status === 200 && (
          <h4 className="mt-3"> {t("resetPassword.done")} </h4>
        )}
      </Container>
    </>
  );
};
const ResetPassword = () => {
  return (
    <div className="color-body">
      <Header />
      <NavBar />
      <ResetSection />
      <Footer />
    </div>
  );
};

export default ResetPassword;
