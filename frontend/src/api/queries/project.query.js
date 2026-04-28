import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import api from "../axios";

export const useProjects = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["projects", params?.limit],
    queryFn: async () => {
      const res = await api.get("/api/project", { params });
      return res.data.data;
    },
    // keepPreviousData: true,
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useInfiniteProjects = () => {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: ["projects"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get(`/api/project?page=${pageParam}&limit=9`);
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },

    // keepPreviousData: true,
    placeholderData: keepPreviousData,
  });
};

export const useProject = (projectId, options = {}) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const cachedData = queryClient.getQueryData(["projects"]);
      const projects = cachedData?.pages?.flatMap((p) => p.data) || [];

      const cachedProject = projects?.find((p) => p._id === projectId);
      if (cachedProject) {
        return cachedProject;
      }

      const res = await api.get(`/api/project/${projectId}`);
      return res.data.data;
    },
    enabled: !!projectId,
    ...options,
  });
};
