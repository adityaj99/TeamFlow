import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../axios";

export const useSendInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      await api.post("/api/invite", data);
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["members"]);
    },
  });
};
