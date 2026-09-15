// ✅ تايبات مرحلة "الإضافات" الجديدة - مصدر بيانات منفصل تمامًا عن باقي
// المراحل (نجارة/دهان/تنجيد)، وبيجي من /api/orders/{orderId}/items/{itemId}/additions

export interface AdditionItem {
  id: number;
  order_item_id: number;
  worker_name: string;
  material_name: string;
  total_price: number;
  total_paid: number;
  remaining: number;
}

// ⚠️ لسه مش متأكدين 100% لو الـ GET بيرجع array مباشر أو متغلف {status, data}
// زي باقي endpoints المشروع - الهوك (use-additions.ts) بيتعامل مع الحالتين،
// فمش هينكسر أيًا كان الشكل. لو حصل خطأ قولّي الشكل الحقيقي وهظبطه بسرعة.
export interface AdditionsResponse {
  status?: boolean;
  data: AdditionItem[];
}

export interface CreateAdditionPayload {
  worker_name: string;
  material_name: string;
  total_price: number;
  payment: number;
}

// ✅ دفعات كل إضافة - GET /orders/items/payments/{additionId}
// ⚠️ المسار من غير "/api" في الأول، بعكس باقي endpoints الملف ده
export interface AdditionPaymentItem {
  id: number;
  order_item_addition_id: number;
  amount: string; // ⚠️ راجعة كـ string من الباك اند (زي "500.00") مش number
  paid_at: string;
  created_at: string;
  updated_at: string;
}

export interface AdditionPaymentsData {
  addition_id: number;
  total_price: string; // ⚠️ برضو string
  total_paid: number;
  remaining: number;
  payments_list: AdditionPaymentItem[];
}

export interface AdditionPaymentsResponse {
  data: AdditionPaymentsData;
}

// ✅ تعديل بيانات إضافة موجودة - PUT /api/orders/items/additions/{additionId}
// كل الحقول "sometimes" عند الباك اند، بس إحنا هنبعتهم التلاتة مع بعض دايمًا
export interface UpdateAdditionPayload {
  worker_name?: string;
  material_name?: string;
  total_price?: number;
}