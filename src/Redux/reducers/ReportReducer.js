import {
  CREATEREPORT,
  GET_ERROR,
  GET_SPECIFIC_REPORT,
  GETPPATIENTWITHREPORT,
  DELETEMYREPORT,
} from "../type";

const initial = {
  Report: [],
  specificreport: [],
  getpatientwithreport: [],
  deletemyreport: [],
  error: null, // أضف حقل للخطأ
  loading: true,
};

const reportReducer = (state = initial, action) => {
  switch (action.type) {
    case CREATEREPORT:
      return {
        ...state,
        Report: action.payload,
        loading: false,
      };
    case GET_SPECIFIC_REPORT:
      return {
        ...state,
        specificreport: action.payload,
        loading: false,
      };
    case "CLEAR_PATIENT_REPORT":
      return {
        ...state,
        getpatientwithreport: null,
        loading: true,
      };

    case GETPPATIENTWITHREPORT:
      return {
        ...state,
        getpatientwithreport: action.payload,
        loading: false,
      };
    case DELETEMYREPORT:
      return {
        ...state,
        deletemyreport: action.payload,
      };
    case GET_ERROR:
      return {
        ...state,
        Report: action.payload, // خزن الـ error response كامل
        error: action.payload.message || "Error creating report",
        loading: false,
      };
    default:
      return state;
  }
};
export default reportReducer;
