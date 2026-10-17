import { api } from "@/lib/api";
import type { DayDetailsResponse } from "@/types/transactions";

export interface FetchDayTransactionsParams {
  day: number;
  month: number;
  year: number;
}

export async function fetchDayDetails(): Promise<DayDetailsResponse> {
  const { data } = await api.get<DayDetailsResponse>("/api/day-details");
  return data;
}


export async function fetchDayTransactionsDetails(
  params: FetchDayTransactionsParams,
): Promise<DayTransactionsDetailsResponse> {
  const { data } = await api.get<DayTransactionsDetailsResponse>("/api/day-details", {
    params,
  });
  return data;
}

export interface UpdateTransactionPayload {
  name: string;
  amount: number;
  type: "in" | "out";
}

// دالة تعديل المعاملة
export async function updateTransaction(id: number, payload: UpdateTransactionPayload) {
  const { data } = await api.put(`/api/transactions/${id}`, payload);
  // أو لو الباك إند يستخدم patch استبدل put بـ patch
  return data;
}

export interface DayTransactionItem {
  id: number;
  day_id: number;
  name: string;
  amount: string;
  type: "in" | "out";
  reference_id: number;
  reference_type: string;
  order_id: number | null;
}

export interface DayTransactionsTotals {
  total_in: number;
  total_out: number;
  net_day: number;
}

export interface DayTransactionsDetailsResponse {
  status: boolean;
  filters_applied: {
    day: number;
    month: number;
    year: number;
  };
  totals: DayTransactionsTotals;
  count: number;
  data: DayTransactionItem[];
}