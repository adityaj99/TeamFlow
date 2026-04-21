import { useQuery } from "@tanstack/react-query";
import api from "../axios";

export const useAuth = () => {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await api.get("/api/auth/profile");
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};
