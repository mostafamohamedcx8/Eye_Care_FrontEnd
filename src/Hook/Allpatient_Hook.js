import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getMypatient,
  getAllMyPatientPage,
  deleteMyPatient,
  toggleArchivePatient,
} from "./../Redux/actions/Patientaction";
import notify from "../Hook/useNotification";
export const Allpatient_Hook = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState("");
  const [archiveLoading, setArchiveLoading] = useState({});
  const [refreshData, setRefreshData] = useState(false);
  const [show, setShow] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);

  const userFromStorage = JSON.parse(localStorage.getItem("user"));

  const handleClose = () => {
    setShow(false);
    setDeleteId(null);
  };
  const handleShow = (id) => {
    setDeleteId(id);
    setShow(true);
  };

  useEffect(() => {
    dispatch(getMypatient(10, keyword));
  }, [keyword]);

  const MypatinetData = useSelector((state) => state.allpatient.mypatient);
  const Loading = useSelector((state) => state.allpatient.loading);

  let pagecount = 0;
  if (MypatinetData?.paginationresults?.numberOfPages) {
    pagecount = MypatinetData?.paginationresults?.numberOfPages;
  }

  const getpage = (page) => {
    dispatch(getAllMyPatientPage(page));
  };

  const AllPatient = MypatinetData?.data || [];
  console.log(AllPatient);

  const handleView = (id) => {
    setTimeout(() => {
      navigate(`/ReportsList/${id}`);
    }, 1000);
  };

  const handleDeleteConfirmed = async () => {
    setLoading(true);
    await dispatch(deleteMyPatient(deleteId));
    setLoading(false);
    handleClose();
  };

  const onChangeKeyword = (e) => {
    setKeyword(e.target.value);
  };

  const res = useSelector((state) => state.allpatient.deletpatient);
  useEffect(() => {
    if (loading === false) {
      if (res === "") {
        notify("Patient deleted successfully", "success");
        setTimeout(() => {
          window.location.reload(false);
        }, 1000);
      } else {
        notify("There was a problem with the deletion", "error");
      }
    }
  }, [loading]);

  const handleToggleArchive = async (patientId) => {
    try {
      // تعيين loading للمريض المحدد
      setArchiveLoading((prev) => ({ ...prev, [patientId]: true }));

      // استدعاء الـ action
      await dispatch(toggleArchivePatient(patientId));

      // إعادة تحميل البيانات بعد نجاح العملية
      setRefreshData((prev) => !prev);

      // إظهار رسالة نجاح (اختياري)
      // يمكنك استخدام toast أو alert
      notify("Patient archive status updated successfully!", "success");
    } catch (error) {
      notify("Faild updating patient archive status", "error");
    } finally {
      // إلغاء loading
      setArchiveLoading((prev) => ({ ...prev, [patientId]: false }));
    }
  };

  // useEffect لإعادة تحميل البيانات عند تغيير refreshData
  useEffect(() => {
    if (refreshData !== false) {
      // استدعاء دالة جلب البيانات مرة أخرى
      // مثال: dispatch(getAllPatients());
      dispatch(getMypatient(10, keyword));
    }
  }, [refreshData, keyword]);

  return [
    keyword,
    Loading,
    AllPatient,
    userFromStorage,
    handleShow,
    handleView,
    handleToggleArchive,
    archiveLoading,
    pagecount,
    getpage,
    show,
    handleClose,
    handleDeleteConfirmed,
    onChangeKeyword,
  ];
};
