import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../axios";

export const useMarkNitficationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.patch("/api/notification/read");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
