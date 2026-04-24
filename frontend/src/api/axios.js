import axios from "axios";

let queryClient;
let isRedirecting = false;

export const setQueryClient = (qc) => {
  queryClient = qc;
};

// https://teamflow-backend-larw.onrender.com
const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error?.response?.status;

    if (
      status === 401 &&
      !isRedirecting &&
      !window.location.pathname.includes("/login")
    ) {
      isRedirecting = true;
      if (queryClient) {
        queryClient.clear();
      }
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
