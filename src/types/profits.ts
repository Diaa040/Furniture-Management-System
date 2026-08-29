export type ProfitReportType = "sales" | "manufacturing" | "fixed_expenses";

export interface ProfitTransaction {
  id: number;
  day_id: number;
  name: string;
  amount: string;
  type: string;
  reference_id: number | null;
  reference_type: string;
  order_id: number | null;
}

export interface MonthlyReportResponse {
  status: boolean;
  filters_applied: {
    month: number;
    year: number;
    type?: string;
  };
  totals: {
    total_sales: number;
    manufacturing_cost: number;
    fixed_expenses: number;
    net_profit: number;
  };
  selected_type: string;
  count: number;
  data: ProfitTransaction[];
}