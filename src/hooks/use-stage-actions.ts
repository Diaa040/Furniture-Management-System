"use client";

import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";


interface AddDetailParams {
  orderId: number;
  itemId: number;
  stageName: string;
  item: string;
  cost: number;
}

interface DeleteDetailParams {
  orderId: number;
  itemId: number;
  stageName: string;
  itemName: string;
  itemCost: number;
}

export function useStageActions(orderId: number, itemId: number) {
  const queryClient = useQueryClient();

  // 1️⃣ Mutation لإضافة بند تكلفة
  const addDetailMutation = useMutation({
    mutationFn: async ({
      stageName,
      item,
      cost,
    }: Omit<AddDetailParams, "orderId" | "itemId">) => {
      // باستخدام Axios، البيانات تمر مباشرة والنتائج في res.data
      const res = await api.post(
        `api/orders/${orderId}/items/${itemId}/add/stages/`,
        {
          stage_name: stageName,
          item,
          cost: Number(cost),
        }
      );

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["item-stages", orderId, itemId],
      });
    },
  });

  // 2️⃣ Mutation لحذف بند تكلفة
  // ملاحظة: لو كنت تستخدم axios لطلب الـ DELETE وغالباً الـ DELETE يحتاج تمرير data داخل config ضعها هكذا:
  const deleteDetailMutation = useMutation({
    mutationFn: async ({
      stageName,
      itemName,
      itemCost,
    }: Omit<DeleteDetailParams, "orderId" | "itemId">) => {
      const res = await api.delete(
        `api/orders/${orderId}/items/${itemId}/stages/delete-item`,
        {
          data: {
            stage_name: stageName,
            item_name: itemName,
            item_cost: itemCost,
          },
        }
      );

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["item-stages", orderId, itemId],
      });
    },
  });

  return {
    addDetailItem: addDetailMutation.mutate,
    isAddingDetail: addDetailMutation.isPending,
    addDetailError: addDetailMutation.error,
    deleteDetailItem: deleteDetailMutation.mutate,
    isDeletingDetail: deleteDetailMutation.isPending,
    deleteDetailError: deleteDetailMutation.error,
  };
}