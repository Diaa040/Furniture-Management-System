import { useMutation, useQueryClient } from "@tanstack/react-query";
import { stageApi } from "@/apis/order.api";
import type { EditStagePayload } from "@/types/order";

export function useUpdateStage(orderId: number, itemId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: EditStagePayload) =>
      stageApi.updateStage(orderId, itemId, payload),
    onSuccess: () => {
      // بيحدّث بيانات المرحلة (نوع التنفيذ/الاسم/التكلفة) فورًا في الصفحة
      queryClient.invalidateQueries({
        queryKey: ["item-stages", orderId, itemId],
      });
    },
  });
}