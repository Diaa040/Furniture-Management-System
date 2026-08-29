export interface TreasuryData {
  total_sales: string;
  total_expenses: string;
  admin_withdrawals: string;
  current_balance: string;
  // أضف أي حقول إضافية تأتي في المستقبل للجدول هنا
}

export interface TreasuryResponse {
  status: boolean;
  data: TreasuryData;
}

export interface AdminWithdrawalItem {
  id: number;
  amount: string;
  withdrawal_date: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface AdminWithdrawalPaginatedData {
  current_page: number;
  data: AdminWithdrawalItem[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface AdminWithdrawalsResponse {
  status: boolean;
  total_amount: string;
  data: AdminWithdrawalPaginatedData;
}

export interface ReceivableItem {
  id: number;
  customer_name: string;
  remaining_amount: string;
  delivery_date: string;
}

export interface ReceivablesResponse {
  message: string;
  total_remaining: number;
  data: ReceivableItem[];
}

export interface StageFinancialItem {
  worker_name: string;
  remaining_amount: number;
}

export interface StagesFinancialsResponse {
  total_remaining: number;
  data: StageFinancialItem[];
}