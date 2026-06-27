import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getMyArchivedpatient,
  getAllMyArchivedPatientPage,
  deleteMyPatient,
  toggleArchivePatient,
  updatePatientEmail,
} from "../Redux/actions/Patientaction";
import notify from "../Hook/useNotification";

const FILTERS_WITH_DATE_RANGE = ["newPatients", "reportCustomRange"];

export const Arcivedpatient_Hook = (t) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [archiveLoading, setArchiveLoading] = useState({});
  const [keyword, setKeyword] = useState("");
  const [show, setShow] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editPatient, setEditPatient] = useState(null);
  const [editEmail, setEditEmail] = useState("");
  const [editConsent, setEditConsent] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  // ── حالة الفلاتر الجديدة ──
  const [filterType, setFilterType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const userFromStorage = JSON.parse(localStorage.getItem("user"));

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
    dispatch(
      getMyArchivedpatient(10, keyword, { filterType, dateFrom, dateTo }),
    );
    notify(t("patientTable.notifications.updateSuccess"), "success");
  };

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
    if (filterType === "reportCustomRange") return;
    dispatch(
      getMyArchivedpatient(10, keyword, { filterType, dateFrom, dateTo }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, filterType, dispatch]);

  const getpage = (page) => {
    dispatch(
      getAllMyArchivedPatientPage(page, 10, keyword, {
        filterType,
        dateFrom,
        dateTo,
      }),
    );
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
    navigate(`/ReportsList/${id}`);
  };

  const handleDeleteConfirmed = async () => {
    await dispatch(deleteMyPatient(deleteId));
    handleClose();
    dispatch(
      getMyArchivedpatient(10, keyword, { filterType, dateFrom, dateTo }),
    );
    notify(t("patientTable.notifications.deleteSuccess"), "success");
  };

  const onChangeKeyword = (e) => {
    setKeyword(e.target.value);
  };

  const handleToggleArchive = async (patientId) => {
    try {
      setArchiveLoading((prev) => ({ ...prev, [patientId]: true }));
      await dispatch(toggleArchivePatient(patientId));
      dispatch(
        getMyArchivedpatient(10, keyword, { filterType, dateFrom, dateTo }),
      );
      notify(t("patientTable.notifications.archiveSuccess"), "success");
    } catch (error) {
      notify(t("patientTable.notifications.archiveError"), "error");
    } finally {
      setArchiveLoading((prev) => ({ ...prev, [patientId]: false }));
    }
  };

  const handleFilterTypeChange = (e) => {
    const value = e.target.value;
    setFilterType(value);
    if (!FILTERS_WITH_DATE_RANGE.includes(value)) {
      setDateFrom("");
      setDateTo("");
    }
  };

  const handleApplyCustomRange = () => {
    if (filterType === "reportCustomRange" && (!dateFrom || !dateTo)) {
      notify(t("patientTable.notifications.dateRangeRequired"), "error");
      return;
    }
    dispatch(
      getMyArchivedpatient(10, keyword, { filterType, dateFrom, dateTo }),
    );
  };

  const handleClearFilter = () => {
    setFilterType("");
    setDateFrom("");
    setDateTo("");
    dispatch(getMyArchivedpatient(10, keyword, {}));
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
    showEdit,
    handleShowEdit,
    handleCloseEdit,
    editEmail,
    setEditEmail,
    editConsent,
    setEditConsent,
    editLoading,
    handleEditConfirmed,
    filterType,
    handleFilterTypeChange,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    handleApplyCustomRange,
    handleClearFilter,
  ];
};
