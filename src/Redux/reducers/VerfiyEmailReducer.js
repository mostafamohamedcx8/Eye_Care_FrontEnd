import { VERIFY_EMAIL_REQUEST } from "../type";

const initialState = {
  message: "",
  loading: true,
};

const VerifyEmailReducer = (state = initialState, action) => {
  switch (action.type) {
    case VERIFY_EMAIL_REQUEST:
      return {
        ...state,
        message: action.payload,
        loading: false,
      };

    default:
      return state;
  }
};

export default VerifyEmailReducer;
