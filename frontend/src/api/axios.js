import axios from "axios";

const api = axios.create({
  baseURL: "https://teamflow-backend-larw.onrender.com",
  withCredentials: true,
});

export default api;
