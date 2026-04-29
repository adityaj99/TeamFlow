import axios from "axios";

let queryClient;
let isRedirecting = false;

export const setQueryClient = (qc) => {
  queryClient = qc;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error?.response?.status;

    if (
      status === 401 &&
      !isRedirecting &&
      !window.location.pathname.includes("/login") &&
      !window.location.pathname.includes("/register")
    ) {
      isRedirecting = true;
      if (queryClient) {
        queryClient.clear();
      }

      const currentPath = window.location.pathname + window.location.search;
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
    }
    return Promise.reject(error);
  },
);

export default api;
