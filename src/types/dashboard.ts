export interface DailyTransactionItem {
  id: number;
  day_id: number;
  name: string;
  amount: string;
  type: "out" | "get" | string;
  reference_id: number | null;
  reference_type: string;
  order_id: number | null;
}

export interface DailyTransactionsResponse {
  status: boolean;
  message: string;
  total_in: number;
  total_out: number;
  net_balance: number;
  data: DailyTransactionItem[];
}

export interface TransactionInput {
  name: string;
  amount: number;
  type: "get" | "out";
}