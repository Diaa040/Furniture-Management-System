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

// ✅ أضيفت - كانت مستخدمة في ProductDetailsDialog لكن مش معرّفة، وده كان بيسبب type error
// الحقول اتحددت بناءً على الاستخدام الفعلي في الكومبوننت وملف بيانات المنتجات (mock data)
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "available" | "low" | "out";
  description?: string;
  image?: string; // اختياري - الفورم الحالي مش بيجمعه من المستخدم
  createdAt: string;
  updatedAt: string;
}