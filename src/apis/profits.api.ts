import { api } from "@/lib/api";
import { MonthlyReportResponse, ProfitReportType } from "@/types/profits";

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

  const response = await api.get<MonthlyReportResponse>("api/finance/monthly-report", {
    params,
  });
  console.log(`Report Data for Type [${type || 'default'}], Month [${month}], Year [${year}]:`, response.data);
  return response.data;
}