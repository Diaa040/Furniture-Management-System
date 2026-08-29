"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "@/types/inventory";
import { api } from "@/lib/api";
import Inventory from "@/components/inventory/Inventory";

// تعريف واجهة البيانات بالتسميات الجديدة المطلوبة من الباك إند
interface NewMaterialPayload {
  name: string;
  unit: string;
  quantity: number;
  minimum_stock_level: number;
  unit_price: number;
}

export default function InventoryPage() {
  const [selectedId, setSelectedId] = useState<number>(1);
  
  // 1. State للتحكم في فتح وإغلاق الـ Pop-up
  const [isModalOpen, setIsModalOpen] = useState(false);

  // States الخاصة بحقول نموذج إضافة خامة جديدة
  const [materialName, setMaterialName] = useState("");
  const [currentStock, setCurrentStock] = useState("");
  const [unit, setUnit] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [minStock, setMinStock] = useState("");

  const queryClient = useQueryClient();

  // جلب البيانات الأساسية
  const { data: inventory, isLoading, error } = useQuery({
    queryKey: ['inventory', selectedId],
    queryFn: async (): Promise<ApiResponse> => {
      const res = await api.get(`/api/inventory/${selectedId}`);
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });

  // 2. Mutation لإرسال الخامة الجديدة للباك إند
  const addMaterialMutation = useMutation({
    mutationFn: async (newMaterialData: NewMaterialPayload) => {
      const res = await api.post(`/api/inventory/addnew/${selectedId}`, newMaterialData);
      return res.data;
    },
    onSuccess: () => {
      setIsModalOpen(false);
      setMaterialName("");
      setCurrentStock("");
      setUnit("");
      setUnitPrice("");
      setMinStock("");
      queryClient.invalidateQueries({ queryKey: ['inventory', selectedId] });
    },
    onError: (err: unknown) => {
      const errorResponse = err as { response?: { data?: { message?: string } } };
      console.log("خطأ الباك إند الكامل:", errorResponse.response?.data);
      alert("خطأ من السيرفر: " + (errorResponse.response?.data?.message || "حدث خطأ غير معروف"));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // مطابقة المفاتيح تماماً بالشكل الذي طلبه الباك إند
    const payload: NewMaterialPayload = {
      name: materialName,
      unit: unit,
      quantity: currentStock ? Number(currentStock) : 0,
      minimum_stock_level: minStock ? Number(minStock) : 0,
      unit_price: unitPrice ? Number(unitPrice) : 0,
    };
    
    console.log("البيانات اللي رايحة للباك إند:", payload);

    addMaterialMutation.mutate(payload);
  };

  if (error) return <div className="p-6 text-center text-red-500">حدث خطأ أثناء تحميل البيانات</div>;

  return (
    <div className="p-6 bg-[#FDFBF7] min-h-screen dir-rtl text-right font-sans relative">
      
      {/* رأس الصفحة والأزرار العلوية */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">المخزن</h1>
          <p className="text-sm text-gray-500">
            الخامات مقسمة حسب كاتوجري - أضف أي كاتوجري أو خامة جديدة بحرية
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#8B5A2B] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#724822] transition"
          >
            اضافة خامة
          </button>
        </div>
      </div>

      {/* التابات الثابتة */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
        {[
          { id: 1, name: "نجارة" },
          { id: 2, name: "دهان" },
          { id: 3, name: "تنجيد" },
          { id: 4, name: "إضافات" },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedId(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedId === cat.id
                ? "bg-[#8B5A2B] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* محتوى الجدول */}
      {isLoading && !inventory ? (
        <div className="p-12 text-center text-gray-500">جاري تحميل خامات الكاتوجري...</div>
      ) : (
        inventory && <Inventory categoryId={selectedId} data={inventory} />
      )}

      {/* ==================== الـ POP-UP (MODAL) ==================== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="font-bold text-lg text-gray-800">إضافة خامة جديدة للكاتيجوري الحالي</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">اسم الخامة</label>
                <input
                  type="text"
                  required
                  value={materialName}
                  onChange={(e) => setMaterialName(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg text-sm outline-none focus:border-[#8B5A2B]"
                  placeholder="مثال: خشب زان احمر"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">الرصيد الحالي (Quantity)</label>
                  <input
                    type="number"
                    required
                    value={currentStock}
                    onChange={(e) => setCurrentStock(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded-lg text-sm outline-none focus:border-[#8B5A2B]"
                    placeholder="20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">وحدة القياس</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded-lg text-sm outline-none focus:border-[#8B5A2B]"
                    placeholder="متر مكعب"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">سعر الوحدة</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded-lg text-sm outline-none focus:border-[#8B5A2B]"
                    placeholder="4500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">اقل كمية للمخزن</label>
                  <input
                    type="number"
                    required
                    value={minStock}
                    onChange={(e) => setMinStock(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded-lg text-sm outline-none focus:border-[#8B5A2B]"
                    placeholder="25"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4 border-t pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={addMaterialMutation.isPending}
                  className="px-4 py-2 bg-[#8B5A2B] text-white rounded-lg text-sm hover:bg-[#724822] transition"
                >
                  {addMaterialMutation.isPending ? "جاري الحفظ..." : "حفظ الخامة"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}