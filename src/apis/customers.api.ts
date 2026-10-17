import { api } from "@/lib/api"
import { TCustomer, ICreateCustomerDTO } from "@/types/customer";

// 1. جلب العملاء
export async function getCustomers(): Promise<TCustomer[]> {
  // لاحظ هنا لم نكتب الرابط كاملاً ولم نكتب الـ headers!
  const response = await api.get('/customers'); 
  return response.data.data; // Axios يقوم بتحويل الـ JSON تلقائياً
}

// 2. إنشاء عميل جديد
export async function createCustomer(customerData: ICreateCustomerDTO): Promise<TCustomer> {
  const response = await api.post('/customers', customerData);
  return response.data.data;
}

// 3. تعديل عميل (Update)
// بنبعت الـ id عشان نعرف مين العميل، والبيانات الجديدة (ممكن نستخدم Partial عشان نبعت الحاجات اللي اتغيرت بس)
export async function updateCustomer(id: number, customerData: Partial<ICreateCustomerDTO>): Promise<TCustomer> {
  const response = await api.put(`/customers/${id}`, customerData);
  // أو لو الباك اند بيستخدم patch ممكن تستخدم api.patch
  return response.data.data;
}

// 4. حذف عميل (Delete)
export async function deleteCustomer(id: number): Promise<void> {
  await api.delete(`/customers/${id}`);
  // غالباً الـ Delete مبيرجعش بيانات، بيرجع رسالة نجاح فقط فمش محتاجين return لبيانات
}
