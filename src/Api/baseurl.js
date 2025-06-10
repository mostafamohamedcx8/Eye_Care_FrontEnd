// src/Api/baseurl.js
import axios from "axios";

const baseUrl = axios.create({
  baseURL: "http://75.119.150.159:8000", // ✅ الصحيح
});

export default baseUrl;
