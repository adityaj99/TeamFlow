import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../axios";

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }) =>
      api.patch("/api/membership/role", { userId, role }),

    onSuccess: () => {
      queryClient.invalidateQueries(["members"]);
    },
  });
};
