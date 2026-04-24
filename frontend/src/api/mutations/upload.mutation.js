import { useMutation } from "@tanstack/react-query";
import api from "../axios";

export const useUploadFile = () => {
  return useMutation({
    mutationFn: async (formData) => {
      const res = await api.post("/api/upload", formData);
      return res.data.data;
    },
  });
};
