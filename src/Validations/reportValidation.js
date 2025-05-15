import { toast } from "react-toastify";

// إشعار
export const notify = (msg, type = "warn") => {
  if (type === "warn") toast.warn(msg);
  else if (type === "success") toast.success(msg);
  else toast.error(msg);
};

// التحقق من نص مكتوب
export const validateText = (value, label) => {
  if (typeof value !== "string" || value === "") {
    notify(`${label} is required`);
    return false;
  }
  return true;
};

// التحقق من قيمة رقمية
export const validateNumber = (value, label) => {
  if (value === "" || isNaN(Number(value))) {
    notify(`${label} must be a valid number`);
    return false;
  }
  return true;
};

// التحقق من التاريخ وأنه في الماضي
export const validateDate = (value, label) => {
  const date = new Date(value);
  const now = new Date();

  if (!value || isNaN(date.getTime())) {
    notify(`${label} must be a valid date`);
    return false;
  }

  if (date > now) {
    notify(`${label} must be a date in the past`);
    return false;
  }

  return true;
};

const validateDiseaseHistory = (list, label) => {
  for (const item of list) {
    if (item.hasCondition) {
      if (item.appliesTo !== "Self" && item.appliesTo !== "In Family") {
        notify(
          `${label}: ${item.name} - you must select 'Self' or 'In Family'`
        );
        return false;
      }
    }
  }
  return true;
};

// التحقق الكامل من نموذج تقرير المريض
export const validateMedicalHistory = (history) => {
  return validateDiseaseHistory(history?.medical || [], "Medical history");
};

// التحقق فقط من Eye History
export const validateEyeHistory = (history) => {
  return validateDiseaseHistory(history?.eye || [], "Eye history");
};

// التحقق من فحص العين

export const validateEyeExamination = ({ eyeExamination }) => {
  // Validate right eye
  const right = eyeExamination?.rightEye;
  if (!validateText(right?.visusCC, "Right eye Visus CC")) return false;
  if (!validateText(right?.previousValue, "Right eye Previous Value"))
    return false;
  if (!validateDate(right?.since, "Right eye Since")) return false;
  if (!validateNumber(right?.sphere, "Right eye Sphere")) return false;
  if (!validateNumber(right?.cylinder, "Right eye Cylinder")) return false;
  if (
    !validateNumber(
      right?.intraocularPressure,
      "Right eye Intraocular Pressure"
    )
  )
    return false;
  if (!validateNumber(right?.cornealThickness, "Right eye Corneal Thickness"))
    return false;
  if (!validateText(right?.chamberAngle, "Right eye Chamber Angle"))
    return false;

  // Validate left eye
  const left = eyeExamination?.leftEye;
  if (!validateText(left?.visusCC, "Left eye Visus CC")) return false;
  if (!validateText(left?.previousValue, "Left eye Previous Value"))
    return false;
  if (!validateDate(left?.since, "Left eye Since")) return false;
  if (!validateNumber(left?.sphere, "Left eye Sphere")) return false;
  if (!validateNumber(left?.cylinder, "Left eye Cylinder")) return false;
  if (
    !validateNumber(left?.intraocularPressure, "Left eye Intraocular Pressure")
  )
    return false;
  if (!validateNumber(left?.cornealThickness, "Left eye Corneal Thickness"))
    return false;
  if (!validateText(left?.chamberAngle, "Left eye Chamber Angle")) return false;

  return true;
};

export const validateImageFiles = (files) => {
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

  for (let file of files) {
    if (!allowedTypes.includes(file.type)) {
      return false;
    }
  }

  return true;
};
