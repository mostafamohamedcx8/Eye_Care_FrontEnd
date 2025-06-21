import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpecificpatient } from "../Redux/actions/Patientaction";
import notify from "../Hook/useNotification";
import { CreateReport } from "../Redux/actions/Reportaction";
import { useNavigate, useParams } from "react-router-dom";
import {
  validateEyeHistory,
  validateMedicalHistory,
  validateRightEyeSection,
  validateImageFiles,
  validateLeftEyeSection,
} from "../Validations/reportValidation";

export const ReportDetails_Hook = () => {
  const { id } = useParams();
  const Navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("history");
  const [innerTab, setInnerTab] = useState("medical");
  const [Rightimages, setRightImages] = useState([]);
  const [Leftimages, setLeftImages] = useState([]);
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

  // Left Eye States
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
  const [historyData, setHistoryData] = useState({
    medical: [
      // هيتم ملء الداتا هنا بناءً على التشيك بوكس
    ],
    eye: [],
  });
  const [newMedicalDisease, setNewMedicalDisease] = useState("");
  const [newEyeDisease, setNewEyeDisease] = useState("");
  const [loading, setloading] = useState(true);
  const [ispress, setispress] = useState(false);
  const Report = useSelector((state) => state.allreport.Report);

  const defaultDiseases = [
    "Diabetes M.",
    "Hypertension",
    "Rheumatic diseases",
    "Thyroid",
    "Tumours",
    "Genetic",
  ];

  // دمج الأمراض الأصلية مع اللي اتضافت بواسطة المستخدم
  const allMedicalDiseases = [
    ...defaultDiseases,
    ...historyData.medical
      .map((d) => d.name)
      .filter((name) => !defaultDiseases.includes(name)),
  ];
  const [eyeDiseases, setEyeDiseases] = useState([
    "Cataract",
    "Glaucoma",
    "Age-related macular degeneration",
  ]);

  const crop = {
    unit: "%",
    aspect: 4 / 3,
    width: "100",
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSpecificpatient(id));
  }, []);

  const patient = useSelector((state) => state.allpatient.getspecificpatient);
  console.log(patient);
  const updateMedicalData = (diseaseName, field, value) => {
    setHistoryData((prevData) => {
      let medical = [...prevData.medical];
      const index = medical.findIndex((item) => item.name === diseaseName);

      if (index !== -1) {
        // Disease exists
        const updatedDisease = { ...medical[index], [field]: value };

        // Remove if both are cleared
        const shouldRemove =
          !updatedDisease.hasCondition && !updatedDisease.appliesTo;

        if (shouldRemove) {
          medical.splice(index, 1); // Remove from list
        } else {
          medical[index] = updatedDisease; // Update value
        }
      } else {
        // If not found and value is meaningful, add it
        if (value) {
          const newDisease = {
            name: diseaseName,
            hasCondition: field === "hasCondition" ? value : false,
            appliesTo: field === "appliesTo" ? value : null,
          };
          medical.push(newDisease);
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
        // المرض موجود مسبقاً
        const updatedDisease = { ...eye[index], [field]: value };

        const shouldRemove =
          !updatedDisease.hasCondition && !updatedDisease.appliesTo;

        if (shouldRemove) {
          eye.splice(index, 1); // احذف المرض
        } else {
          eye[index] = updatedDisease; // حدث البيانات
        }
      } else {
        // المرض غير موجود، أضفه فقط لو القيمة مهمة
        if (value) {
          const newDisease = {
            name: diseaseName,
            hasCondition: field === "hasCondition" ? value : false,
            appliesTo: field === "appliesTo" ? value : null,
          };
          eye.push(newDisease);
        }
      }

      return { ...prev, eye };
    });
  };

  const handleAddEyeDisease = () => {
    const trimmed = newEyeDisease.trim();
    if (trimmed && !eyeDiseases.includes(trimmed)) {
      setEyeDiseases((prev) => [...prev, trimmed]);

      // أضف إلى historyData.eye
      setHistoryData((prev) => {
        const exists = prev.eye.find(
          (item) => item.name.toLowerCase() === trimmed.toLowerCase()
        );
        if (!exists) {
          return {
            ...prev,
            eye: [
              ...prev.eye,
              {
                name: trimmed,
                hasCondition: false,
                appliesTo: null,
              },
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
      (d) => d.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (!exists) {
      setHistoryData((prev) => ({
        ...prev,
        medical: [
          ...prev.medical,
          {
            name: trimmed,
            hasCondition: false,
            appliesTo: null,
          },
        ],
      }));
    }

    setNewMedicalDisease(""); // تفريغ الحقل بعد الإضافة
  };

  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[arr.length - 1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  const resetFormFields = () => {
    setActiveTab("patient");
    setInnerTab("medical");
    setRightImages([]);
    setLeftImages([]);

    setRightVisusCC("");
    setRightPreviousValue("");
    setRightSince("");
    setRightSphere("");
    setRightCylinder("");
    setRightAxis("");
    setRightIntraocularPressure("");
    setRightCornealThickness("");
    setRightChamberAngle("");
    setRightAmslerTestAbnormal(false);

    setLeftVisusCC("");
    setLeftPreviousValue("");
    setLeftSince("");
    setLeftSphere("");
    setLeftCylinder("");
    setLeftAxis("");
    setLeftIntraocularPressure("");
    setLeftCornealThickness("");
    setLeftChamberAngle("");
    setLeftAmslerTestAbnormal(false);
    setHistoryData({
      medical: [],
      eye: [],
    });
  };

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
    leftImageCaptureDate,
  };
  const HandelSendingData = async (e) => {
    e.preventDefault();
    const ItemRightImages = Array.from(
      Array(Object.keys(Rightimages).length).keys()
    ).map((item, index) =>
      dataURLtoFile(Rightimages[index], Math.random() + ".png")
    );

    const ItemLeftImages = Array.from(
      Array(Object.keys(Leftimages).length).keys()
    ).map((item, index) =>
      dataURLtoFile(Leftimages[index], Math.random() + ".png")
    );

    // التحقق من أن كل الملفات صور
    if (!validateImageFiles(ItemRightImages)) {
      notify("Some right eye images are not valid image files.", "error");
      return;
    }
    if (!validateImageFiles(ItemLeftImages)) {
      notify("Some left eye images are not valid image files.", "error");
      return;
    }

    // تجهيز البيانات للـ validation
    const history = historyData;
    const eyeExamination = {
      rightEye: {
        visusCC: rightVisusCC,
        previousValue: rightPreviousValue,
        since: rightSince,
        sphere: rightSphere,
        cylinder: rightCylinder,
        intraocularPressure: rightIntraocularPressure,
        cornealThickness: rightCornealThickness,
        chamberAngle: rightChamberAngle,
      },
      leftEye: {
        visusCC: leftVisusCC,
        previousValue: leftPreviousValue,
        since: leftSince,
        sphere: leftSphere,
        cylinder: leftCylinder,
        intraocularPressure: leftIntraocularPressure,
        cornealThickness: leftCornealThickness,
        chamberAngle: leftChamberAngle,
      },
    };

    // التحقق من صحة البيانات
    // const isValid = validateEyeExamination({
    //   history,
    //   eyeExamination,
    // });
    // if (!isValid) return;
    const isValid = validateLeftEyeSection(leftEyeData);
    if (!isValid) return;

    const formData = new FormData();
    formData.append("eyeExamination.rightEye.visusCC", rightVisusCC);
    formData.append(
      "eyeExamination.rightEye.previousValue",
      rightPreviousValue
    );
    formData.append(
      "eyeExamination.rightEye.since",
      rightSince === "" ? "" : rightSince
    );
    formData.append("eyeExamination.rightEye.sphere", rightSphere);
    formData.append("eyeExamination.rightEye.cylinder", rightCylinder);
    formData.append("eyeExamination.rightEye.axis", rightAxis);
    formData.append(
      "eyeExamination.rightEye.intraocularPressure",
      rightIntraocularPressure
    );
    formData.append(
      "eyeExamination.rightEye.imageCaptureDate",
      rightImageCaptureDate
    );
    formData.append(
      "eyeExamination.rightEye.cornealThickness",
      rightCornealThickness
    );
    formData.append("eyeExamination.rightEye.chamberAngle", rightChamberAngle);
    formData.append(
      "eyeExamination.rightEye.amslerTestAbnormal",
      rightAmslerTestAbnormal
    );

    formData.append("eyeExamination.leftEye.visusCC", leftVisusCC);
    formData.append("eyeExamination.leftEye.previousValue", leftPreviousValue);
    formData.append(
      "eyeExamination.leftEye.since",
      leftSince === "" ? "" : leftSince
    );
    formData.append("eyeExamination.leftEye.sphere", leftSphere);
    formData.append("eyeExamination.leftEye.cylinder", leftCylinder);
    formData.append("eyeExamination.leftEye.axis", leftAxis);
    formData.append(
      "eyeExamination.leftEye.intraocularPressure",
      leftIntraocularPressure
    );
    formData.append(
      "eyeExamination.leftEye.imageCaptureDate",
      leftImageCaptureDate
    );
    formData.append(
      "eyeExamination.leftEye.cornealThickness",
      leftCornealThickness
    );
    formData.append("eyeExamination.leftEye.chamberAngle", leftChamberAngle);
    formData.append(
      "eyeExamination.leftEye.amslerTestAbnormal",
      leftAmslerTestAbnormal
    );

    // Append medical history

    historyData.medical.forEach((condition, index) => {
      formData.append(`history[medical][${index}][name]`, condition.name);
      formData.append(
        `history[medical][${index}][hasCondition]`,
        condition.hasCondition
      );
      formData.append(
        `history[medical][${index}][appliesTo]`,
        condition.appliesTo
      );
    });

    // Append eye history
    historyData.eye.forEach((condition, index) => {
      formData.append(`history[eye][${index}][name]`, condition.name);
      formData.append(
        `history[eye][${index}][hasCondition]`,
        condition.hasCondition
      );
      formData.append(`history[eye][${index}][appliesTo]`, condition.appliesTo);
    });

    ItemRightImages.map((item) => formData.append("rightEyeImages", item));
    ItemLeftImages.map((item) => formData.append("leftEyeImages", item));

    // طباعة البيانات لتفقدها
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    setloading(true);
    setispress(true);
    const res = await dispatch(CreateReport(formData, id));

    console.log("Response:", res);
    setloading(false);
  };

  useEffect(() => {
    if (loading === false && Report) {
      setispress(false);
      if (Report?.status === 201) {
        Navigate(`/ExaminationReport/${Report?.data?.data?._id}`);
        // resetFormFields();
        notify("done", "success");
      } else {
        notify(Report?.data?.message || "there is problem", "error");
      }

      // Reset loading بعد شوية علشان الزر يرجع لحالته الطبيعية
      setTimeout(() => {
        setloading(true);
      }, 1500);
    }
  }, [loading, Report]);

  const handleOuterTabSelect = (key) => {
    if (key === activeTab) return;
    if (activeTab === "history" && innerTab === "medical") {
      const isValid = validateMedicalHistory(historyData);
      if (!isValid) {
        notify(
          "Please complete the Medical History section before proceeding.",
          "Warn"
        );
        return;
      }
    } else if (activeTab === "history" && innerTab === "eye") {
      const isValid = validateEyeHistory(historyData);
      if (!isValid) {
        notify(
          "Please complete the Eye History section before proceeding.",
          "Warn"
        );
        return;
      }
    } else if (activeTab === "exam" && innerTab === "rightEye") {
      const isValid = validateRightEyeSection(rightEyeData);
      if (!isValid) {
        notify(
          "Please complete the Right Eye section before proceeding.",
          "Warn"
        );
        return;
      }
    }
    setActiveTab(key);
    if (key === "exam") {
      setInnerTab("rightEye");
    }
  };

  const handleInnerTabSelect = (key) => {
    if (key === innerTab) return;
    if (activeTab === "history" && innerTab === "medical" && key === "eye") {
      const isValid = validateMedicalHistory(historyData);
      if (!isValid) {
        notify(
          "Please complete the Medical History section before switching.",
          "Warn"
        );
        return;
      }
    } else if (
      activeTab === "exam" &&
      innerTab === "rightEye" &&
      key === "leftEye"
    ) {
      const isValid = validateRightEyeSection(rightEyeData);
      if (!isValid) {
        notify(
          "Please complete the Right Eye section before switching.",
          "Warn"
        );
        return;
      }
    }
    setInnerTab(key);
  };

  const onChangeMedicalDisease = (e) => {
    setNewMedicalDisease(e.target.value);
  };

  const onChangeEyeDisease = (e) => {
    setNewEyeDisease(e.target.value);
  };
  const onChangeRightVisusCC = (e) => {
    setRightVisusCC(e.target.value);
  };

  const onChangeRightPreviousValue = (e) => {
    setRightPreviousValue(e.target.value);
  };
  const onChangeRightSince = (e) => {
    setRightSince(e.target.value);
  };
  const onChangeRightImageCaptureDate = (e) => {
    setRightImageCaptureDate(e.target.value);
  };

  const onChangeRightSphere = (e) => {
    setRightSphere(e.target.value);
  };
  const onChangeRightCylinder = (e) => {
    setRightCylinder(e.target.value);
  };
  const onChangeRightAxis = (e) => {
    setRightAxis(e.target.value);
  };

  const onChangeRightIntraocularPressure = (e) => {
    setRightIntraocularPressure(e.target.value);
  };
  const onChangeRightCornealThickness = (e) => {
    setRightCornealThickness(e.target.value);
  };
  const onChangeRightChamberAngle = (e) => {
    setRightChamberAngle(e.target.value);
  };
  const onChangeRightAmslerTestAbnormal = (e) => {
    setRightAmslerTestAbnormal(e.target.checked);
  };

  const onChangeLeftVisusCC = (e) => {
    setLeftVisusCC(e.target.value);
  };
  const onChangeLeftPreviousValue = (e) => {
    setLeftPreviousValue(e.target.value);
  };
  const onChangeLeftSince = (e) => {
    setLeftSince(e.target.value);
  };
  const onChangeLeftImageCaptureDate = (e) => {
    setLeftImageCaptureDate(e.target.value);
  };
  const onChangeLeftSphere = (e) => {
    setLeftSphere(e.target.value);
  };
  const onChangeLeftCylinder = (e) => {
    setLeftCylinder(e.target.value);
  };
  const onChangeLeftAmslerTestAbnormal = (e) => {
    setLeftAmslerTestAbnormal(e.target.checked);
  };
  const onChangeLeftAxis = (e) => {
    setLeftAxis(e.target.value);
  };
  const onChangeLeftIntraocularPressure = (e) => {
    setLeftIntraocularPressure(e.target.value);
  };
  const onChangeLeftCornealThickness = (e) => {
    setLeftCornealThickness(e.target.value);
  };
  const onChangeLeftChamberAngle = (e) => {
    setLeftChamberAngle(e.target.value);
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
  ];
};
