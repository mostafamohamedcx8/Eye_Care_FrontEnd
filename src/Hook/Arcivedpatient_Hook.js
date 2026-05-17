import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getMyArchivedpatient,
  getAllMyArchivedPatientPage,
  deleteMyPatient,
  toggleArchivePatient,
} from "../Redux/actions/Patientaction";
import notify from "../Hook/useNotification";

export const Arcivedpatient_Hook = (t) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [archiveLoading, setArchiveLoading] = useState({});
  const [keyword, setKeyword] = useState("");
  const [show, setShow] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const userFromStorage = JSON.parse(localStorage.getItem("user"));

  const MypatinetData = useSelector(
    (state) => state.allpatient.archivedpatient,
  );
  const Loading = useSelector((state) => state.allpatient.loading);

  const AllPatient = MypatinetData?.data?.patients || [];
  let pagecount = 0;
  if (MypatinetData?.pagination?.numberOfPages) {
    pagecount = MypatinetData.pagination.numberOfPages;
  }
  useEffect(() => {
    dispatch(getMyArchivedpatient(10, keyword));
  }, [keyword, dispatch]);

  const getpage = (page) => {
    dispatch(getAllMyArchivedPatientPage(page));
  };

  const handleClose = () => {
    setShow(false);
    setDeleteId(null);
  };

  const handleShow = (id) => {
    setDeleteId(id);
    setShow(true);
  };

  const handleView = (id) => {
    navigate(`/ReportsList/${id}`); // ✅ شيل الـ setTimeout مش محتاجه
  };

  const handleDeleteConfirmed = async () => {
    const res = await dispatch(deleteMyPatient(deleteId));
    handleClose();
    // ✅ نفس نمط الـ Hook السابق
    dispatch(getMyArchivedpatient(10, keyword));
    notify(t("patientTable.notifications.deleteSuccess"), "success");
  };

  const onChangeKeyword = (e) => {
    setKeyword(e.target.value);
  };

  const handleToggleArchive = async (patientId) => {
    try {
      setArchiveLoading((prev) => ({ ...prev, [patientId]: true }));
      await dispatch(toggleArchivePatient(patientId));
      // ✅ جيب الداتا مباشرة بدل refreshData state
      dispatch(getMyArchivedpatient(10, keyword));
      notify(t("patientTable.notifications.archiveSuccess"), "success");
    } catch (error) {
      notify(t("patientTable.notifications.archiveError"), "error");
    } finally {
      setArchiveLoading((prev) => ({ ...prev, [patientId]: false }));
    }
  };

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
