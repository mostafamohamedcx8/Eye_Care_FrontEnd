import { GET_ALL_EXAMINATION, GET_ERROR, CREATE_EXAMINATION } from "../type";
import useGetData from "../../Hooks/useGetData";

export const getAllEXAMINATION = (limit) => async (dispatch) => {
  try {
    const response = await useGetData(`/api/v1/examination`);

    dispatch({
      type: GET_ALL_EXAMINATION,
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
export const getAllEXAMINATIONPage = (page) => async (dispatch) => {
  try {
    const response = await useGetData(
      `/api/v1/examination?limit=6&page=${page}`
    );
    dispatch({
      type: GET_ALL_EXAMINATION,
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
// export const createEXAMINATION = (formData) => async (dispatch) => {
//     try {
//         const response = await useInsertDataWithImage(`/api/v1/categories`, formData);
//         dispatch({
//             type: CREATE_EXAMINATION,
//             payload: response,
//             loading: true
//         })

//     } catch (e) {
//         dispatch({
//             type: GET_ERROR,
//             payload: "Error " + e,
//         })
//     }
// }
