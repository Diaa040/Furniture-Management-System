import { useQuery } from "@tanstack/react-query";
import { AdminWithdrawalsResponse, ReceivablesResponse, TreasuryResponse , StagesFinancialsResponse } from "@/types/treasury";
import { api } from "@/lib/api";

export function useTreasury() {
  return useQuery({
    queryKey: ["treasury"],
    queryFn: async () => {
      const { data } = await api.get<TreasuryResponse>("/api/finance/treasury/");
      return data;
    },
  });
}

export function useAdminWithdrawals(page: number = 1, enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin-withdrawals", page],
    queryFn: async () => {
      const { data } = await api.get<AdminWithdrawalsResponse>(
        `/api/finance/get/admin-withdrawals`
      );
      return data;
    },
    enabled,
  });
}

export function useReceivables(enabled: boolean = true) {
  return useQuery({
    queryKey: ["receivables"],
    queryFn: async () => {
      const { data } = await api.get<ReceivablesResponse>("/api/finance/receivables");
      return data;
    },
    enabled,
  });
}

export function useStagesFinancials(enabled: boolean = true) {
  return useQuery({
    queryKey: ["stages-financials"],
    queryFn: async () => {
      const { data } = await api.get<StagesFinancialsResponse>("/api/finance/stages-financials");
      return data;
    },
    enabled,
  });
}