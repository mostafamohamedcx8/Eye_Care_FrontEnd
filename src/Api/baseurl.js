// src/Api/baseurl.js
import axios from "axios";

const baseUrl = axios.create({
  baseURL: "http://localhost:8000", // ✅ الصحيح
});

export default baseUrl;
