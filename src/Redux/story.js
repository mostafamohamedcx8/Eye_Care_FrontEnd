import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers/rootReducer"; // تأكد أن هذا rootReducer هو combineReducers

const store = configureStore({
  reducer: rootReducer,
  devTools: true, // مفعّل تلقائياً في بيئة التطوير
});

export default store;
