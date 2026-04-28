import { keepPreviousData, useQuery } from "@tanstack/react-query";
import api from "../axios";

export const useTasks = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: [
      "tasks",
      filters.search,
      filters.status,
      filters.priority,
      filters.page,
      filters.projectId,
    ],
    queryFn: async () => {
      const res = await api.get("/api/task", { params: filters });
      return res.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2,
    ...options,
  });
};
