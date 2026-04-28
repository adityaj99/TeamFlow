import { keepPreviousData, useQuery } from "@tanstack/react-query";
import api from "../axios";

export const fetchMembersFn = async (params) => {
  const res = await api.get("/api/org/members", { params });
  return res.data;
};

export const useMembers = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["members", params],
    queryFn: () => fetchMembersFn(params),
    placeholderData: keepPreviousData,
    ...options,
  });
};
