import {
  GET_ALL_DOCTOR,
  CREATE_DOCTOR,
  GET_ERROR,
  GETSPECIFICDOCTOR,
} from "../type";

const inital = {
  doctor: [],
  specificdoctor: [],
  loading: true,
};
const doctorReducer = (state = inital, action) => {
  switch (action.type) {
    case GET_ALL_DOCTOR:
      return {
        ...state,
        doctor: action.payload,
        loading: false,
      };
    case CREATE_DOCTOR:
      return {
        doctor: action.payload,
        loading: false,
      };
    case GETSPECIFICDOCTOR:
      return {
        specificdoctor: action.payload,
        loading: false,
      };
    case GET_ERROR:
      return {
        loading: true,
        doctor: action.payload,
      };
    default:
      return state;
  }
};
export default doctorReducer;
