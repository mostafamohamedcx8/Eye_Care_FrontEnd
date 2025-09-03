import { useRef, useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getSpecificReport,
  MarkDocotrFeedback,
} from "./../Redux/actions/Reportaction";
import { useNavigate } from "react-router-dom";

export const Examination_Hook = () => {
  const navigate = useNavigate();
  const userFromStorage = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    dispatch(getSpecificReport(id));
  }, []);

  const ReportData = useSelector((state) => state.allreport.specificreport);
  // Add optional chaining for safety

  const reportRef = useRef();

  // const handleDownloadPDF = () => {
  //   const element = reportRef.current;

  //   const opt = {
  //     margin: 0,
  //     filename: "eye-examination-report.pdf",
  //     image: { type: "png", quality: 1.0 },
  //     html2canvas: {
  //       scale: 2,
  //       useCORS: true,
  //       allowTaint: false,
  //       logging: true,
  //       ignoreElements: (el) => {
  //         return el.classList?.contains("no-print");
  //       },
  //     },
  //     jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  //   };

  //   html2pdf().set(opt).from(element).save();
  // };

  const handlePrint = () => {
    window.print();
  };
  const Report = ReportData.data || [];
  console.log("Rdsfds", Report);

  const opticianName = `${Report?.optician?.firstname} ${Report?.optician?.lastname}`;
  const addressParts = [
    Report?.optician?.state,
    Report?.optician?.city,
    Report?.optician?.fullAddress,
  ];
  const Email = `${Report?.optician?.email}`;
  const PhoneNumber = `${Report?.optician?.phoneNumber}`;
  const defaultLogo = "/upload.png";

  const LogoImage = Report?.optician?.logoimg || defaultLogo;

  console.log("image", Report?.optician?.logoimg);

  const opticianAddress = addressParts.join(", ");

  const displayValue = (value) => {
    return value !== undefined && value !== null && value !== "" ? (
      value
    ) : (
      <span style={{ color: "red" }}>--</span>
    );
  };

  const displayDate = (date) => {
    return date ? (
      new Date(date).toLocaleDateString("de-DE")
    ) : (
      <span style={{ color: "red" }}>--</span>
    );
  };

  // دالة لعرض نعم/لا أو X حمراء لو مش موجود
  const displayBoolean = (value) => {
    return value !== undefined ? (
      value ? (
        "Yes"
      ) : (
        "No"
      )
    ) : (
      <span style={{ color: "red" }}>--</span>
    );
  };

  const handleMarkAsRead = (feedback) => {
    if (!feedback.readed) {
      dispatch(
        MarkDocotrFeedback(Report._id, {
          doctorId: feedback.doctor._id,
        })
      );
    }
  };

  return [
    reportRef,
    Report,
    handleMarkAsRead,
    userFromStorage,
    handlePrint,
    setSelectedImage,
    selectedImage,
    displayValue,
    displayDate,
    displayBoolean,
    opticianName,
    opticianAddress,
    Email,
    PhoneNumber,
    LogoImage,
  ];
};
