"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface DispenseMaterialPayload {
  raw_material_id: number;
  category_id: number;
  quantity: number;
  order_item_id: number;
  stage_name: string;
}
export function useRawMaterialsByCategory(categoryId: number | null) {
  return useQuery({
    queryKey: ["raw-materials-by-category", categoryId],
    queryFn: async () => {
      if (!categoryId) return null;
      
      const res = await fetch(`${API_BASE_URL}/inventory/rawmaterials/${categoryId}`, {
        headers: { Accept: "application/json" },
      });
      
      if (!res.ok) throw new Error("فشل في جلب خامات هذه المرحلة");
      
      const json = await res.json();
      return json.data !== undefined ? json.data : json;
    },
    enabled: !!categoryId, // لا يتم تشغيل الـ Query إلا إذا وجد categoryId
  });
}
// Mutation لطلب صرف الخامة عبر Endpoint الجديد
export function useDispenseMaterial(orderId: number, itemId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: DispenseMaterialPayload) => {
      const res = await fetch(`${API_BASE_URL}/withdrawals/item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "فشل عملية صرف الخامة");
      }

      return res.json();
    },
    onSuccess: () => {
      // إعادة جلب بيانات مراحل العنصر لإظهار التحديثات
      queryClient.invalidateQueries({
        queryKey: ["item-stages", orderId, itemId],
      });
    },
  });
}