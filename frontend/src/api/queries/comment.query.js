import { useQuery } from "@tanstack/react-query";
import api from "../axios";

export const useComments = (taskId) => {
  return useQuery({
    queryKey: ["comments", taskId],
    queryFn: async () => {
      const res = await api.get(`/api/comment/${taskId}`);
      return res.data.data;
    },
    enabled: !!taskId,
  });
};

export const useReplies = (commentId, enabled) => {
  return useQuery({
    queryKey: ["replies", commentId],
    queryFn: async () => {
      const res = await api.get(`/api/comment/replies/${commentId}`);
      return res.data.data;
    },
    enabled,
  });
};
