import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { UsersResponse } from "@/types/users";

export function useUsers(enabled: boolean = true) {
  return useQuery({
    queryKey: ["users-list"],
    queryFn: async () => {
      const { data } = await api.get<UsersResponse>("/api/users");
      return data;
    },
    enabled,
  });
}