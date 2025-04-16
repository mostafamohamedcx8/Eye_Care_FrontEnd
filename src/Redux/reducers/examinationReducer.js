import { GET_ALL_EXAMINATION, CREATE_EXAMINATION, GET_ERROR } from "../type";

const inital = {
  examination: [],
  loading: true,
};
const examinationReducer = (state = inital, action) => {
  switch (action.type) {
    case GET_ALL_EXAMINATION:
      return {
        ...state,
        examination: action.payload,
        loading: false,
      };
    case CREATE_EXAMINATION:
      return {
        examination: action.payload,
        loading: false,
      };
    case GET_ERROR:
      return {
        loading: true,
        examination: action.payload,
      };
    default:
      return state;
  }
};
export default examinationReducer;
