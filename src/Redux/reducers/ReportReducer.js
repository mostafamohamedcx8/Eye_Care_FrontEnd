import {
  CREATEREPORT,
  GET_ERROR,
  GET_SPECIFIC_REPORT,
  GETPPATIENTWITHREPORT,
  DELETEMYREPORT,
  MARKDOCTORFEEDBACKASREAD,
  GETMYNOTIFCATION,
  MARKNOTIFYASREAD,
  CLEAR_PATIENT_REPORT, // ✅ استورد الـ constant بدل string literal
} from "../type";

const initial = {
  Report: [],
  specificreport: [],
  getpatientwithreport: [],
  deletemyreport: null, // ✅ null بدل [] لأنه مش list
  feedback: [],
  notifyread: [],
  notify: [],
  error: null,
  loading: true,
};

const reportReducer = (state = initial, action) => {
  switch (action.type) {
    case CREATEREPORT:
      return {
        ...state,
        Report: action.payload,
        error: null, // ✅ امسح الـ error عند النجاح
        loading: false,
      };

    case GET_SPECIFIC_REPORT:
      return {
        ...state,
        specificreport: action.payload,
        error: null,
        loading: false,
      };

    case MARKDOCTORFEEDBACKASREAD:
      return {
        ...state,
        feedback: action.payload,
        loading: false,
      };

    case MARKNOTIFYASREAD:
      return {
        ...state,
        notifyread: action.payload,
        loading: false,
      };

    case CLEAR_PATIENT_REPORT: // ✅ constant بدل string
      return {
        ...state,
        getpatientwithreport: [],
        loading: false, // ✅ false مش true لأن العملية خلصت
      };

    case GETPPATIENTWITHREPORT:
      return {
        ...state,
        getpatientwithreport: action.payload,
        error: null,
        loading: false,
      };

    case GETMYNOTIFCATION:
      return {
        ...state,
        notify: action.payload,
        loading: false,
      };

    case DELETEMYREPORT:
      return {
        ...state,
        // ✅ احذف الـ report من الـ list بدل ما تستبدل الـ state كلها
        Report: state.Report.filter((report) => report._id !== action.payload),
        deletemyreport: action.payload,
        loading: false,
      };

    case GET_ERROR:
      return {
        ...state,
        // ✅ متحطش الـ error في Report، Report يفضل زي ما هو
        error: action.payload?.message || "حصل خطأ غير متوقع",
        loading: false,
      };

    default:
      return state;
  }
};

export default reportReducer;
