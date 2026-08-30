"use client";

import { fetchHandlerCustody, updateUsedQuantity } from "@/apis/materials.api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";


interface HandlerMaterialsItem {
  id: number;
  raw_material_name: string;
  handler_name: string;
  withdrawn_quantity: string;
  used_quantity: string;
  remaining: number;
}

interface HandlerMaterialsResponse {
  status: boolean;
  message: string;
  data: HandlerMaterialsItem[];
}


export default function HandlersCustodyPage() {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ id: number; name: string } | null>(null);
  const [usedQuantityInput, setUsedQuantityInput] = useState("");

  const { data: responseData, isLoading } = useQuery<HandlerMaterialsResponse>({
    queryKey: ["handlers-custody"],
    queryFn: fetchHandlerCustody,
  });

  const updateUsedMutation = useMutation({
    mutationFn: updateUsedQuantity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["handlers-custody"] });
      alert("تم تحديث الكمية المستخدمة بنجاح");
      closeModal();
    },
    onError: (error) => {
      let msg = "حدث خطأ أثناء التحديث";
      if (axios.isAxiosError(error)) {
        msg = error.response?.data?.message || error.message;
      }
      alert("خطأ: " + msg);
    },
  });

  const openModal = (id: number, name: string) => {
    setSelectedItem({ id, name });
    setUsedQuantityInput("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setUsedQuantityInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    updateUsedMutation.mutate({
      id: selectedItem.id,
      used_quantity: Number(usedQuantityInput),
    });
  };

  const custodyList: HandlerMaterialsItem[] = responseData?.data || [];

  return (
    <div className="p-8 mx-auto bg-gray-50/50 min-h-screen text-right" dir="rtl">
      {/* عنوان الصفحة والوصف */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">عهدة الخامات عند المنفذين</h1>
        <p className="text-sm text-gray-500">
          ما تبقى من خامات مصروفة سابقًا عند كل نجار أو منفذ خارجي - اضغط إضافة كمية مستخدمة لتسجيل الكميات المستهلكة.
        </p>
      </div>

      {isLoading ? (
        <p className="text-center py-12 text-gray-500 text-base">جاري تحميل البيانات...</p>
      ) : custodyList.length === 0 ? (
        <p className="text-center py-12 text-gray-400 text-base">لا توجد عهد مسجلة حالياً.</p>
      ) : (
        /* شبكة الكروت: 3 كروت في الصف الواحد مع مسافة مريحة وطول مناسب */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {custodyList.map((item: HandlerMaterialsItem) => {
            const initials = item.handler_name ? item.handler_name.slice(0, 2) : "من";

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm flex flex-col justify-between transition hover:shadow-md min-h-85"
              >
                {/* رأس الكارت: الدائرة يسار والاسم والتفاصيل يمينها */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm shrink-0">
                      {initials}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{item.handler_name}</h3>
                      <p className="text-sm text-gray-400 mt-0.5">
                        {item.raw_material_name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* تفاصيل العهدة والكميات (الأرقام يسار والأسماء يمين) */}
                <div className="space-y-4 mb-8">
                  <div className="border-t border-gray-100 pt-4 space-y-4">
                    <div className="flex justify-between items-center text-base">
                      <span className="text-gray-400 text-sm">المتبقي</span>
                      <span className="text-gray-900 font-bold">
                        {item.remaining}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-base border-t border-gray-50 pt-3">
                      <span className="text-gray-400 text-sm">الكمية المسحوبة</span>
                      <span className="text-gray-700 font-semibold">{item.withdrawn_quantity}</span>
                    </div>
                    <div className="flex justify-between items-center text-base border-t border-gray-50 pt-3">
                      <span className="text-gray-400 text-sm">الكمية المستخدمة</span>
                      <span className="text-emerald-600 font-bold">{item.used_quantity}</span>
                    </div>
                  </div>
                </div>

                {/* زر إضافة كمية مستخدمة */}
                <button
                  onClick={() => openModal(item.id, item.handler_name)}
                  className="w-full py-3 px-4 border border-amber-200/60 rounded-xl text-amber-900 bg-white hover:bg-amber-50/50 text-sm font-semibold transition text-center"
                >
                  إضافة كمية مستخدمة
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* بوب أب إدخال الكمية المستخدمة */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg" dir="rtl">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              إضافة كمية مستخدمة للمنفذ
            </h3>
            {selectedItem && (
              <p className="text-sm text-blue-600 font-semibold mb-4">
                {selectedItem.name}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  الكمية المستخدمة (used_quantity)
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={usedQuantityInput}
                  onChange={(e) => setUsedQuantityInput(e.target.value)}
                  placeholder="أدخل الكمية المستخدمة"
                  required
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={updateUsedMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition disabled:opacity-50"
                >
                  {updateUsedMutation.isPending ? "جاري الحفظ..." : "حفظ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}