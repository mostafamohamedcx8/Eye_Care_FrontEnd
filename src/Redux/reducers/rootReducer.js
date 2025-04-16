import { combineReducers } from "redux";
import examinationReducer from "./examinationReducer";

export default combineReducers({
  allExamination: examinationReducer,
});
