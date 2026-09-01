import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWorkers, fetchWorkerOrderItems, fetchWorkerPayments, addWorkerPaymentApi, updateWorkerPaymentApi} from "@/apis/workers.api";
import { IWorker, WorkerOrderItem, WorkerPayment } from "@/types/workers";


export function useWorkers() {
  const query = useQuery({
    queryKey: ["workers"],
    queryFn: fetchWorkers,
  });

  const workers: IWorker[] = (query.data?.data as unknown as IWorker[]) || [];

  return {
    ...query,
    workers,
  };
}

export function useWorkerOrderItems(workerId: number | null) {
  const query = useQuery({
    queryKey: ["worker-order-items", workerId],
    queryFn: () => fetchWorkerOrderItems(workerId!),
    enabled: !!workerId,
  });

  const items: WorkerOrderItem[] = (query.data?.data as unknown as WorkerOrderItem[]) || [];

  return {
    ...query,
    items,
  };
}

export function useWorkerPayments(workerId: number | null) {
  const query = useQuery({
    queryKey: ["worker-payments", workerId],
    queryFn: () => fetchWorkerPayments(workerId!),
    enabled: !!workerId,
  });

  const payments: WorkerPayment[] = (query.data?.data as unknown as WorkerPayment[]) || [];

  return {
    ...query,
    payments,
  };
}

export function useAddWorkerPayment(workerId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payment: number) => addWorkerPaymentApi(workerId!, payment),
    onSuccess: () => {
      // إعادة جلب بيانات العمال لتحديث إجمالي المدفوعات في الكاردز الرئيسية فوراً
      queryClient.invalidateQueries({ queryKey: ["workers"] });
      // إعادة جلب دفعات العامل لتحديث قائمة الدفعات تلقائياً إذا كانت مفتوحة
      queryClient.invalidateQueries({ queryKey: ["worker-payments", workerId] });
      // إعادة جلب أوردرات العامل لو لزم الأمر
      queryClient.invalidateQueries({ queryKey: ["worker-order-items", workerId] });
    },
  });
}


export function useUpdateWorkerPayment(workerId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ paymentId, payment }: { paymentId: number; payment: number }) => 
      updateWorkerPaymentApi(paymentId, payment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workers"] });
      queryClient.invalidateQueries({ queryKey: ["worker-payments", workerId] });
    },
  });
}

