import { toast } from "sonner";
import api from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/api/project", data);
      return res?.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/api/project/${id}`);
      return res.data;
    },

    onSuccess: () => {
      toast.success("Project deleted Permanently");
      queryClient.invalidateQueries(["projects"]);
      queryClient.invalidateQueries(["tasks"]);
    },
  });
};
