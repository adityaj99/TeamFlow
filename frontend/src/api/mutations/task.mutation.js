import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../axios";

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/api/task", data);
      return res?.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });
};

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.patch(`/api/task/${id}/status`, data);
      return res?.data.data;
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries(["tasks"]);
      const prevTasks = queryClient.getQueryData(["tasks"]);

      queryClient.setQueryData(["tasks"], (old) =>
        old?.map((task) => (task._id === id ? { ...task, ...data } : task)),
      );

      return { prevTasks };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["tasks"], context.prevTasks);
    },

    onSettled: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.patch(`/api/task/${id}`, data);
      return res?.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/api/task/${id}`);
      return res.data;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries(["tasks"]);

      const prev = queryClient.getQueryData(["tasks"]);

      queryClient.setQueryData(["tasks"], (old) => {
        if (!old) return old;

        return {
          ...old,
          data: old.data.filter((t) => t._id !== id),
        };
      });
      return { prev };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(["tasks"], context.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });
};
