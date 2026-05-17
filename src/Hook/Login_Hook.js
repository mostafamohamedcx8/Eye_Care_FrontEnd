import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoginUser } from "../Redux/actions/Useraction";
import notify from "../Hook/useNotification";
import { validateLogin } from "../Validations/validateSignupForm";
import { useNavigate } from "react-router-dom";
export const Login_Hook = (t) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ispress, setispress] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const HandelSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateLogin({ email, password, t });
    if (!isValid) return;
    setLoading(true);
    setispress(true);
    await dispatch(
      LoginUser({
        email,
        password,
        role: "optician",
      }),
    );
    setLoading(false);
    setispress(false);
  };
  const res = useSelector((state) => state.alluser.loginUser);

  const onChangeEmail = (e) => setEmail(e.target.value);
  const onChangePassword = (e) => setPassword(e.target.value);

  useEffect(() => {
    if (loading === false && res) {
      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.data));
        notify(t("loginHook.notifySuccess"), "success");

        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        const msg = res?.data?.message;

        if (msg?.includes("Invalid email or password")) {
          notify(t("loginHook.notifyInvalidCredentials"), "warn");
        } else if (msg?.includes("not verified")) {
          notify(t("loginHook.notifyEmailNotVerified"), "warn");
        } else if (msg?.includes("medical license")) {
          notify(t("loginHook.notifyLicenseUnderReview"), "warn");
        } else if (msg?.includes("role")) {
          notify(t("loginHook.notifyInvalidRole"), "warn");
        }
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      setLoading(true);
    }
  }, [loading, res, t, navigate]);

  return [
    email,
    password,
    loading,
    ispress,
    HandelSubmit,
    onChangeEmail,
    onChangePassword,
  ];
};
