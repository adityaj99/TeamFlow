import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../axios";

export const useSelectOrg = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orgId) => {
      await api.post("/api/membership/switch-org", { orgId });
    },

    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

export const useUpdateOrg = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await api.patch("/api/org", data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["currentOrg"]);
      queryClient.invalidateQueries(["orgs"]);
    },
  });
};

export const useDeleteOrg = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => api.delete("/api/org"),

    onSuccess: () => {
      queryClient.clear();
    },
  });
};
