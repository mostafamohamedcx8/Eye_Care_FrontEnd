import {
  CREATEPATIENT,
  GET_ERROR,
  GETPATIENT,
  GET_MY_PATIENT,
  DELETMYPATIENT,
  SENDPATIENT,
  GETSPECIFICPATIENT,
  ARCHIVEDPATIENT,
  GET_MY_ARCHIVEDPATIENT,
  UPDATE_PATIENT_EMAIL,
} from "../type";

const initialState = {
  // تصحيح الاسم
  patient: [],
  getpatient: [],
  getspecificpatient: [],
  mypatient: [],
  deletpatient: [], // يفضل تسميتها deleteResult
  sendpatient: [],
  archivedpatient: [],
  unarchivedpatient: [],
  updatepatientemail: [],
  loading: true,
  error: null, // إضافة حقل للخطأ
};

const patientReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATEPATIENT:
      return {
        ...state,
        patient: action.payload,
        loading: false,
      };
    case SENDPATIENT:
      return {
        ...state,
        sendpatient: action.payload,
        loading: false,
      };
    case GETPATIENT:
      return {
        ...state, // إضافة الـ spread operator هنا
        getpatient: action.payload,
        loading: false,
      };
    case GET_MY_PATIENT:
      return {
        ...state, // مهم جداً
        mypatient: action.payload,
        loading: false,
      };
    case GET_MY_ARCHIVEDPATIENT:
      return {
        ...state,
        archivedpatient: action.payload,
        loading: false,
      };
    case GETSPECIFICPATIENT:
      return {
        ...state,
        getspecificpatient: action.payload,
        loading: false,
      };
    case ARCHIVEDPATIENT:
      return {
        ...state,
        unarchivedpatient: action.payload,
        loading: false,
      };
    case DELETMYPATIENT:
      return {
        ...state,
        deletpatient: action.payload,
        loading: false, // لا تنسى اللودينج
      };
    case UPDATE_PATIENT_EMAIL:
      return {
        ...state,
        updatepatientemail: action.payload,
        loading: false,
      };
    case GET_ERROR:
      return {
        ...state,
        loading: false, // عند الخطأ اللودينج ينتهي
        error: action.payload, // تخزين الخطأ في مكانه الصحيح
      };

    default:
      return state;
  }
};

export default patientReducer;
