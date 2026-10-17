import { useMutation, useQueryClient } from "@tanstack/react-query";

// بالظبط الحقول اللي الباك إند بيعمل عليها validate
// stage_name, execution_type, handler_name, agreed_cost
export interface StartStagePayload {
  stage_name: string;
  execution_type: "internal" | "external";
  handler_name: string | null;
  agreed_cost: number;
}

async function startStage(
  orderId: number,
  itemId: number,
  payload: StartStagePayload,
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${orderId}/items/${itemId}/stages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    const errData = await res.json().catch(() => null);
    throw new Error(errData?.message || "حدث خطأ أثناء حفظ المرحلة");
  }

  return res.json();
}

export function useStartStage(orderId: number, itemId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: StartStagePayload) =>
      startStage(orderId, itemId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["item-stages", orderId, itemId],
      });
    },
  });
}