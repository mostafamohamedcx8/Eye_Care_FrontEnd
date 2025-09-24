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
  // لو في تاريخ مكتوب، لازم يكون صحيح وفي الماضي
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

  // ✅ كل الحقول اختيارية
  return true;
};
