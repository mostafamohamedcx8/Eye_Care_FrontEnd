import { toast } from "react-toastify";
import i18n from "i18next";
export const notify = (msg, type) => {
  if (type === "warn") toast.warn(msg);
  else if (type === "success") toast.success(msg);
  else if (type === "error") toast.error(msg);
};

const validateEmailFormat = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};
// دالة التحقق من صحة البيانات
export const validatePatientForm = ({
  firstname,
  lastname,
  salutation,
  dateOfBirth,
  ethnicity,
  email,
}) => {
  // Validate email format only if email is provided (email is optional)
  if (email && !validateEmailFormat(email)) {
    notify(
      i18n.t("patientForm.validation.emailInvalid") ||
        "Please enter a valid email address",
      "warn",
    );
    return false;
  }

  // Validate date of birth only if provided (optional field)
  if (dateOfBirth) {
    const dob = new Date(dateOfBirth);
    const now = new Date();

    if (isNaN(dob.getTime())) {
      notify(i18n.t("patientForm.validation.dobInvalid"), "warn");
      return false;
    }

    if (dob >= now) {
      notify(i18n.t("patientForm.validation.dobFuture"), "warn");
      return false;
    }
  }

  return true;
};
