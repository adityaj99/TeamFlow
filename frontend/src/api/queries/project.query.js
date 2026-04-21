import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import api from "../axios";

export const useProjects = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["projects", params],
    queryFn: async () => {
      const res = await api.get("/api/project", { params });
      return res.data.data;
    },
    keepPreviousData: true,
    ...options,
  });
};

export const useInfiniteProjects = () => {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: ["projects"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get(`/api/project?page=${pageParam}&limit=5`);
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },

    // 🔥 keeps UI stable while fetching next pages
    keepPreviousData: true,

    // 🔥 small prefetch (optional but nice)
    onSuccess: (data) => {
      const last = data.pages[data.pages.length - 1];
      const next = last?.pagination?.page + 1;
      const total = last?.pagination?.totalPages;

      if (next && next <= total) {
        queryClient.prefetchQuery({
          queryKey: ["projects", next],
          queryFn: () =>
            api.get(`/api/project?page=${next}&limit=5`).then((r) => r.data),
        });
      }
    },
  });
};
