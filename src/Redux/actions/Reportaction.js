import {
  CREATEREPORT,
  GET_ERROR,
  GET_SPECIFIC_REPORT,
  GETPPATIENTWITHREPORT,
  DELETEMYREPORT,
  MARKDOCTORFEEDBACKASREAD,
  GETMYNOTIFCATION,
  MARKNOTIFYASREAD,
} from "../type";
import { InsertDataWithImage } from "../../Hooks/useInsertData";
import { useGetDataToken } from "../../Hooks/useGetData";
import DeleteData from "../../Hooks/useDeleteData";
import { updateDataWithToken } from "../../Hooks/useUpdateData";
export const CreateReport = (FormatData, id) => async (dispatch) => {
  try {
    const response = await InsertDataWithImage(
      `/api/v1/reports/${id}`,
      FormatData,
    );
    dispatch({
      type: CREATEREPORT,
      payload: response,
    });
    return response;
  } catch (e) {
    dispatch({
      type: CREATEREPORT,
      payload: e.response,
    });
    return e.response;
  }
};

export const getSpecificReport = (patientId, reportId) => async (dispatch) => {
  try {
    const response = await useGetDataToken(
      `/api/v1/reports/${patientId}/${reportId}`,
    );

    dispatch({
      type: GET_SPECIFIC_REPORT,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: GET_SPECIFIC_REPORT,
      payload: e.response,
    });
  }
};
export const getmynotification = (id) => async (dispatch) => {
  try {
    const response = await useGetDataToken(`/api/v1/reports/notifications`);

    dispatch({
      type: GETMYNOTIFCATION,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: GETMYNOTIFCATION,
      payload: e.response,
    });
  }
};
export const getPatientWithReport = (id) => async (dispatch) => {
  try {
    // امسح الداتا القديمة وفعل حالة التحميل
    dispatch({ type: "CLEAR_PATIENT_REPORT" });

    const response = await useGetDataToken(`/api/v1/reports/${id}`);

    dispatch({
      type: GETPPATIENTWITHREPORT,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: GETPPATIENTWITHREPORT,
      payload: e.response,
    });
  }
};

export const deleteMyReport = (patientId, reportId) => async (dispatch) => {
  try {
    const response = await DeleteData(
      `/api/v1/reports/${patientId}/${reportId}`,
    );

    dispatch({
      type: DELETEMYREPORT,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: DELETEMYREPORT,
      payload: e.response,
    });
  }
};

export const MarkDocotrFeedback = (id, body) => async (dispatch) => {
  try {
    const response = await updateDataWithToken(
      `/api/v1/reports/feedback/${id}`,
      body,
    );
    dispatch({
      type: MARKDOCTORFEEDBACKASREAD,
      payload: response,
      loading: true,
    });
  } catch (e) {
    dispatch({
      type: MARKDOCTORFEEDBACKASREAD,
      payload: e.response,
    });
  }
};

export const MarkNotifyRead = (id) => async (dispatch) => {
  try {
    const response = await updateDataWithToken(`/api/v1/reports/${id}/read`);
    dispatch({
      type: MARKNOTIFYASREAD,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: MARKNOTIFYASREAD,
      payload: e.response,
    });
  }
};
