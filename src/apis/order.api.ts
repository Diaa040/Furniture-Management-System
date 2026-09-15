import { api } from "@/lib/api";
import { EditStagePayload } from "@/types/order";

import type {
  OrderListItem,
  OrderDetails,
  CreateOrderPayload,
  ItemStagesResponse,
  OrderItem,
  TAddItem,
  TUpdateItemPayload,
  StartStagePayload,
} from "@/types/order";

import { WorkersResponse } from "@/types/workers";

export async function getItemStages(
  orderId: number,
  itemId: number,
  stageName?: string
): Promise<ItemStagesResponse> {
  const response = await api.get<ItemStagesResponse>(
    `/api/orders/${orderId}/items/${itemId}/stages`,
    {
      params: stageName ? { stage_name: stageName } : undefined,
    }
  );

  return response.data;
}

export const ordersApi = {

  // 0️⃣ جلب مراحل قطعة معينة
  getItemStages,

  // 1️⃣ عرض جميع الأوردرات مع Pagination
  getOrders: async (page = 1) => {
    const response = await api.get<{
      status: boolean;
      data: { current_page: number; data: OrderListItem[] };
    }>(`/api/orders?page=${page}`);
    return response.data;
  },

  deleteOrderPayment: async (orderId: number | string, paymentId: number | string) => {
    const response = await api.delete(`/api/orders/${orderId}/payments/${paymentId}`);
    return response.data;
  },

  // 2️⃣ عرض تفاصيل أوردر معين
  getOrderDetails: async (id: number) => {
    const response = await api.get<{ status: boolean; data: OrderDetails }>(
      `/api/orders/${id}`
    );
    return response.data;
  },

  // 3️⃣ إنشاء أوردر جديد
  createOrder: async (payload: CreateOrderPayload) => {
    const response = await api.post("/api/orders", payload);
    return response.data;
  },

  addOrderCustomerPayment: async (orderId: number, payload: { amount: number }) => {
    const response = await api.post(`/api/orders/${orderId}/payments`, payload);
    return response.data;
  },

  // 4️⃣ تحديث بيانات أوردر
  updateOrder: async (id: number, payload: Partial<OrderListItem>) => {
    const response = await api.patch(`/api/order/update/${id}`, payload);
    return response.data;
  },

  // 5️⃣ تحصيل دفعة من العميل
  addCustomerPayment: async (
    orderId: number,
    payload: { amount: number; payment_method: string; notes?: string }
  ) => {
    const response = await api.post(`/api/orders/${orderId}/payments`, payload);
    return response.data;
  },

  // 6️⃣ عرض جميع العناصر (Items) داخل أوردر معين
  getOrderItems: async (orderId: number) => {
    const response = await api.get<{
      status: string;
      order_id: number;
      items: OrderItem[];
    }>(`/api/order/item/${orderId}`);
    return response.data;
  },

  // 8️⃣ تحديث تفاصيل تنفيذ المرحلة
  setStageDetails: async (
    orderId: number,
    itemId: number,
    payload: {
      stage_name: string;
      execution_type: "internal" | "external";
      agreed_cost: number;
      worker_note?: string;
      notes?: string;
      details?: { items: Array<{ name: string; cost: number }> };
    }
  ) => {
    const response = await api.post(
      `/api/orders/${orderId}/items/${itemId}/stages`,
      payload
    );
    return response.data;
  },

  async getStagePayments(orderId: number, itemId: number, stageName: string) {
    const response = await api.get(`/api/orders/${orderId}/items/${itemId}/payments`, {
      params: {
        stage_name: stageName,
      },
    });
    return response.data;
  },

  // 9️⃣ تعديل دفعة موجودة جوه مرحلة معينة
  // ⚠️ المسار ده من غير "/api" في الأول، بعكس باقي endpoints الدفعات في الملف ده (زي getStagePayments فوق)
  // ده مطابق للمسار اللي بعتهولي بالظبط، بس يستاهل تتأكد إنه مقصود ومش سهو
  updateStagePayment: async (
    orderId: number | string,
    itemId: number | string,
    paymentId: number | string,
    payload: { stage_name: string; amount: number }
  ) => {
    const response = await api.put(
      `/api/orders/${orderId}/items/${itemId}/payments/${paymentId}/update`,
      payload
    );
    return response.data;
  },

};

export async function AddItem(orderId: string | number, data: TAddItem): Promise<TAddItem> {
  const response = await api.post(`/api/order-items/${orderId}`, data);
  return response.data;
}

export async function updateOrderItem(
  id: number,
  itemData: Partial<TUpdateItemPayload>
): Promise<TUpdateItemPayload> {
  const response = await api.patch(`/api/order-items/${id}`, itemData);
  return response.data.data;
}

// ⚠️ تم تعديل المسار من "/orders/..." إلى "/api/orders/..." ليتوافق مع باقي الـ endpoints في الملف
export const startStageService = async (
  orderId: string | number,
  itemId: string | number,
  payload: StartStagePayload
) => {
  const response = await api.post(
    `/api/orders/${orderId}/items/${itemId}/stages`,
    payload
  );
  return response.data;
};

export async function getOrderStagesCost(orderId: number | string) {
  try {
    const response = await api.get(`/api/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order stages cost:", error);
    return { totalOrderStagesCost: 0 };
  }
}

export const stageApi = {
  updateStage: async (
    orderId: number,
    itemId: number,
    data: EditStagePayload
  ) => {
    const response = await api.patch(
      `/api/orders/${orderId}/items/${itemId}/update/stages`,
      data
    );
    return response.data;
  },
};

// ⚠️ تم تعديلها لتستخدم "api" بدلاً من "fetch" العادي، عشان يترفق التوكين تلقائياً
export async function getOrderWorkers(): Promise<WorkersResponse> {
  const response = await api.get<WorkersResponse>("/get-worker");
  return response.data;
}