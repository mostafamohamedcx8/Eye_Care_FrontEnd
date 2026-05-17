import baseUrl from "../Api/baseurl";

const DeleteData = async (url, params) => {
  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  const res = await baseUrl.delete(url, config);
  return res.data;
};
export default DeleteData;
