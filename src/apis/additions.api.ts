import { api } from "@/lib/api";
import type {
  AdditionItem,
  AdditionPaymentsResponse,
  AdditionsResponse,
  CreateAdditionPayload,
  UpdateAdditionPayload,
} from "@/types/additions";

export const additionsApi = {
  // GET: قائمة الإضافات الخاصة بعنصر معين
  getAdditions: async (orderId: number | string, itemId: number | string) => {
    const response = await api.get<AdditionsResponse | AdditionItem[]>(
      `/api/orders/${orderId}/items/${itemId}/additions`
    );
    return response.data;
  },

  // POST: تسجيل إضافة جديدة (بنفس مسار الـ GET، مع دفعة أولى اختيارية)
  createAddition: async (
    orderId: number | string,
    itemId: number | string,
    payload: CreateAdditionPayload
  ) => {
    const response = await api.post(
      `/api/orders/${orderId}/items/${itemId}/additions`,
      payload
    );
    return response.data;
  },

  // GET: دفعات إضافة معينة
  // ⚠️ المسار من غير "/api" في الأول، بعكس باقي endpoints الملف ده - ده نفس
  // المسار اللي بعتهولي بالظبط، بس يستاهل تتأكد إنه مقصود ومش سهو
  getAdditionPayments: async (additionId: number | string) => {
    const response = await api.get<AdditionPaymentsResponse>(
      `/api/orders/items/payments/${additionId}`
    );
    return response.data;
  },

  // POST: إضافة دفعة جديدة على إضافة معينة
  // ⚠️ لاحظ إن المسار ده معاه "/api" في الأول، عكس الـ GET اللي فوق (من غيرها)
  // - نفس المسارين اللي بعتهملي بالظبط، يستاهل تتأكد إنه مش سهو
  addAdditionPayment: async (
    additionId: number | string,
    payload: { amount: number }
  ) => {
    const response = await api.post(
      `/api/orders/items/payments/${additionId}`,
      payload
    );
    return response.data;
  },

  // PUT: تعديل بيانات إضافة موجودة (اسم الصنيعي / اسم الخامة / الأجرة)
  updateAddition: async (
    additionId: number | string,
    payload: UpdateAdditionPayload
  ) => {
    const response = await api.put(
      `/api/orders/items/additions/${additionId}`,
      payload
    );
    return response.data;
  },

  // PUT: تعديل دفعة موجودة لإضافة معينة
  // ⚠️ المسار زي ما بعتهولي بالظبط: {itemId} هنا هو رقم عنصر الأوردر
  // (orderItemId)، مش رقم الأوردر نفسه
  updateAdditionPayment: async (
    itemId: number | string,
    additionId: number | string,
    paymentId: number | string,
    payload: { amount: number }
  ) => {
    const response = await api.put(
      `/api/orders/${itemId}/items/${additionId}/payments/${paymentId}`,
      payload
    );
    return response.data;
  },
};