import Header from "../component/Header";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyPassword } from "../Redux/actions/Useraction";
import notify from "../Hook/useNotification";
import { Button, Container, Form, Row, Card, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
const OTPSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [resetCode, setResetCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPress, setIsPress] = useState(false);
  const { t } = useTranslation();

  const res = useSelector((state) => state.alluser.verfiyPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resetCode) return; // حماية بسيطة لو الكود فاضي

    setLoading(true);
    setIsPress(true);

    await dispatch(verifyPassword({ resetCode }));

    setLoading(false);
  };

  useEffect(() => {
    if (!loading && isPress && res) {
      if (res.message === "Reset code verified successfully") {
        notify(t("otpCode.notifySuccess"), "success");
        setTimeout(() => {
          navigate("/NewPassword");
        }, 1000);
      } else if (res.data?.message === "Invalid or expired reset code") {
        notify(t("otpCode.notifyError"), "error");
      }
      // لا نحتاج لعمل setLoading(true) هنا، الأفضل تصفير isPress
      setIsPress(false);
    }
  }, [loading, res, navigate, t, isPress]);

  return (
    <>
      {/* Hero Section */}
      <Row>
        <div className="hero-section">
          <div className="overlay hero-section">
            <div className="breadcrumb">
              <Link to="/" className="breadcrumb-link">
                {t("otpCode.breadcrumbHome")}
              </Link>
              <span className="separator">
                {t("otpCode.breadcrumbSeparator")}
              </span>
              <span className="active">
                {t("otpCode.breadcrumbResetPassword")}
              </span>
            </div>
            <h1 className="title">{t("otpCode.title")}</h1>
          </div>
        </div>
      </Row>

      {/* OTP Code Entry Section */}
      <Container
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <Card style={{ width: "100%", maxWidth: "400px" }}>
          <Card.Body>
            <h4 className="text-center mb-3">{t("otpCode.formHeading")}</h4>
            <Form onSubmit={handleSubmit}>
              {" "}
              {/* استخدام onSubmit أفضل */}
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  maxLength="6"
                  placeholder={t("otpCode.codePlaceholder")}
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                />
              </Form.Group>
              <div className="d-flex justify-content-end gap-2">
                <Button
                  onClick={() => navigate("/Login")} // انتقال بدون ريلود
                  className="w-100 mb-2"
                  variant="secondary"
                >
                  {t("otpCode.cancelButton")}
                </Button>
                <Button
                  type="submit"
                  className="w-100 mb-2 welcome-button"
                  disabled={loading} // تعطيل الزر أثناء الإرسال
                >
                  {loading ? (
                    <Spinner size="sm" animation="border" />
                  ) : (
                    t("otpCode.verifyButton")
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>

        {isPress && !loading && res?.status === 200 && (
          <h4 className="mt-3"> {t("otpCode.done")} </h4>
        )}
      </Container>
    </>
  );
};
const OtpCode = () => {
  return (
    <div className="color-body">
      <Header />
      <NavBar />
      <OTPSection />
      <Footer />
    </div>
  );
};

export default OtpCode;
