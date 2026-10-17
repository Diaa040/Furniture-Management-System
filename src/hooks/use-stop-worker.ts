import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

// بالظبط الحقول اللي الباك إند بيعمل عليها validate على /worker/stop
export interface StopWorkerPayload {
  item_id: number;
  quantity: number; // التكلفة الإجمالية (اليومية × عدد الأيام)
  days: number; // عدد الأيام
}

// شكل الرد اللي بيرجعه الباك إند بعد الحفظ
export interface StopWorkerResponse {
  item_id: number;
  agreed_cost: number;
  status: string;
  days: number;
}

async function stopWorker(payload: StopWorkerPayload) {
  const { data } = await api.post<StopWorkerResponse>(
    "/api/worker/stop",
    payload,
  );
  return data;
}

export function useStopWorker(orderId: number, itemId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: StopWorkerPayload) => stopWorker(payload),
    onSuccess: () => {
      // تحديث بيانات المرحلة بعد تسجيل أيام الشغل (لو الباك إند بقى يرجّعها مع المرحلة)
      queryClient.invalidateQueries({
        queryKey: ["item-stages", orderId, itemId],
      });
    },
  });
}