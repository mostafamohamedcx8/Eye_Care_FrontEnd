import baseUrl from "../Api/baseurl";

const UpdateDataWithImage = async (url, parmas) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  const res = await baseUrl.put(url, parmas, config);
  return res;
};

const updateData = async (url, params) => {
  const res = await baseUrl.put(url, params);
  return res;
};

const updateDataWithToken = async (url, parmas) => {
  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };
  const res = await baseUrl.put(url, parmas, config);
  return res;
};
export { UpdateDataWithImage, updateData, updateDataWithToken };
