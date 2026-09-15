export interface IWorker {
  id: number;
  name: string;
  daily_wage: string;
  created_at: string | null;
  updated_at: string | null;
  payment: string;
}

export interface WorkersResponse {
  status: boolean;
  data: IWorker[]; // ✅ اتصلحت - كانت بتشاور على "Worker" غير معرّف في الملف ده،
  // فـ TypeScript كان بياخد الـ Worker العالمي بتاع DOM (Web Workers API) بدل موظفينك فعلياً
}

export interface WorkerOrderItem {
  id: number;
  order_id: number;
  name: string;
  price: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkerOrderItemsResponse {
  status: boolean;
  worker_id: string;
  data: WorkerOrderItem[];
}

export interface WorkerPayment {
  id: number;
  worker_id: number;
  payment: string | number;
  amount?: string | number;
  created_at: string;
  updated_at: string;
}

export interface WorkerPaymentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker: { id: number; name: string } | null;
}


export interface EditWorkerPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  workerId: number | null;
  payment: WorkerPayment | null;
}


export interface ICreateWorkerDTO {
  name: string;
  daily_wage: number;
}