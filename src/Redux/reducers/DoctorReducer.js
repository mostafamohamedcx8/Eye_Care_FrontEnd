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
        ...state,
        doctor: action.payload,
        loading: false,
      };

    case GETSPECIFICDOCTOR:
      return {
        ...state,
        specificdoctor: action.payload,
        loading: false,
      };

    case GET_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default doctorReducer;
