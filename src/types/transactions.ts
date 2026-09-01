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

export interface DayDetailsTotals {
  total_in: number;
  total_out: number;
  net_day: number;
}

export interface DayDetailsResponse {
  status: boolean;
  filters_applied: {
    day: number;
    month: number;
    year: number;
  };
  totals: DayDetailsTotals;
  count: number;
  data: DayTransactionItem[];
}