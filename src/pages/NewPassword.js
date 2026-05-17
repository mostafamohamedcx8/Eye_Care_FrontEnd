import Header from "../component/Header";
import NavBar from "../component/NavBar";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../component/Footer";
import { Button, Container, Form, Row, Card, Spinner } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Create_New_Password } from "../Redux/actions/Useraction";
import notify from "../Hook/useNotification";
import { validationResetPassword } from "../Validations/validateSignupForm";
import { useTranslation } from "react-i18next";

const NewPasswordSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [newpassword, setnewpassword] = useState("");
  const [confirmnewPassword, setConfirmnewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPress, setIsPress] = useState(false);
  const { t } = useTranslation();

  const res = useSelector((state) => state.alluser.createNewPassword);
  console.log(res);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validationResetPassword({
      newpassword,
      confirmnewPassword,
      t,
    });

    if (!isValid) return;

    setLoading(true);
    setIsPress(true);

    await dispatch(
      Create_New_Password({
        newpassword,
        email: localStorage.getItem("user-email"),
      }),
    );

    setLoading(false);
  };

  useEffect(() => {
    // نتحقق إن التحميل خلص وإن فيه محاولة إرسال فعلية حصلت
    if (!loading && isPress && res) {
      if (res.message === "Password reset successfully") {
        notify(t("newPassword.notifySuccess"), "success");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else if (res.data?.message === "Reset code is not verified") {
        notify(t("newPassword.notifyErrorNotVerified"), "error");
      } else {
        notify(t("newPassword.notifyErrorRequestNew"), "error");
      }
      setIsPress(false); // تصفير الحالة للمحاولة التالية
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
                {t("newPassword.breadcrumbHome")}
              </Link>
              <span className="separator">
                {t("newPassword.breadcrumbSeparator")}
              </span>
              <span className="active">
                {t("newPassword.breadcrumbResetPassword")}
              </span>
            </div>
            <h1 className="title">{t("newPassword.title")}</h1>
          </div>
        </div>
      </Row>

      {/* New Password Form Section */}
      <Container
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <Card style={{ width: "100%", maxWidth: "400px" }}>
          <Card.Body>
            <h4 className="text-center mb-3">{t("newPassword.formHeading")}</h4>
            <p className="text-center text-muted mb-4">
              {t("newPassword.instructionText")}
            </p>

            <Form onSubmit={handleSubmit}>
              {" "}
              {/* استخدم onSubmit هنا */}
              <Form.Group className="mb-3">
                <Form.Label>{t("newPassword.newPasswordLabel")}</Form.Label>
                <Form.Control
                  type="password"
                  required
                  placeholder={t("newPassword.newPasswordPlaceholder")}
                  value={newpassword}
                  onChange={(e) => setnewpassword(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>{t("newPassword.confirmPasswordLabel")}</Form.Label>
                <Form.Control
                  type="password"
                  required
                  placeholder={t("newPassword.confirmPasswordPlaceholder")}
                  value={confirmnewPassword}
                  onChange={(e) => setConfirmnewPassword(e.target.value)}
                />
              </Form.Group>
              <Button
                type="submit"
                variant="primary"
                className="w-100"
                disabled={loading}
              >
                {loading ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  t("newPassword.resetButton")
                )}
              </Button>
            </Form>
          </Card.Body>
        </Card>

        {isPress && !loading && res?.status === 200 && (
          <h4 className="mt-3"> {t("newPassword.done")} </h4>
        )}
      </Container>
    </>
  );
};
const Newpassword = () => {
  return (
    <div className="color-body">
      <Header />
      <NavBar />
      <NewPasswordSection />
      <Footer />
    </div>
  );
};

export default Newpassword;
