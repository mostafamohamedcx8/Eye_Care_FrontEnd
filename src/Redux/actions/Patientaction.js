import {
  CREATEPATIENT,
  GET_ERROR,
  GETPATIENT,
  GET_MY_PATIENT,
  DELETMYPATIENT,
  SENDPATIENT,
  GETSPECIFICPATIENT,
  ARCHIVEDPATIENT,
  GET_MY_ARCHIVEDPATIENT,
  UPDATE_PATIENT_EMAIL,
} from "../type";
import { InsertData } from "../../Hooks/useInsertData";
import { useGetDataToken } from "../../Hooks/useGetData";
import DeleteData from "../../Hooks/useDeleteData";
import { updateDataWithToken } from "../../Hooks/useUpdateData";

const buildFilterParams = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.filterType) params.append("filterType", filters.filterType);
  if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.append("dateTo", filters.dateTo);
  return params;
};

export const CreatePatient = (MYdata) => async (dispatch) => {
  try {
    const response = await InsertData(`/api/v1/patients`, MYdata);

    dispatch({
      type: CREATEPATIENT,
      payload: response,
    });

    return response; // ✅ دي اللي كانت ناقصة
  } catch (e) {
    dispatch({
      type: GET_ERROR,
      payload: e.response,
    });

    return e.response; // ✅ وكمان ارجع الـ error عشان تشوفه في الكمبوننت
  }
};

export const SendPatient = (patientId, MYdata) => async (dispatch) => {
  try {
    const response = await updateDataWithToken(
      `/api/v1/patients/${patientId}/assign-doctor`,
      MYdata,
    );

    dispatch({
      type: SENDPATIENT,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: SENDPATIENT,
      payload: e.response,
    });
  }
};

export const getAllpatient = (limit) => async (dispatch) => {
  try {
    const response = await useGetDataToken(
      `/api/v1/patients/mypatients?limit=${limit}`,
    );

    dispatch({
      type: GETPATIENT,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: GET_ERROR,
      payload: "Error " + e,
    });
  }
};

export const getMypatient =
  (limit = 10, keyword = "", filters = {}) =>
  async (dispatch) => {
    try {
      const params = buildFilterParams(filters);
      params.append("archived", "false");
      params.append("limit", limit);
      if (keyword) params.append("keyword", keyword);

      const response = await useGetDataToken(
        `/api/v1/patients/my-patients?${params.toString()}`,
      );

      dispatch({
        type: GET_MY_PATIENT,
        payload: response,
      });
    } catch (e) {
      dispatch({
        type: GET_MY_PATIENT,
        payload: e.response,
      });
    }
  };

export const getMyArchivedpatient =
  (limit = 10, keyword = "", filters = {}) =>
  async (dispatch) => {
    try {
      const params = buildFilterParams(filters);
      params.append("archived", "true");
      params.append("limit", limit);
      if (keyword) params.append("keyword", keyword);

      const response = await useGetDataToken(
        `/api/v1/patients/my-patients?${params.toString()}`,
      );
      dispatch({
        type: GET_MY_ARCHIVEDPATIENT,
        payload: response,
      });
    } catch (e) {
      dispatch({
        type: GET_ERROR,
        payload: e.response,
      });
    }
  };

export const getSpecificpatient = (id) => async (dispatch) => {
  try {
    const response = await useGetDataToken(`/api/v1/patients/${id}`);

    dispatch({
      type: GETSPECIFICPATIENT,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: GETSPECIFICPATIENT,
      payload: e.response,
    });
  }
};

export const updatePatientEmail = (patientId, data) => async (dispatch) => {
  try {
    const response = await updateDataWithToken(
      `/api/v1/patients/${patientId}/update-email`,
      data,
    );
    dispatch({
      type: UPDATE_PATIENT_EMAIL,
      payload: response,
    });
    return response;
  } catch (e) {
    dispatch({
      type: GET_ERROR,
      payload: e.response,
    });
    return e.response;
  }
};

export const deleteMyPatient = (id) => async (dispatch) => {
  try {
    const response = await DeleteData(`/api/v1/patients/${id}`);

    dispatch({
      type: DELETMYPATIENT,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: DELETMYPATIENT,
      payload: e.response,
    });
  }
};

export const getAllMyPatientPage =
  (page, limit = 10, keyword = "", filters = {}) =>
  async (dispatch) => {
    try {
      const params = buildFilterParams(filters);
      params.append("archived", "false");
      params.append("limit", limit);
      params.append("page", page);
      if (keyword) params.append("keyword", keyword);

      // ✅ تصحيح: كان فيه typo في المسار (مفيهوش "-" ومفيهوش archived=false)
      const response = await useGetDataToken(
        `/api/v1/patients/my-patients?${params.toString()}`,
      );

      dispatch({
        type: GET_MY_PATIENT,
        payload: response,
      });
    } catch (e) {
      dispatch({
        type: GET_ERROR,
        payload: e.response,
      });
    }
  };

export const getAllMyArchivedPatientPage =
  (page, limit = 10, keyword = "", filters = {}) =>
  async (dispatch) => {
    try {
      const params = buildFilterParams(filters);
      params.append("archived", "true");
      params.append("limit", limit);
      params.append("page", page);
      if (keyword) params.append("keyword", keyword);

      const response = await useGetDataToken(
        `/api/v1/patients/my-patients?${params.toString()}`,
      );
      dispatch({
        type: GET_MY_ARCHIVEDPATIENT,
        payload: response,
      });
    } catch (e) {
      dispatch({
        type: GET_ERROR,
        payload: e.response,
      });
    }
  };

export const toggleArchivePatient = (id) => async (dispatch) => {
  try {
    const response = await updateDataWithToken(
      `/api/v1/patients/${id}/optician-archive`,
    );
    dispatch({
      type: ARCHIVEDPATIENT,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: ARCHIVEDPATIENT,
      payload: e.response,
    });
  }
};
