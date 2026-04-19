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
