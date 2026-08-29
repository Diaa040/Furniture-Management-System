import { api } from "@/lib/api";
import { DailyTransactionsResponse, TransactionInput } from "@/types/dashboard";


export async function fetchDailyTransaction(): Promise<DailyTransactionsResponse> {
  const response = await api.get(`/api/daily/transaction`);
  return response.data;
}


export async function addDailyTransaction(data: TransactionInput): Promise<TransactionInput> {
  const response = await api.post(`/api/add/daily/transaction`, data);
  return response.data;
}

export async function startNewDay() {
  const response = await api.get(`/api/start/day`);
  return response.data;
}


