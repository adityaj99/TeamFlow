import { useQuery } from "@tanstack/react-query";
import api from "../axios";

export const useOrgs = () => {
  return useQuery({
    queryKey: ["orgs"],
    queryFn: async () => {
      const res = await api.get("/api/membership/my-org");
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
