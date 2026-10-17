"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from "@/apis/customers.api";
import { TCustomer, ICreateCustomerDTO } from "@/types/customer";

export default function CustomersPage() {
  const queryClient = useQueryClient();

  // حالات (States) خاصة بإدخال البيانات من الـ Form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  
  // حالة لمعرفة هل نحن في وضع تعديل عميل حالياً أم إضافة جديد
  const [editingId, setEditingId] = useState<number | null>(null);

  // 1. (GET) جلب البيانات ديناميكياً من الباك اند
  const { data: customers, isLoading } = useQuery<TCustomer[]>({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  // 2. (POST) إضافة عميل جديد ديناميكياً
  const createMutation = useMutation({
    mutationFn: (newCustomer: ICreateCustomerDTO) => createCustomer(newCustomer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      resetForm(); // تفريغ الحقول بعد النجاح
    },
  });

  // 3. (PUT) تعديل عميل ديناميكياً
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ICreateCustomerDTO> }) => 
      updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      resetForm(); // تفريغ الحقول وإلغاء وضع التعديل
    },
  });

  // 4. (DELETE) حذف عميل
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });

  // دالة لإعادة ضبط الـ Form
  const resetForm = () => {
    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setEditingId(null);
  };

  // معالجة إرسال الـ Form (سواء للإضافة أو التعديل)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId !== null) {
      // لو احنا في وضع التعديل (PUT)
      updateMutation.mutate({
        id: editingId,
        data: {
          name,
          phone,
          email,
          address,
        },
      });
    } else {
      // لو احنا في وضع الإضافة الجديدة (POST)
      createMutation.mutate({
        name,
        phone,
        email,
        address,
        totalOrders: 0,
        totalSpent: 0,
        status: "active",
        createdAt: new Date().toISOString(),
      });
    }
  };

  // تعبئة الـ Form ببيانات العميل المراد تعديله
  const handleEditClick = (customer: TCustomer) => {
    setEditingId(customer.id);
    setName(customer.name);
    setPhone(customer.phone);
    setEmail(customer.email || "");
    setAddress(customer.address || "");
  };

  if (isLoading) return <p>جاري التحميل...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>إدارة العملاء (ديناميكي)</h1>
      
      {/* نموذج الإدخال والإضافة والتعديل */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input 
          type="text" 
          placeholder="اسم العميل" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="رقم الهاتف" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)} 
          required 
        />
        <input 
          type="email" 
          placeholder="البريد الإلكتروني (اختياري)" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="العنوان (اختياري)" 
          value={address} 
          onChange={(e) => setAddress(e.target.value)} 
        />

        <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
          {editingId !== null ? "تحديث العميل" : "إضافة عميل جديد"}
        </button>

        {editingId !== null && (
          <button type="button" onClick={resetForm} style={{ background: "gray", color: "white" }}>
            إلغاء التعديل
          </button>
        )}
      </form>

      {/* قائمة عرض العملاء القادمة من الباك اند */}
      <ul>
        {customers?.map((customer) => (
          <li key={customer.id} style={{ margin: "10px 0", display: "flex", alignItems: "center", gap: "10px" }}>
            <span><strong>{customer.name}</strong> - {customer.phone} ({customer.status})</span>
            
            {/* زرار تحضير التعديل */}
            <button onClick={() => handleEditClick(customer)}>
              تعديل
            </button>
            
            {/* زرار الحذف */}
            <button 
              onClick={() => deleteMutation.mutate(customer.id)} 
              disabled={deleteMutation.isPending}
              style={{ background: "red", color: "white" }}
            >
              حذف
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}