import { useQuery } from "@tanstack/react-query";
import api from "../axios";

export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get("/api/notification");
      return res.data.data;
    },
  });
};
