import axios from "axios";

// https://teamflow-backend-larw.onrender.com
const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

export default api;
