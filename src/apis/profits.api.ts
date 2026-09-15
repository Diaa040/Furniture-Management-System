import { api } from "@/lib/api";
import { MonthlyReportResponse, ProfitReportType, Product } from "@/types/profits";

// الدالة الافتراضية (عند الدخول للصفحة أول مرة)
export async function fetchMonthlyReport(): Promise<MonthlyReportResponse> {
  const response = await api.get<MonthlyReportResponse>("/api/finance/monthly-report");
  return response.data;
}

// الدالة المخصصة (عند اختيار التاريخ أو الضغط على أحد المربعات)
export async function fetchSpecificMonthlyReport(
  month?: number,
  year?: number,
  type?: ProfitReportType
): Promise<MonthlyReportResponse> {
  const params: Record<string, string | number> = {};
  if (month !== undefined) params.month = month;
  if (year !== undefined) params.year = year;
  if (type !== undefined) params.type = type;

  const response = await api.get<MonthlyReportResponse>("/api/finance/monthly-report", {
    params,
  });
  console.log(`Report Data for Type [${type || 'default'}], Month [${month}], Year [${year}]:`, response.data);
  return response.data;
}

// ⚠️ المسار وشكل الـ response هنا مبني على تخمين (نفس باترن باقي الـ API عندك: REST قياسي + {status, data})
// لازم تتأكد من المسار الحقيقي عند الباك اند وتعدله هنا لو مختلف
export async function createProduct(
  data: Omit<Product, "id" | "createdAt" | "updatedAt">
): Promise<Product> {
  const response = await api.post<{ status: boolean; data: Product }>(
    "/api/products",
    data
  );
  return response.data.data;
}

// ⚠️ نفس الملاحظة - تأكد من المسار الحقيقي عند الباك اند
export async function updateProduct(
  id: number,
  data: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>
): Promise<Product> {
  const response = await api.put<{ status: boolean; data: Product }>(
    `/api/products/${id}`,
    data
  );
  return response.data.data;
}