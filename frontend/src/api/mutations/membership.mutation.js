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

export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      const res = await api.delete(`/api/membership/${userId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
};
