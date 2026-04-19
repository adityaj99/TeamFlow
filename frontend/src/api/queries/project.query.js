import { useQuery } from "@tanstack/react-query";
import api from "../axios";

export const useProjects = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["projects", params],
    queryFn: async () => {
      const res = await api.get("/api/project", { params });
      return res.data.data;
    },
    keepPreviousData: true,
    ...options,
  });
};
