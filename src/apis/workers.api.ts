import { api } from "@/lib/api";
import { ICreateWorkerDTO, WorkerOrderItemsResponse, WorkersResponse } from "@/types/workers";


export async function fetchWorkers(): Promise<WorkersResponse> {
  const response = await api.get("/api/get-worker"); // استبدل بمسار الـ endpoint الفعلي لو كان مختلفاً
  return response.data;
}

export async function fetchWorkerOrderItems(workerId: number): Promise<WorkerOrderItemsResponse> {
  const response = await api.get(`/api/workers/${workerId}/order-items`);
  return response.data;
}

export async function addWorkerPaymentApi(workerId: number, payment: number) {
  const response = await api.post(`/api/workers/${workerId}/payments`, { payment });
  return response.data;
}

export async function fetchWorkerPayments(workerId: number) {
  const response = await api.get(`/api/workers/${workerId}/payments`);
  return response.data;
}

export async function updateWorkerPaymentApi(paymentId: number, payment: number) {
  const response = await api.put(`/api/worker-payments/${paymentId}`, { payment });
  return response.data;
}

export async function fetchOrderItemStages(orderId: number, itemId: number) {
  const response = await api.get(`/api/orders/${orderId}/items/${itemId}/stages`);
  return response.data;
}

export async function createWorker(data: ICreateWorkerDTO) {
  const response = await api.post("/api/workers", data);
  return response.data;
}