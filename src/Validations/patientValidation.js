import { toast } from "react-toastify";
import i18n from "i18next";
export const notify = (msg, type) => {
  if (type === "warn") toast.warn(msg);
  else if (type === "success") toast.success(msg);
  else if (type === "error") toast.error(msg);
};

// دالة التحقق من صحة البيانات
export const validatePatientForm = ({
  firstname,
  lastname,
  salutation,
  dateOfBirth,
  ethnicity,
}) => {
  if (!firstname.trim()) {
    notify(i18n.t("patientForm.validation.nameRequired"), "warn");
    return false;
  }
  if (!lastname.trim()) {
    notify(i18n.t("patientForm.validation.nameRequired"), "warn");
    return false;
  }
  if (!salutation) {
    notify(i18n.t("patientForm.validation.genderRequired"), "warn");
    return false;
  }
  if (!dateOfBirth) {
    notify(i18n.t("patientForm.validation.dobRequired"), "warn");
    return false;
  }

  // ✅ تحقق إن تاريخ الميلاد في الماضي
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

  if (!ethnicity) {
    notify(i18n.t("patientForm.validation.ethnicityRequired"), "warn");
    return false;
  }

  // ✅ لو كل حاجة تمام
  return true;
};
