import { useQuery } from "@tanstack/react-query";
import api from "../axios";

export const useMembers = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["members", params],
    queryFn: async () => {
      const res = await api.get("/api/org/members", { params });
      return res.data;
    },
    keepPreviousData: true,
    ...options,
  });
};
