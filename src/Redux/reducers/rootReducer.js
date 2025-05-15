import { combineReducers } from "redux";
import doctorReducer from "./DoctorReducer";
import patientReducer from "./PatientReducer";
import reportReducer from "./ReportReducer";
import userReducer from "./UserReducer";
import VerifyEmailReducer from "./VerfiyEmailReducer";
export default combineReducers({
  alldoctor: doctorReducer,
  allpatient: patientReducer,
  allreport: reportReducer,
  alluser: userReducer,
  VerifyEmailReducer: VerifyEmailReducer,
});
