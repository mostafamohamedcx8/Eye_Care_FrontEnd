import { toast } from "react-toastify";
import i18n from "i18next";
// إشعار
export const notify = (msg, type = "warn") => {
  if (type === "warn") toast.warn(msg);
  else if (type === "success") toast.success(msg);
  else toast.error(msg);
};

const t = i18n.t.bind(i18n);

// التحقق من نص مكتوب
export const validateText = (value, label) => {
  if (typeof value !== "string" || value === "") {
    notify(t("reportForm.validation.required", { label }));
    return false;
  }
  return true;
};

// التحقق من قيمة رقمية
export const validateNumber = (value, label) => {
  if (value === "" || isNaN(Number(value))) {
    notify(t("reportForm.validation.invalidNumber", { label }));
    return false;
  }
  return true;
};

// التحقق من التاريخ وأنه في الماضي
export const validateDate = (value, label) => {
  const date = new Date(value);
  const now = new Date();

  if (!value || isNaN(date.getTime())) {
    notify(t("reportForm.validation.invalidDate", { label }));
    return false;
  }

  if (date > now) {
    notify(t("reportForm.validation.dateInPast", { label }));
    return false;
  }

  return true;
};

const validateDiseaseHistory = (list, label) => {
  for (const item of list) {
    if (item.hasCondition) {
      if (item.appliesTo !== "Self" && item.appliesTo !== "In Family") {
        notify(
          t("reportForm.validation.diseaseSelectSelfOrFamily", {
            label,
            disease: item.name,
          })
        );
        return false;
      }
    }

    if (
      (item.appliesTo === "Self" || item.appliesTo === "In Family") &&
      !item.hasCondition
    ) {
      notify(
        t("reportForm.validation.diseaseSelectYes", {
          label,
          disease: item.name,
          appliesTo: item.appliesTo,
        })
      );
      return false;
    }

    // ✅ Special case for Diabetes M.
    if (
      item.name === "Diabetes M." &&
      item.hasCondition &&
      item.appliesTo === "Self"
    ) {
      // 1- sinceWhen
      if (!item.sinceWhen) {
        notify(t("reportForm.validation.sinceWhenRequired"));
        return false;
      } else {
        const sinceDate = new Date(item.sinceWhen);
        const today = new Date();
        if (sinceDate >= today) {
          notify(t("reportForm.validation.sinceWhenPast"));
          return false;
        }
      }

      // 2- hba1cValue
      if (item.hba1cValue === undefined || item.hba1cValue === "") {
        notify(t("reportForm.validation.hba1cValueRequired"));
        return false;
      } else if (item.hba1cValue < 4 || item.hba1cValue > 15) {
        notify(t("reportForm.validation.hba1cValueRange"));
        return false;
      }

      // 3- hba1cDate
      if (!item.hba1cDate) {
        notify(t("reportForm.validation.hba1cDateRequired"));
        return false;
      } else {
        const hba1cDate = new Date(item.hba1cDate);
        const today = new Date();
        if (hba1cDate > today) {
          notify(t("reportForm.validation.hba1cDatePast"));
          return false;
        }
      }

      // 4- diabetesTreatment
      const allowedTreatments = [
        "tablets",
        "insulin",
        "weeklySemaglutide",
        "other",
        "",
      ];
      if (!allowedTreatments.includes(item.diabetesTreatment)) {
        notify(t("reportForm.validation.invalidDiabetesTreatment"));
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

// export const validateEyeExamination = ({ eyeExamination }) => {
//   // Validate right eye
//   const right = eyeExamination?.rightEye;
//   if (!validateText(right?.visusCC, "Right eye Visus CC")) return false;
//   if (!validateText(right?.previousValue, "Right eye Previous Value"))
//     return false;
//   if (!validateDate(right?.since, "Right eye Since")) return false;
//   if (!validateNumber(right?.sphere, "Right eye Sphere")) return false;
//   if (!validateNumber(right?.cylinder, "Right eye Cylinder")) return false;
//   if (
//     !validateNumber(
//       right?.intraocularPressure,
//       "Right eye Intraocular Pressure"
//     )
//   )
//     return false;
//   if (!validateNumber(right?.cornealThickness, "Right eye Corneal Thickness"))
//     return false;
//   if (!validateText(right?.chamberAngle, "Right eye Chamber Angle"))
//     return false;

//   // Validate left eye
//   const left = eyeExamination?.leftEye;
//   if (!validateText(left?.visusCC, "Left eye Visus CC")) return false;
//   if (!validateText(left?.previousValue, "Left eye Previous Value"))
//     return false;
//   if (!validateDate(left?.since, "Left eye Since")) return false;
//   if (!validateNumber(left?.sphere, "Left eye Sphere")) return false;
//   if (!validateNumber(left?.cylinder, "Left eye Cylinder")) return false;
//   if (
//     !validateNumber(left?.intraocularPressure, "Left eye Intraocular Pressure")
//   )
//     return false;
//   if (!validateNumber(left?.cornealThickness, "Left eye Corneal Thickness"))
//     return false;
//   if (!validateText(left?.chamberAngle, "Left eye Chamber Angle")) return false;

//   return true;
// };

export const validateImageFiles = (files) => {
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

  for (let file of files) {
    if (!allowedTypes.includes(file.type)) {
      return false;
    }
  }

  return true;
};

export const validateRightEyeSection = ({
  rightVisusCC,
  rightSphere,
  rightCylinder,
  rightAxis,
  rightPreviousValue,
  rightImageCaptureDate,
  rightSince,
  rightIntraocularPressure,
  rightChamberAngle,
  rightCornealThickness,
  rightAmslerTestAbnormal,
  Rightimages,
}) => {
  const allEmpty =
    rightVisusCC === "" &&
    rightSphere === "" &&
    rightCylinder === "" &&
    rightAxis === "" &&
    rightPreviousValue === "" &&
    rightSince === "" &&
    rightIntraocularPressure === "" &&
    rightChamberAngle === "" &&
    rightCornealThickness === "" &&
    rightImageCaptureDate === "" &&
    !rightAmslerTestAbnormal &&
    (!Rightimages || Object.values(Rightimages).every((val) => val === ""));

  if (allEmpty) {
    return true;
  }

  const coreFieldsFilled =
    rightVisusCC !== "" &&
    rightSphere !== "" &&
    rightCylinder !== "" &&
    rightAxis !== "";

  if (!coreFieldsFilled) {
    notify(t("reportForm.validation.coreFieldsRequired"), "warn");
    return false;
  }

  // ✅ Check Previous Value and Since together
  const hasPrevious = rightPreviousValue !== "";
  const hasSince = rightSince !== "";

  if ((hasPrevious && !hasSince) || (!hasPrevious && hasSince)) {
    notify(t("reportForm.validation.previousAndSinceTogether"), "warn");
    return false;
  }

  // ✅ Check Corneal Thickness range (if filled)
  if (rightCornealThickness !== "" && rightCornealThickness !== null) {
    const thickness = Number(rightCornealThickness);
    if (isNaN(thickness) || thickness <= 350 || thickness >= 700) {
      notify(t("reportForm.validation.cornealThicknessRange"), "warn");
      return false;
    }
  }
  const hasImageDate = rightImageCaptureDate !== "";
  const hasImages =
    Rightimages && Object.values(Rightimages).some((val) => val !== "");

  if (hasImages && !hasImageDate) {
    notify(t("reportForm.validation.imageDateRequired"), "warn");
    return false;
  }

  if (!hasImages && hasImageDate) {
    notify(t("reportForm.validation.noImageDateWithoutImage"), "warn");
    return false;
  }
  if (hasImageDate) {
    const imageDate = new Date(rightImageCaptureDate);
    const today = new Date();

    // Normalize both dates to remove time component
    imageDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (imageDate > today) {
      notify(t("reportForm.validation.imageDateNotFuture"), "warn");
      return false;
    }
  }

  return true;
};

export const validateLeftEyeSection = ({
  leftVisusCC,
  leftSphere,
  leftCylinder,
  leftAxis,
  leftPreviousValue,
  leftImageCaptureDate,
  leftSince,
  leftIntraocularPressure,
  leftChamberAngle,
  leftCornealThickness,
  leftAmslerTestAbnormal,
  Leftimages,
}) => {
  const allEmpty =
    leftVisusCC === "" &&
    leftSphere === "" &&
    leftCylinder === "" &&
    leftAxis === "" &&
    leftPreviousValue === "" &&
    leftSince === "" &&
    leftIntraocularPressure === "" &&
    leftChamberAngle === "" &&
    leftCornealThickness === "" &&
    leftImageCaptureDate === "" &&
    !leftAmslerTestAbnormal &&
    (!Leftimages || Object.values(Leftimages).every((val) => val === ""));

  if (allEmpty) {
    return true;
  }

  const coreFieldsFilled =
    leftVisusCC !== "" &&
    leftSphere !== "" &&
    leftCylinder !== "" &&
    leftAxis !== "";

  if (!coreFieldsFilled) {
    notify(t("reportForm.validation.coreFieldsRequired"), "warn");
    return false;
  }

  // ✅ Check Previous Value and Since together
  const hasPrevious = leftPreviousValue !== "";
  const hasSince = leftSince !== "";

  if ((hasPrevious && !hasSince) || (!hasPrevious && hasSince)) {
    notify(t("reportForm.validation.previousAndSinceTogether"), "warn");
    return false;
  }

  // ✅ Check Corneal Thickness range (if filled)
  if (leftCornealThickness !== "") {
    const thickness = Number(leftCornealThickness); // استخدمنا Number بدل parseFloat
    if (isNaN(thickness) || thickness <= 350 || thickness >= 700) {
      notify(t("reportForm.validation.cornealThicknessRange"), "warn");
      return false;
    }
  }
  const hasImageDate = leftImageCaptureDate !== "";
  const hasImages =
    Leftimages && Object.values(Leftimages).some((val) => val !== "");

  if (hasImages && !hasImageDate) {
    notify(t("reportForm.validation.imageDateRequired"), "warn");
    return false;
  }

  if (!hasImages && hasImageDate) {
    notify(t("reportForm.validation.noImageDateWithoutImage"), "warn");
    return false;
  }
  if (hasImageDate) {
    const imageDate = new Date(leftImageCaptureDate);
    const today = new Date();

    // Normalize both dates to remove time component
    imageDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (imageDate > today) {
      notify(t("reportForm.validation.imageDateNotFuture"), "warn");
      return false;
    }
  }

  return true;
};
