import { useState, useEffect, useCallback } from "react";
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
  const [ispress, setIspress] = useState(false);

  // ─── جلب بيانات المريض مرة واحدة عند التحميل ───────────────────────────────
  useEffect(() => {
    if (id) {
      dispatch(getSpecificpatient(id));
    }
  }, [dispatch, id]);

  // ─── جلب الأطباء مع debounce عند تغيير الكلمة المفتاحية ─────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(getAllDoctor(4, keyword));
    }, 400);

    return () => clearTimeout(timer); // cleanup عشان متبعتش request لكل حرف
  }, [dispatch, keyword]);

  // ─── Selectors ───────────────────────────────────────────────────────────────
  const patientData = useSelector(
    (state) => state.allpatient.getspecificpatient,
  );
  // patient هو object مش array
  const patient = patientData?.data?.patient || null;

  const doctorData = useSelector((state) => state.alldoctor.doctor);
  const doctors = doctorData?.data?.doctors || [];
  const pagecount = doctorData?.paginationresults?.numberOfPages || 0;

  const sendRes = useSelector((state) => state.allpatient.sendpatient);

  // ─── مراقبة نتيجة إرسال المريض بعد انتهاء الـ loading ──────────────────────
  useEffect(() => {
    if (!loading && ispress) {
      if (sendRes?.status === 200) {
        notify(t("doctorpage.notifications.success"), "success");
      } else if (sendRes?.status === 400) {
        notify(t("doctorpage.notifications.warn"), "warn");
      } else {
        notify(t("doctorpage.notifications.error"), "error");
      }

      setIspress(false);
    }
  }, [loading, ispress, sendRes, t]);

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const onChangeKeyword = useCallback((e) => {
    setKeyword(e.target.value);
  }, []);

  const getpage = useCallback(
    (page) => {
      dispatch(getAllDOCTORPage(page));
    },
    [dispatch],
  );

  const onChangesendPatient = useCallback(
    async (e, doctorId) => {
      e.preventDefault();

      if (!id || !doctorId) {
        notify(t("doctorpage.notifications.error"), "error");
        return;
      }

      setLoading(true);
      setIspress(true);

      try {
        await dispatch(SendPatient(id, { doctorId }));
      } catch (err) {
        notify(t("doctorpage.notifications.error"), "error");
        setIspress(false);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, id, t],
  );

  // ─── Return ───────────────────────────────────────────────────────────────────
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
