import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoginUser } from "../Redux/actions/Useraction";
import notify from "../Hook/useNotification";
import { validateLogin } from "../Validations/validateSignupForm";
export const Login_Hook = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [ispress, setispress] = useState(false);

  const HandelSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateLogin({ email, password });
    if (!isValid) return;
    setLoading(true);
    setispress(true);
    await dispatch(
      LoginUser({
        email,
        password,
        role: "optician",
      })
    );
    setLoading(false);
    setispress(false);
  };
  const res = useSelector((state) => state.alluser.loginUser);

  const onChangeEmail = (e) => {
    e.persist();
    setEmail(e.target.value);
  };
  const onChangePassword = (e) => {
    e.persist();
    setPassword(e.target.value);
  };

  useEffect(() => {
    if (loading === false) {
      if (res) {
        console.log(res.data.message);
        if (res.token) {
          localStorage.setItem("token", res.token);
          localStorage.setItem("user", JSON.stringify(res.data));
          notify("logged in successfully", "success");
          setTimeout(() => {
            window.location.href = "/";
          }, 1500);
        } else if (res?.data?.message === "Invalid email or password ") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          notify("Invalid E-mail or Password ", "warn");
        } else if (
          res?.data?.message ===
          "Your email is not verified. We have sent a new verification link to your email."
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          notify(
            "Your E-mail not verified. We sent new verification Link to your E-mail",
            "warn"
          );
        } else if (res?.data?.message === "Invalid email or password or role") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          notify("Invalid email or password or role", "warn");
        } else if (
          res.data.message ===
          "Your medical license is still under review. You will be notified by email once it's verified."
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          notify(
            "Your medical license is still under review. You will be notified by email once it's verified",
            "warn"
          );
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          // notify(,"error")
        }
        setLoading(true);
      }
    }
  }, [loading]);

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
