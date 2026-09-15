export interface Payment {
  id: number;
  order_id?: number;
  amount: number;
  payment_method?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RawMaterial {
  id: number;
  name: string;
  unit_price: string;
}

export interface RawMaterialCategoryData {
  category_id: number;
  category_name: string;
  raw_materials: RawMaterial[];
}

export interface RawMaterialItem {
  id: number;
  quantity?: number | string;
  unit_price?: number | string;
  total_cost?: number | string;
  raw_material?: {
    name?: string;
    unit?: string;
    unit_price?: number | string;
  };
}

export interface StageDetailItem {
  id?: number;
  name?: string;
  item?: string;
  cost?: number | string;
}

export interface OrderItemStage {
  id: number;
  order_item_id?: number;
  stage_name: string;
  stage_order?: number;
  status: "not_started" | "in_progress" | "completed" | string;
  handler_name?: string;
  workshop_name?: string;
  workshop?: string;
  execution_type?: "internal" | "external" | string;
  agreed_cost?: number | string;
  total_paid?: number | string;
  remaining_amount?: number | string;
  stage_cost?: number | string;
  raw_materials_cost?: number | string;
  details_cost?: number | string;
  raw_materials?: RawMaterialItem[];
  details?: {
    details?: {
      items?: StageDetailItem[];
    };
  } | null;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  id: number;
  order_id?: number;
  name: string;
  status: "pending" | "processing" | "delivered" | "cancelled" | string;
  price: number;
  notes?: string;
  stages?: OrderItemStage[];
  created_at?: string;
  updated_at?: string;
}

export interface OrderDetails {
  id: number;
  customer_name: string;
  customer_phone: string;
  status: "pending" | "processing" | "delivered" | "cancelled" | string;
  total_price: number;
  deposit_amount: number;
  remaining_amount: number;
  notes?: string;
  order_date?: string;
  delivery_date?: string;
  items: OrderItem[];
  payments: Payment[];
  created_at?: string;
  updated_at?: string;

}
export interface OrderDetailsResponse {
  status: boolean;
  totalOrderStagesCost?: number; // 👈 الحقل الموجود في المستوى الرئيسي للـ Response
  data: OrderDetails;
}

export interface CreateOrderPayload {
  customer_name: string;
  customer_phone: string;
  total_price: number;
  deposit_amount?: number;
  delivery_date?: string;
  notes?: string;
  items?: Array<{
    name: string;
    price: number;
    notes?: string;
  }>;
}

export interface ItemStagesResponse {
  order_id?: number | string;
  item_id?: number | string;
  item_name?: string;
  stage?: OrderItemStage;
  stages?: OrderItemStage[];
}
export interface PaymentItem {
  id: number;
  amount: number;
  date: string;
  notes: string | null;
}

export interface StagePaymentsResponse {
  status: boolean;
  stage_name: string;
  agreed_cost: number;
  total_paid: number;
  remaining: number;
  payments: PaymentItem[];
}

// ✅ اتصلحت - كانت معرّفة غلط كـ alias لـ OrderItem (قطعة أثاث مفردة داخل الأوردر)
// بينما OrdersTable وباقي أماكن استخدامها محتاجين شكل "الأوردر نفسه" (نفس حقول OrderDetails تقريباً، من غير items/payments لأن قائمة الأوردرات مش بترجعهم عادة)
export interface OrderListItem {
  id: number;
  customer_name: string;
  customer_phone: string;
  status: "pending" | "processing" | "delivered" | "cancelled" | string;
  total_price: number;
  deposit_amount: number;
  remaining_amount: number;
  notes?: string;
  order_date?: string;
  delivery_date?: string;
  created_at?: string;
  updated_at?: string;
}


export interface TAddItem{
  name: string;
  price: number;
  status: "pending" | "completed" | "cancelled"; // يمكنك إضافة باقي الحالات المحتملة
  notes: string;
}

export interface TUpdateItemPayload {
  name?: string;
  price?: number;
  status?: "pending" | "completed" | "cancelled" | string;
  notes?: string | null;
}

// src/types/stage.ts

export interface EditStagePayload {
  stage_name: string;
  execution_type: "internal" | "external";
  handler_name?: string;
  agreed_cost: number;
}

// ✅ أضيفت - كانت مستخدمة في startStageService (order.ts) لكن مش معرّفة، وده كان بيسبب type error
// نفس شكل الـ payload المستخدم في ordersApi.setStageDetails لأن الاتنين بيضربوا على نفس الـ endpoint
export interface StartStagePayload {
  stage_name: string;
  execution_type: "internal" | "external";
  agreed_cost: number;
  worker_note?: string;
  notes?: string;
  details?: { items: Array<{ name: string; cost: number }> };
}

export interface EditStageInitialData {
  executionType: string | null;
  workshopName: string;
  agreedCost: number;
}

export interface Worker {
  id: number;
  name: string;
  daily_wage: string;
  created_at: string | null;
  updated_at: string | null; // ✅ اتعدلت لـ string | null عشان تتطابق مع IWorker في @/types/workers.ts
  payment: string;
}

export interface WorkersResponse {
  status: boolean;
  data: Worker[];
}