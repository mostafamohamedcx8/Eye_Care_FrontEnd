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
} from "../type";

const inital = {
  patient: [],
  getpatient: [],
  getspecificpatient: [],
  mypatient: [],
  deletpatient: [],
  sendpatient: [],
  archivedpatient: [],
  unarchivedpatient: [],
  loading: true,
};
const patientReducer = (state = inital, action) => {
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
        getpatient: action.payload,
        loading: false,
      };
    case GET_MY_PATIENT:
      return {
        mypatient: action.payload,
        loading: false,
      };
    case GET_MY_ARCHIVEDPATIENT:
      return {
        archivedpatient: action.payload,
        loading: false,
      };
    case GETSPECIFICPATIENT:
      return {
        getspecificpatient: action.payload,
        loading: false,
      };
    case ARCHIVEDPATIENT:
      return {
        unarchivedpatient: action.payload,
        loading: false,
      };
    case DELETMYPATIENT:
      return {
        ...state,
        deletpatient: action.payload,
      };
    case GET_ERROR:
      return {
        loading: true,
        patient: action.payload,
      };

    default:
      return state;
  }
};
export default patientReducer;
