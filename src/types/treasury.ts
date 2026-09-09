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

// شكل موحد لأي Laravel paginator بيرجع من الباك اند (نفس الشكل بتاع withdrawals)
export interface PaginatedData<T> {
  current_page: number;
  data: T[];
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

// alias للتوافق مع أي كود قديم بيستخدم الاسم ده
export type AdminWithdrawalPaginatedData = PaginatedData<AdminWithdrawalItem>;

export interface AdminWithdrawalsResponse {
  status: boolean;
  total_amount: string;
  data: PaginatedData<AdminWithdrawalItem>;
}

export interface ReceivableItem {
  id: number;
  customer_name: string;
  remaining_amount: string;
  delivery_date: string | null;
}

// ✅ الشكل الحقيقي المؤكد من الـ response: بيانات الباجينيشن (current_page, last_page, data...)
// كلها في نفس مستوى message و total_remaining، مش متداخلة جوه data
export interface ReceivablesResponse extends PaginatedData<ReceivableItem> {
  message: string;
  total_remaining: number;
}

export interface StageFinancialItem {
  worker_name: string;
  remaining_amount: number;
}

// ⚠️ افتراض إنها بنفس شكل receivables (flat) - تأكد منها لو الجدول فضل فاضي
export interface StagesFinancialsResponse extends PaginatedData<StageFinancialItem> {
  total_remaining: number;
}