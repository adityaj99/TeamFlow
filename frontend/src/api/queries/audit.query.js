import { useInfiniteQuery } from "@tanstack/react-query";
import api from "../axios";

export const useInfiniteAudits = (params) => {
  console.log("Fetching audits with params:", params);

  return useInfiniteQuery({
    queryKey: ["audits", params],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get("/api/audit", {
        params: { ...params, page: pageParam, limit: 10 },
      });
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      if (page < totalPages) {
        return page + 1;
      }
      return undefined;
    },
  });
};
