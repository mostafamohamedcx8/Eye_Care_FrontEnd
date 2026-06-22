import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getMypatient,
  getAllMyPatientPage,
  deleteMyPatient,
  toggleArchivePatient,
  updatePatientEmail,
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
  const [showEdit, setShowEdit] = useState(false);
  const [editPatient, setEditPatient] = useState(null);
  const [editEmail, setEditEmail] = useState("");
  const [editConsent, setEditConsent] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const userFromStorage = JSON.parse(localStorage.getItem("user"));
  const opticianId = userFromStorage?._id;

  const handleClose = () => {
    setShow(false);
    setDeleteId(null);
  };

  const handleShow = (id) => {
    setDeleteId(id);
    setShow(true);
  };

  const handleShowEdit = (patient) => {
    setEditPatient(patient);
    setEditEmail(patient.email || "");
    setEditConsent(
      patient.opticians?.some((o) => o.opticianConsent?.consentToReports) ||
        false,
    );
    setShowEdit(true);
  };

  const handleCloseEdit = () => {
    setShowEdit(false);
    setEditPatient(null);
  };

  const handleEditConfirmed = async () => {
    const data = {};
    if (editEmail && editEmail !== editPatient?.email) data.email = editEmail;
    data.consentFlag = editConsent;

    if (!Object.keys(data).length) return handleCloseEdit();

    setEditLoading(true);
    await dispatch(updatePatientEmail(editPatient._id, data));

    setEditLoading(false);
    handleCloseEdit();
    dispatch(getMypatient(10, keyword));
    notify(t("patientTable.notifications.updateSuccess"), "success");
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
  console.log("AllPatient", AllPatient);

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
    showEdit,
    handleShowEdit,
    handleCloseEdit,
    editEmail,
    setEditEmail,
    editConsent,
    setEditConsent,
    editLoading,
    handleEditConfirmed,
    opticianId,
  ];
};
