import { useQuery } from "@tanstack/react-query";
import { AdminWithdrawalsResponse, ReceivablesResponse, TreasuryResponse, StagesFinancialsResponse } from "@/types/treasury";
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
        `/api/finance/get/admin-withdrawals`,
        { params: { page } } // ⚠️ كانت الـ page مش بتتبعت للباك اند خالص، اتصلحت هنا
      );
      return data;
    },
    enabled,
  });
}

export function useReceivables(page: number = 1, enabled: boolean = true) {
  return useQuery({
    queryKey: ["receivables", page],
    queryFn: async () => {
      const { data } = await api.get<ReceivablesResponse>("/api/finance/receivables", {
        params: { page },
      });
      return data;
    },
    enabled,
  });
}

export function useStagesFinancials(page: number = 1, enabled: boolean = true) {
  return useQuery({
    queryKey: ["stages-financials", page],
    queryFn: async () => {
      const { data } = await api.get<StagesFinancialsResponse>("/api/finance/stages-financials", {
        params: { page },
      });
      return data;
    },
    enabled,
  });
}