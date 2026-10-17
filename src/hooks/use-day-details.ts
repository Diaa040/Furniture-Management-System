import { useQuery } from "@tanstack/react-query";
import { DayTransactionsDetailsResponse, fetchDayDetails, fetchDayTransactionsDetails } from "@/apis/transactions.api";
import type { DayDetailsResponse } from "@/types/transactions";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTransaction, UpdateTransactionPayload } from "@/apis/transactions.api";

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateTransactionPayload }) =>
      updateTransaction(id, payload),
    onSuccess: () => {
      // إعادة جلب البيانات لتحديث الجدول تلقائياً بعد التعديل الناجح
      queryClient.invalidateQueries({ queryKey: ["day-transactions-details"] });
    },
  });
}

export function useDayDetails() {
  return useQuery<DayDetailsResponse>({
    queryKey: ["day-details"], // مفتاح الكاش أصبح ثابت لأن البيانات تعتمد على الباك إند فقط
    queryFn: () => fetchDayDetails(),
  });
}

export function useDayTransactionsDetails(
  day: number,
  month: number,
  year: number,
  options?: { enabled?: boolean }
) {
  // ✅ اتضاف options.enabled عشان نقدر نمنع الـ request لحد ما المستخدم يختار تاريخ فعلاً،
  // مش بس نعتمد على إن القيم الافتراضية (تاريخ النهارده) صحيحة رقمياً
  const isEnabled = (options?.enabled ?? true) && !!day && !!month && !!year;

  return useQuery<DayTransactionsDetailsResponse>({
    queryKey: ["day-transactions-details", year, month, day],
    queryFn: () => fetchDayTransactionsDetails({ day, month, year }),
    enabled: isEnabled,
  });
}