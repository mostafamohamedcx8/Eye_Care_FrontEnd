import { GET_ALL_DOCTOR, GET_ERROR, GETSPECIFICDOCTOR } from "../type";
import { useGetDataToken } from "../../Hooks/useGetData";

export const getAllDoctor = (limit) => async (dispatch) => {
  try {
    const response = await useGetDataToken(
      `/api/v1/user/doctor?limit=${limit}`
    );

    dispatch({
      type: GET_ALL_DOCTOR,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: GET_ERROR,
      payload: "Error " + e,
    });
  }
};

//get all category with pagination
export const getAllDOCTORPage = (page) => async (dispatch) => {
  try {
    const response = await useGetDataToken(
      `/api/v1/user/doctor?limit=3&page=${page}`
    );
    dispatch({
      type: GET_ALL_DOCTOR,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: GET_ERROR,
      payload: "Error " + e,
    });
  }
};

export const getSpecificDoctor = (id) => async (dispatch) => {
  try {
    const response = await useGetDataToken(`/api/v1/user/doctor/${id}`);

    dispatch({
      type: GETSPECIFICDOCTOR,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: GETSPECIFICDOCTOR,
      payload: e.response,
    });
  }
};
