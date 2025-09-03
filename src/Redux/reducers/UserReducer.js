import {
  CREATEUSER,
  LOGINUSER,
  FORGETPASSWORD,
  VERIFYPASSWORD,
  CREATE_NEW_PASSWORD,
  UPDATE_USER_PROFILE,
  UPDATELOGGEDUSERPASSWORD,
  GETMYDATA,
} from "../type";

const initial = {
  User: [],
  userprofile: [],
  loginUser: [],
  forgetPassword: [],
  verfiyPassword: [],
  createNewPassword: [],
  userpassword: [],
  mydata: [],
  error: null, // أضف حقل للخطأ
  loading: true,
};

const userReducer = (state = initial, action) => {
  switch (action.type) {
    case CREATEUSER:
      return {
        ...state,
        User: action.payload,
        loading: false,
      };
    case GETMYDATA:
      return {
        ...state,
        mydata: action.payload,
        loading: false,
      };
    case LOGINUSER:
      return {
        ...state,
        loginUser: action.payload,
        loading: false,
      };
    case FORGETPASSWORD:
      return {
        ...state,
        forgetPassword: action.payload,
        loading: false,
      };
    case VERIFYPASSWORD:
      return {
        ...state,
        verfiyPassword: action.payload,
        loading: false,
      };
    case CREATE_NEW_PASSWORD:
      return {
        ...state,
        createNewPassword: action.payload,
        loading: false,
      };
    case UPDATE_USER_PROFILE:
      return {
        ...state,
        userProfile: action.payload,
      };
    case UPDATELOGGEDUSERPASSWORD:
      return {
        ...state,
        userpassword: action.payload,
      };

    default:
      return state;
  }
};
export default userReducer;
