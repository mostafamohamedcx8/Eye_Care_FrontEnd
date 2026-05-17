import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getMypatient,
  getAllMyPatientPage,
  deleteMyPatient,
  toggleArchivePatient,
} from "./../Redux/actions/Patientaction";
import notify from "../Hook/useNotification";
import { useTranslation } from "react-i18next";

export const Allpatient_Hook = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [keyword, setKeyword] = useState("");
  const [archiveLoading, setArchiveLoading] = useState({});
  const [show, setShow] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
  }, [keyword, dispatch]);

  const MypatinetData = useSelector((state) => state.allpatient.mypatient);

  const Loading = useSelector((state) => state.allpatient.loading);

  let pagecount = 0;
  if (MypatinetData?.pagination?.numberOfPages) {
    pagecount = MypatinetData.pagination.numberOfPages;
  }

  const getpage = (page) => {
    dispatch(getAllMyPatientPage(page));
  };

  const AllPatient = MypatinetData?.data?.patients || [];

  const handleView = (id) => {
    navigate(`/ReportsList/${id}`);
  };

  const handleDeleteConfirmed = async () => {
    setDeleteLoading(true);
    await dispatch(deleteMyPatient(deleteId));
    setDeleteLoading(false);
    handleClose();
    dispatch(getMypatient(10, keyword));
    notify(t("patientTable.notifications.deleteSuccess"), "success");
  };

  const onChangeKeyword = (e) => {
    setKeyword(e.target.value);
  };

  const handleToggleArchive = useCallback(
    async (patientId) => {
      try {
        setArchiveLoading((prev) => ({ ...prev, [patientId]: true }));
        await dispatch(toggleArchivePatient(patientId));
        await dispatch(getMypatient(10, keyword));
        notify(t("patientTable.notifications.archiveSuccess"), "success");
      } catch (error) {
        notify(t("patientTable.notifications.archiveError"), "error");
      } finally {
        setArchiveLoading((prev) => ({ ...prev, [patientId]: false }));
      }
    },
    [dispatch, keyword, t],
  );

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
