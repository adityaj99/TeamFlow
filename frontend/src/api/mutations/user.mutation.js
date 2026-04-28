import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../axios";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await api.patch("/api/auth/profile", data);
      return res.data.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["authUser"]);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data) => {
      const res = await api.put("/api/auth/change-password", data);
      return res.data;
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.post("/api/auth/logout");
    },

    onSuccess: () => {
      queryClient.clear();
    },
  });
};
