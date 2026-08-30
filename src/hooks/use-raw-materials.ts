"use client";

import { api } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

import { useState } from "react";

export interface WithdrawMaterialPayload {
  raw_material_id: number;
  category_id: number;
  quantity: number;
  order_item_id: number;
  stage_name: string;
}

export function useWithdrawMaterial() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const withdrawMaterial = async (payload: WithdrawMaterialPayload, onSuccess?: () => void) => {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await api.post('/api/withdrawals/item', payload);
      
      console.log('تم الصرف بنجاح:', response.data);

      if (onSuccess) {
        onSuccess();
      }

      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("حدث خطأ أثناء عملية الصرف، يرجى المحاولة مرة أخرى.");
      }
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    withdrawMaterial,
    isSubmitting,
    errorMessage,
  };
}

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
      
      // 🔎 أطبع هنا عشان تشوف هل فعلاً الـ categoryId جاي بـ 78 ولا رقم فئة؟
      console.log("Fetching raw materials for categoryId:", categoryId);
      
      const res = await fetch(`${API_BASE_URL}/inventory/rawmaterials/${categoryId}`, {
        headers: { Accept: "application/json" },
      });
      
      if (!res.ok) throw new Error("فشل في جلب خامات هذه المرحلة");
      
      const json = await res.json();
      return json.data !== undefined ? json.data : json;
    },
    enabled: !!categoryId,
  });
}
// Mutation لطلب صرف الخامة عبر Endpoint الجديد
export const useDispenseMaterial = (orderId: number, itemId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      raw_material_id: number;
      category_id: number;
      quantity: number;
      order_item_id: number;
      stage_name: string;
    }) => {
      // 👈 التعديل هنا: استخدام category_id في الـ URL بناءً على اختيار المرحلة (من 1 لـ 5)
      const response = await api.post(
        `/api/withdrawals/item`,
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order-details", orderId] });
      queryClient.invalidateQueries({ queryKey: ["item-stages", orderId, itemId] });
    },
  });
};