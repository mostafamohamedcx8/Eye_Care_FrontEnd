import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllDoctor, getAllDOCTORPage } from "../Redux/actions/Doctoraction";
import { useParams } from "react-router-dom";
import {
  getSpecificpatient,
  SendPatient,
} from "../Redux/actions/Patientaction";
import notify from "../Hook/useNotification";

export const Doctorpage_Hook = (t) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ispress, setispress] = useState(false);

  useEffect(() => {
    dispatch(getAllDoctor(4, keyword));
  }, [keyword]);
  useEffect(() => {
    dispatch(getSpecificpatient(id));
  }, []);
  const patient = useSelector((state) => state.allpatient.getspecificpatient);
  console.log(patient);

  const onChangesendPatient = (e, doctor_id) => {
    sendPatientToDoctor(e, doctor_id);
  };

  const doctorData = useSelector((state) => state.alldoctor.doctor);

  let pagecount = 0;
  if (doctorData?.paginationresults?.numberOfPages) {
    pagecount = doctorData.paginationresults.numberOfPages;
  }

  const getpage = (page) => {
    dispatch(getAllDOCTORPage(page));
  };

  const doctors = doctorData?.data || [];

  const onChangeKeyword = (e) => {
    setKeyword(e.target.value);
  };

  const sendPatientToDoctor = async (event, doctorId) => {
    event.preventDefault();
    const dataToSend = {
      patientId: id,
      doctorId: doctorId,
    };
    setLoading(true);
    setispress(true);
    await dispatch(SendPatient(dataToSend));
    setLoading(false);
  };

  const res = useSelector((state) => state.allpatient.sendpatient);
  console.log("respatient", res);

  useEffect(() => {
    if (!loading && ispress) {
      if (res?.status === 200) {
        notify(t("doctorpage.notifications.success"), "success");
      } else if (res?.status === 400) {
        notify(t("doctorpage.notifications.warn"), "warn");
      } else notify(t("doctorpage.notifications.error"), "error");

      setispress(false);
      setTimeout(() => {
        setispress(false);
      }, 1000);
    }
  }, [loading]);

  return [
    patient,
    keyword,
    loading,
    onChangeKeyword,
    doctors,
    pagecount,
    getpage,
    onChangesendPatient,
  ];
};
