import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpecificpatient } from "../Redux/actions/Patientaction";
import {
  getPatientWithReport,
  CreateReport,
} from "./../Redux/actions/Reportaction";
import notify from "../Hook/useNotification";
import { useNavigate, useParams } from "react-router-dom";
import {
  validateEyeHistory,
  validateMedicalHistory,
  validateRightEyeSection,
  validateImageFiles,
  validateLeftEyeSection,
} from "../Validations/reportValidation";
import { useTranslation } from "react-i18next";

export const ReportDetails_Hook = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const Navigate = useNavigate();
  const dispatch = useDispatch(); // ✅ اتنقل لفوق قبل أي useEffect

  const [activeTab, setActiveTab] = useState("history");
  const [innerTab, setInnerTab] = useState("medical");
  const [Rightimages, setRightImages] = useState([]);
  const [Leftimages, setLeftImages] = useState([]);
  const [RightDic, setRightDic] = useState(null); // ✅ null بدل []
  const [LeftDic, setLeftDic] = useState(null); // ✅ null بدل []
  const [rightImageCaptureDate, setRightImageCaptureDate] = useState("");
  const [leftImageCaptureDate, setLeftImageCaptureDate] = useState("");
  const [rightVisusCC, setRightVisusCC] = useState("");
  const [rightPreviousValue, setRightPreviousValue] = useState("");
  const [rightSince, setRightSince] = useState("");
  const [rightSphere, setRightSphere] = useState("");
  const [rightCylinder, setRightCylinder] = useState("");
  const [rightAxis, setRightAxis] = useState("");
  const [rightIntraocularPressure, setRightIntraocularPressure] = useState("");
  const [rightCornealThickness, setRightCornealThickness] = useState("");
  const [rightChamberAngle, setRightChamberAngle] = useState("");
  const [rightAmslerTestAbnormal, setRightAmslerTestAbnormal] = useState(false);
  const [leftVisusCC, setLeftVisusCC] = useState("");
  const [leftPreviousValue, setLeftPreviousValue] = useState("");
  const [leftSince, setLeftSince] = useState("");
  const [leftSphere, setLeftSphere] = useState("");
  const [leftCylinder, setLeftCylinder] = useState("");
  const [leftAxis, setLeftAxis] = useState("");
  const [leftIntraocularPressure, setLeftIntraocularPressure] = useState("");
  const [leftCornealThickness, setLeftCornealThickness] = useState("");
  const [leftChamberAngle, setLeftChamberAngle] = useState("");
  const [leftAmslerTestAbnormal, setLeftAmslerTestAbnormal] = useState(false);
  const [historyData, setHistoryData] = useState({ medical: [], eye: [] });
  const [newMedicalDisease, setNewMedicalDisease] = useState("");
  const [newEyeDisease, setNewEyeDisease] = useState("");
  const [loading, setloading] = useState(true);
  const [ispress, setispress] = useState(false);
  const [eyeDiseases, setEyeDiseases] = useState([
    "Cataract",
    "Glaucoma",
    "Age-related macular degeneration",
  ]);

  const Report = useSelector((state) => state.allreport.Report);
  const ReportData = useSelector(
    (state) => state.allreport.getpatientwithreport,
  );
  const Data = useSelector((state) => state.allpatient.getspecificpatient);
  const patient = Data?.data?.patient;

  // ✅ دلوقتي dispatch اتعرف قبل useEffect
  useEffect(() => {
    dispatch(getPatientWithReport(id));
    dispatch(getSpecificpatient(id));
  }, [id]); // ✅ أضف id كـ dependency

  const GetLastReport = ReportData?.data?.reports || [];
  const lastReport = GetLastReport.length ? GetLastReport[0] : null;

  useEffect(() => {
    if (lastReport?.history) {
      setHistoryData({
        medical:
          lastReport.history.medical?.map(({ _id, ...rest }) => rest) || [],
        eye: lastReport.history.eye?.map(({ _id, ...rest }) => rest) || [],
      });
    }
  }, [lastReport]);

  const defaultDiseases = [
    "Diabetes M.",
    "Hypertension",
    "Rheumatic diseases",
    "Thyroid",
    "Tumours",
    "Genetic",
  ];

  const allMedicalDiseases = [
    ...defaultDiseases,
    ...historyData.medical
      .map((d) => d.name)
      .filter((name) => !defaultDiseases.includes(name)),
  ];

  const crop = { unit: "%", aspect: 4 / 3, width: "100" };

  const rightEyeData = {
    rightVisusCC,
    rightSphere,
    rightCylinder,
    rightAxis,
    rightPreviousValue,
    rightSince,
    rightIntraocularPressure,
    rightChamberAngle,
    rightCornealThickness,
    rightAmslerTestAbnormal,
    Rightimages,
    RightDic,
    rightImageCaptureDate,
  };

  const leftEyeData = {
    leftVisusCC,
    leftSphere,
    leftCylinder,
    leftAxis,
    leftPreviousValue,
    leftSince,
    leftIntraocularPressure,
    leftChamberAngle,
    leftCornealThickness,
    leftAmslerTestAbnormal,
    Leftimages,
    LeftDic,
    leftImageCaptureDate,
  };

  const updateMedicalData = (diseaseName, field, value) => {
    setHistoryData((prevData) => {
      let medical = [...prevData.medical];
      const index = medical.findIndex((item) => item.name === diseaseName);
      if (index !== -1) {
        const updatedDisease = { ...medical[index], [field]: value };
        const shouldRemove =
          !updatedDisease.hasCondition && !updatedDisease.appliesTo;
        if (shouldRemove) medical.splice(index, 1);
        else medical[index] = updatedDisease;
      } else {
        if (value) {
          medical.push({
            name: diseaseName,
            hasCondition: field === "hasCondition" ? value : false,
            appliesTo: field === "appliesTo" ? value : null,
          });
        }
      }
      return { ...prevData, medical };
    });
  };

  const updateEyeData = (diseaseName, field, value) => {
    setHistoryData((prev) => {
      const eye = [...prev.eye];
      const index = eye.findIndex((item) => item.name === diseaseName);
      if (index !== -1) {
        const updatedDisease = { ...eye[index], [field]: value };
        const shouldRemove =
          !updatedDisease.hasCondition && !updatedDisease.appliesTo;
        if (shouldRemove) eye.splice(index, 1);
        else eye[index] = updatedDisease;
      } else {
        if (value) {
          eye.push({
            name: diseaseName,
            hasCondition: field === "hasCondition" ? value : false,
            appliesTo: field === "appliesTo" ? value : null,
            ...(diseaseName === "Diabetes M." && {
              sinceWhen: "",
              hba1cValue: "",
              hba1cDate: "",
              diabetesTreatment: "",
            }),
          });
        }
      }
      return { ...prev, eye };
    });
  };

  const handleAddEyeDisease = () => {
    const trimmed = newEyeDisease.trim();
    if (trimmed && !eyeDiseases.includes(trimmed)) {
      setEyeDiseases((prev) => [...prev, trimmed]);
      setHistoryData((prev) => {
        const exists = prev.eye.find(
          (item) => item.name.toLowerCase() === trimmed.toLowerCase(),
        );
        if (!exists) {
          return {
            ...prev,
            eye: [
              ...prev.eye,
              { name: trimmed, hasCondition: false, appliesTo: null },
            ],
          };
        }
        return prev;
      });
      setNewEyeDisease("");
    }
  };

  const handleAddMedicalDisease = () => {
    const trimmed = newMedicalDisease.trim();
    if (!trimmed) return;
    const exists = historyData.medical.find(
      (d) => d.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (!exists) {
      setHistoryData((prev) => ({
        ...prev,
        medical: [
          ...prev.medical,
          { name: trimmed, hasCondition: false, appliesTo: null },
        ],
      }));
    }
    setNewMedicalDisease("");
  };

  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[arr.length - 1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  }

  const HandelSendingData = async (e) => {
    e.preventDefault();

    const ItemRightImages = Array.from(
      Array(Object.keys(Rightimages).length).keys(),
    ).map((item, index) =>
      dataURLtoFile(Rightimages[index], Math.random() + ".png"),
    );

    const ItemLeftImages = Array.from(
      Array(Object.keys(Leftimages).length).keys(),
    ).map((item, index) =>
      dataURLtoFile(Leftimages[index], Math.random() + ".png"),
    );

    if (!validateImageFiles(ItemRightImages)) {
      notify(t("reportForm.notifications.invalidRightEyeImages"), "error");
      return;
    }
    if (!validateImageFiles(ItemLeftImages)) {
      notify(t("reportForm.notifications.invalidLeftEyeImages"), "error");
      return;
    }

    // ✅ Validate كلا العينين
    const isRightValid = validateRightEyeSection(rightEyeData);
    if (!isRightValid) {
      notify(t("reportForm.notifications.completeRightEye"), "error");
      return;
    }

    const isLeftValid = validateLeftEyeSection(leftEyeData);
    if (!isLeftValid) {
      notify(t("reportForm.notifications.completeLeftEye"), "error");
      return;
    }

    const formData = new FormData();
    formData.append("eyeExamination.rightEye.visusCC", rightVisusCC);
    formData.append(
      "eyeExamination.rightEye.previousValue",
      rightPreviousValue,
    );
    formData.append("eyeExamination.rightEye.since", rightSince);
    formData.append("eyeExamination.rightEye.sphere", rightSphere);
    formData.append("eyeExamination.rightEye.cylinder", rightCylinder);
    formData.append("eyeExamination.rightEye.axis", rightAxis);
    formData.append(
      "eyeExamination.rightEye.intraocularPressure",
      rightIntraocularPressure,
    );
    formData.append(
      "eyeExamination.rightEye.imageCaptureDate",
      rightImageCaptureDate,
    );
    formData.append(
      "eyeExamination.rightEye.cornealThickness",
      rightCornealThickness,
    );
    formData.append("eyeExamination.rightEye.chamberAngle", rightChamberAngle);
    formData.append(
      "eyeExamination.rightEye.amslerTestAbnormal",
      rightAmslerTestAbnormal,
    );

    formData.append("eyeExamination.leftEye.visusCC", leftVisusCC);
    formData.append("eyeExamination.leftEye.previousValue", leftPreviousValue);
    formData.append("eyeExamination.leftEye.since", leftSince);
    formData.append("eyeExamination.leftEye.sphere", leftSphere);
    formData.append("eyeExamination.leftEye.cylinder", leftCylinder);
    formData.append("eyeExamination.leftEye.axis", leftAxis);
    formData.append(
      "eyeExamination.leftEye.intraocularPressure",
      leftIntraocularPressure,
    );
    formData.append(
      "eyeExamination.leftEye.imageCaptureDate",
      leftImageCaptureDate,
    );
    formData.append(
      "eyeExamination.leftEye.cornealThickness",
      leftCornealThickness,
    );
    formData.append("eyeExamination.leftEye.chamberAngle", leftChamberAngle);
    formData.append(
      "eyeExamination.leftEye.amslerTestAbnormal",
      leftAmslerTestAbnormal,
    );

    if (RightDic) formData.append("rightEyeDic", RightDic);
    if (LeftDic) formData.append("leftEyeDic", LeftDic);

    historyData.medical.forEach((condition, index) => {
      formData.append(`history[medical][${index}][name]`, condition.name);
      formData.append(
        `history[medical][${index}][hasCondition]`,
        condition.hasCondition,
      );
      formData.append(
        `history[medical][${index}][appliesTo]`,
        condition.appliesTo ?? "",
      );
      if (condition.name === "Diabetes M." && condition.appliesTo === "Self") {
        formData.append(
          `history[medical][${index}][sinceWhen]`,
          condition.sinceWhen || "",
        );
        // ✅ متبعتش hba1cValue لو فاضي عشان الـ Schema بيتوقع Number
        if (condition.hba1cValue) {
          formData.append(
            `history[medical][${index}][hba1cValue]`,
            condition.hba1cValue,
          );
        }
        formData.append(
          `history[medical][${index}][hba1cDate]`,
          condition.hba1cDate || "",
        );
        formData.append(
          `history[medical][${index}][diabetesTreatment]`,
          condition.diabetesTreatment || "",
        );
      }
    });

    historyData.eye.forEach((condition, index) => {
      formData.append(`history[eye][${index}][name]`, condition.name);
      formData.append(
        `history[eye][${index}][hasCondition]`,
        condition.hasCondition,
      );
      formData.append(
        `history[eye][${index}][appliesTo]`,
        condition.appliesTo ?? "",
      );
    });

    ItemRightImages.forEach((item) => formData.append("rightEyeImages", item));
    ItemLeftImages.forEach((item) => formData.append("leftEyeImages", item));

    setloading(true);
    setispress(true);
    const response = await dispatch(CreateReport(formData, id));
    console.log("الرد من الريدوكس", response);
    setloading(false);
  };

  useEffect(() => {
    if (loading === false && Report) {
      setispress(false);
      if (Report?.status === 201) {
        notify("done", "success");
        Navigate(`/`);
      } else {
        notify(Report?.data?.message || "there is problem", "error");
      }
      setTimeout(() => setloading(true), 1500);
    }
  }, [loading, Report]);

  const handleOuterTabSelect = (key) => {
    if (key === activeTab) return;
    if (activeTab === "history" && innerTab === "medical") {
      if (!validateMedicalHistory(historyData)) {
        notify(t("reportForm.notifications.completeMedicalHistory"), "warn");
        return;
      }
    } else if (activeTab === "history" && innerTab === "eye") {
      if (!validateEyeHistory(historyData)) {
        notify(t("reportForm.notifications.completeEyeHistory"), "warn");
        return;
      }
    } else if (activeTab === "exam" && innerTab === "rightEye") {
      if (!validateRightEyeSection(rightEyeData)) {
        notify(t("reportForm.notifications.completeRightEye"), "warn");
        return;
      }
    }
    setActiveTab(key);
    if (key === "exam") setInnerTab("rightEye");
  };

  const handleInnerTabSelect = (key) => {
    if (key === innerTab) return;
    if (activeTab === "history" && innerTab === "medical" && key === "eye") {
      if (!validateMedicalHistory(historyData)) {
        notify(
          t("reportForm.notifications.completeMedicalHistorySwitch"),
          "warn",
        );
        return;
      }
    } else if (
      activeTab === "exam" &&
      innerTab === "rightEye" &&
      key === "leftEye"
    ) {
      if (!validateRightEyeSection(rightEyeData)) {
        notify(t("reportForm.notifications.completeRightEyeSwitch"), "warn");
        return;
      }
    }
    setInnerTab(key);
  };

  // onChange handlers
  const onChangeMedicalDisease = (e) => setNewMedicalDisease(e.target.value);
  const onChangeEyeDisease = (e) => setNewEyeDisease(e.target.value);
  const onChangeRightVisusCC = (e) => setRightVisusCC(e.target.value);
  const onChangeRightPreviousValue = (e) =>
    setRightPreviousValue(e.target.value);
  const onChangeRightSince = (e) => setRightSince(e.target.value);
  const onChangeRightImageCaptureDate = (e) =>
    setRightImageCaptureDate(e.target.value);
  const onChangeRightSphere = (e) => setRightSphere(e.target.value);
  const onChangeRightCylinder = (e) => setRightCylinder(e.target.value);
  const onChangeRightAxis = (e) => setRightAxis(e.target.value);
  const onChangeRightIntraocularPressure = (e) =>
    setRightIntraocularPressure(e.target.value);
  const onChangeRightCornealThickness = (e) =>
    setRightCornealThickness(e.target.value);
  const onChangeRightChamberAngle = (e) => setRightChamberAngle(e.target.value);
  const onChangeRightAmslerTestAbnormal = (e) =>
    setRightAmslerTestAbnormal(e.target.checked);
  const onChangeLeftVisusCC = (e) => setLeftVisusCC(e.target.value);
  const onChangeLeftPreviousValue = (e) => setLeftPreviousValue(e.target.value);
  const onChangeLeftSince = (e) => setLeftSince(e.target.value);
  const onChangeLeftImageCaptureDate = (e) =>
    setLeftImageCaptureDate(e.target.value);
  const onChangeLeftSphere = (e) => setLeftSphere(e.target.value);
  const onChangeLeftCylinder = (e) => setLeftCylinder(e.target.value);
  const onChangeLeftAmslerTestAbnormal = (e) =>
    setLeftAmslerTestAbnormal(e.target.checked);
  const onChangeLeftAxis = (e) => setLeftAxis(e.target.value);
  const onChangeLeftIntraocularPressure = (e) =>
    setLeftIntraocularPressure(e.target.value);
  const onChangeLeftCornealThickness = (e) =>
    setLeftCornealThickness(e.target.value);
  const onChangeLeftChamberAngle = (e) => setLeftChamberAngle(e.target.value);
  const onChangeRightDic = (e) => {
    if (e.target.files?.[0]) setRightDic(e.target.files[0]);
  };
  const onChangeLeftDic = (e) => {
    if (e.target.files?.[0]) setLeftDic(e.target.files[0]);
  };

  return [
    patient,
    activeTab,
    handleOuterTabSelect,
    innerTab,
    handleInnerTabSelect,
    allMedicalDiseases,
    historyData,
    updateMedicalData,
    newMedicalDisease,
    handleAddMedicalDisease,
    setInnerTab,
    eyeDiseases,
    newEyeDisease,
    setActiveTab,
    rightVisusCC,
    rightPreviousValue,
    rightSince,
    Rightimages,
    setRightImages,
    crop,
    rightImageCaptureDate,
    rightSphere,
    rightCylinder,
    rightAxis,
    rightIntraocularPressure,
    rightCornealThickness,
    rightChamberAngle,
    rightAmslerTestAbnormal,
    rightEyeData,
    leftVisusCC,
    leftPreviousValue,
    leftSince,
    Leftimages,
    setLeftImages,
    leftImageCaptureDate,
    leftSphere,
    leftCylinder,
    leftAxis,
    leftIntraocularPressure,
    leftCornealThickness,
    leftChamberAngle,
    leftAmslerTestAbnormal,
    HandelSendingData,
    ispress,
    loading,
    handleAddEyeDisease,
    onChangeMedicalDisease,
    onChangeLeftAmslerTestAbnormal,
    onChangeLeftAxis,
    onChangeLeftChamberAngle,
    onChangeLeftCylinder,
    onChangeLeftVisusCC,
    onChangeLeftSphere,
    onChangeLeftSince,
    onChangeLeftPreviousValue,
    onChangeLeftIntraocularPressure,
    onChangeEyeDisease,
    onChangeRightIntraocularPressure,
    onChangeLeftCornealThickness,
    onChangeLeftImageCaptureDate,
    onChangeRightAmslerTestAbnormal,
    onChangeRightChamberAngle,
    onChangeRightCornealThickness,
    onChangeRightAxis,
    onChangeRightCylinder,
    onChangeRightSphere,
    onChangeRightImageCaptureDate,
    onChangeRightSince,
    onChangeRightPreviousValue,
    onChangeRightVisusCC,
    updateEyeData,
    RightDic,
    onChangeRightDic,
    LeftDic,
    onChangeLeftDic,
  ];
};
