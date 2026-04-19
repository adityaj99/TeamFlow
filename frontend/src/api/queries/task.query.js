import { useQuery } from "@tanstack/react-query";
import api from "../axios";

export const useTasks = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["tasks", params],
    queryFn: async () => {
      const res = await api.get("/api/task", { params });
      return res.data.data;
    },
    keepPreviousData: true,
    ...options,
  });
};
