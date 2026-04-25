import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../axios";

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/api/comment", data);
      return res.data.data;
    },
    onMutate: async (newComment) => {
      await queryClient.cancelQueries(["comments", newComment.task]);
      const prev = queryClient.getQueryData(["comments", newComment.task]);

      const optimisticComment = {
        _id: Date.now().toString(),
        content: newComment.content,
        user: { name: "You" },
        createdAt: new Date().toISOString(),
        parentComment: newComment.parentComment || null,
      };

      queryClient.setQueryData(["comments", newComment.task], (old = []) => {
        if (newComment.parentComment) {
          return old;
        }
        return [optimisticComment, ...old];
      });

      return { prev };
    },

    onError: (_err, newComment, context) => {
      queryClient.setQueryData(["comments", newComment.task], context.prev);
    },

    onSuccess: (_data, newComment) => {
      queryClient.invalidateQueries(["comments", newComment.task]);

      if (newComment.parentComment) {
        queryClient.invalidateQueries(["replies", newComment.parentComment]);
      }
    },
  });
};
