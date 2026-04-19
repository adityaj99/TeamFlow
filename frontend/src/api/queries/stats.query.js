import { useQuery } from "@tanstack/react-query";
import api from "../axios";

export const useStats = (params = {}) => {
  return useQuery({
    queryKey: ["stats", params],
    queryFn: async () => {
      const res = await api.get("/api/stats", { params });
      return res.data.data;
    },
  });
};
