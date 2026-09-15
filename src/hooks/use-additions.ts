"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { additionsApi } from "@/apis/additions.api";
import type {
  AdditionItem,
  AdditionPaymentsData,
  AdditionsResponse,
  CreateAdditionPayload,
  UpdateAdditionPayload,
} from "@/types/additions";

export function useAdditions(orderId: number, itemId: number) {
  return useQuery<AdditionItem[]>({
    queryKey: ["additions", orderId, itemId],
    queryFn: async () => {
      const res = await additionsApi.getAdditions(orderId, itemId);
      // ⚠️ بيتعامل مع الحالتين: رد array مباشر، أو متغلف {status, data}
      if (Array.isArray(res)) return res;
      return (res as AdditionsResponse)?.data ?? [];
    },
    enabled: Boolean(orderId && itemId),
  });
}

// ✅ دفعات إضافة معينة - بتتفعل بس والمودال فاتح (isOpen) عشان منعملش
// طلب من غير داعي وإحنا لسه في القائمة
export function useAdditionPayments(
  additionId: number | null,
  isOpen: boolean
) {
  return useQuery<AdditionPaymentsData>({
    queryKey: ["addition-payments", additionId],
    queryFn: async () => {
      const res = await additionsApi.getAdditionPayments(additionId as number);
      return res.data;
    },
    enabled: isOpen && !!additionId,
  });
}

// ✅ إضافة دفعة على إضافة معينة - بتعمل invalidate لدفعات نفس الإضافة، وكمان
// لكل queryKey بيبدأ بـ "additions" (كل الاستعلامات بتاعة أي orderId/itemId)
// عشان total_paid/remaining يتحدثوا في الكارد نفسه بعد نجاح الإضافة
export function useAddAdditionPayment(additionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { amount: number }) =>
      additionsApi.addAdditionPayment(additionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addition-payments", additionId],
      });
      queryClient.invalidateQueries({ queryKey: ["additions"] });
    },
  });
}

// ✅ تعديل دفعة موجودة لإضافة معينة - بتعمل invalidate لدفعات نفس الإضافة
// وكمان لقائمة الإضافات عشان total_paid/remaining يتحدثوا في الكارد
export function useUpdateAdditionPayment(itemId: number, additionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      paymentId,
      amount,
    }: {
      paymentId: number | string;
      amount: number;
    }) =>
      additionsApi.updateAdditionPayment(itemId, additionId, paymentId, {
        amount,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addition-payments", additionId],
      });
      queryClient.invalidateQueries({ queryKey: ["additions"] });
    },
  });
}

// ✅ تعديل بيانات إضافة موجودة (اسم الصنيعي / اسم الخامة / الأجرة)
export function useUpdateAddition(additionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateAdditionPayload) =>
      additionsApi.updateAddition(additionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["additions"] });
    },
  });
}

export function useCreateAddition(orderId: number, itemId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdditionPayload) =>
      additionsApi.createAddition(orderId, itemId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["additions", orderId, itemId],
      });
    },
  });
}