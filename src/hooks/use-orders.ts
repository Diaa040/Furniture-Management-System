'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AddItem, getOrderStagesCost, getOrderWorkers, ordersApi, updateOrderItem , } from '@/apis/order.api';
import { CreateOrderPayload, OrderDetails, ItemStagesResponse, TAddItem } from '@/types/order';
import axios from 'axios';
import { TUpdateItemPayload } from "@/types/order";

// 🟢 واجهة مخصصة لبيانات الدفعة لتجنب استخدام any
export interface AddPaymentPayload {
  amount: number;
  payment_method?: string;
  notes?: string;
  [key: string]: unknown; // لضمان المرونة لو وجدت حقول إضافية
}

export function useDeleteOrderPayment(orderId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentId: number | string) =>
      ordersApi.deleteOrderPayment(orderId, paymentId),

    onSuccess: () => {
      // توحيد النوع إلى String لضمان المطابقة بغض النظر عن مصدر الـ ID
      queryClient.invalidateQueries({ queryKey: ["order-details", String(orderId)] });
      queryClient.invalidateQueries({ queryKey: ["order-stages-cost", String(orderId)] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useStagePayments(
  orderId: number,
  itemId: number,
  stageName: string,
  isOpen: boolean
) {
  return useQuery({
    queryKey: ['stage-payments', orderId, itemId, stageName],
    queryFn: async () => {
      const data = await ordersApi.getStagePayments(orderId, itemId, stageName);
      console.log("Stage Payments Response from Backend:", data);
      return data;
    },
    enabled: isOpen && !!orderId && !!itemId && !!stageName,
  });
}

export const useAddPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, itemId, data }: { orderId: number; itemId: number; data: AddPaymentPayload }) => {
      const response = await axios.post(`/api/orders/${orderId}/items/${itemId}/payments`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stage-payments', variables.orderId, variables.itemId] });
    },
  });
};

export function useAddOrderCustomerPayment(orderId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { amount: number }) =>
      ordersApi.addOrderCustomerPayment(orderId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-details', orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export async function getItemStages(
  orderId: number,
  itemId: number,
  stageName?: string
): Promise<ItemStagesResponse> {
  if (!orderId || !itemId) {
    throw new Error('Order ID and Item ID are required');
  }
  
  const response = await ordersApi.getItemStages(orderId, itemId, stageName);
  return response;
}

export function useOrders(page = 1) {
  return useQuery({
    queryKey: ['orders', page],
    queryFn: () => ordersApi.getOrders(page),
  });
}

export function useOrderDetails(orderId: number | null) {
  return useQuery({
    queryKey: ['order-details', orderId],
    queryFn: async () => {
      if (!orderId) throw new Error('Invalid order ID');
      
      const response = await ordersApi.getOrderDetails(orderId);

      if (response && typeof response === 'object' && 'data' in response) {
        return (response as { data: OrderDetails }).data;
      }
      return response as OrderDetails;
    },
    enabled: !!orderId,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => ordersApi.createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useAddCustomerPayment(orderId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { amount: number; payment_method: string; notes?: string }) =>
      ordersApi.addCustomerPayment(orderId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-details', orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useItemStages(
  orderId: number | null,
  itemId: number | null,
  stageName?: string
) {
  return useQuery<ItemStagesResponse>({
    queryKey: ['item-stages', orderId, itemId, stageName],
    queryFn: () => getItemStages(orderId!, itemId!, stageName),
    enabled: Boolean(orderId && itemId),
    staleTime: 0,
  });
}

export function useAddOrderItem(orderId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newItem: TAddItem) => AddItem(orderId, newItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order-details", orderId] });
    },
  });
}

export function useUpdateOrderItem(orderId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, data }: { itemId: number; data: Partial<TUpdateItemPayload> }) => 
      updateOrderItem(itemId, data),
    onSuccess: () => {
      // إعادة جلب تفاصيل الأوردر لتحديث العناصر والأسعار فوراً
      queryClient.invalidateQueries({ queryKey: ["order-details", orderId] });
    },
  });
}


export function useOrderStagesCost(orderId: number | string) {
  return useQuery({
    queryKey: ["order-stages-cost", orderId],
    queryFn: () => getOrderStagesCost(orderId),
    enabled: !!orderId,
  });
}



export function useOrderWorkers( enabled : boolean = true) {
  return useQuery({
    queryKey: ["workers"],
    queryFn: getOrderWorkers,
    select: (res) => res.data,
    enabled,
  });
}