"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResponse, IDisplayPayment, RawMaterial } from "@/types/inventory";
import {
  AddInventoryPayment,
  DeleteInventoryPayment,
  DisplayInventoryPayment,
} from "@/apis/inventory.api";
import axios from "axios";

interface InventoryProps {
  data: ApiResponse;
  categoryId: number | string;
}

export default function Inventory({ data, categoryId }: InventoryProps) {
  const queryClient = useQueryClient();
  const inventoryDetails = data.data;

  // --- حالات خاصة بالـ Modal لإضافة دفعة ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(
    null,
  );
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [selectedMaterialName, setSelectedMaterialName] = useState<string>("");

  // --- حالات خاصة بـ Modal عرض دفعات الشراء ---
  const [isPaymentsModalOpen, setIsPaymentsModalOpen] = useState(false);
  const [paymentsList, setPaymentsList] = useState<IDisplayPayment[]>([]);
  const [selectedMaterialForPayments, setSelectedMaterialForPayments] =
    useState<{ id: number; name: string } | null>(null);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);

  // دالة فتح بوب اب عرض الدفعات وجلب البيانات مباشرة
  const openPaymentsModal = async (
    rawMaterialId: number,
    rawMaterialName: string,
  ) => {
    setSelectedMaterialForPayments({
      id: rawMaterialId,
      name: rawMaterialName,
    });
    setIsPaymentsModalOpen(true);
    setIsLoadingPayments(true);

    try {
      const paymentsData = await DisplayInventoryPayment(
        categoryId,
        rawMaterialId,
      );
      console.log("البيانات القادمة من الـ API:", paymentsData);
      setPaymentsList(paymentsData || []);
    } catch (error) {
      console.error("خطأ أثناء جلب الدفعات:", error);
      setPaymentsList([]);
    } finally {
      setIsLoadingPayments(false);
    }
  };

  // دالة غلق بوب اب عرض الدفعات (مكتوبة مرة واحدة فقط بشكل صحيح)
  const closePaymentsModal = () => {
    setIsPaymentsModalOpen(false);
    setPaymentsList([]);
    setSelectedMaterialForPayments(null);
  };

  // استخدام useMutation لإرسال الدفعة
  const addPaymentMutation = useMutation({
    mutationFn: (paymentData: {
      raw_material_id: number;
      quantity: number;
      unit_price: number;
    }) => AddInventoryPayment(categoryId, paymentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory", categoryId] });
      alert("تم اضافه الدفعه بنجاح");
      closeModal();
    },
    onError: (error: unknown) => {
      console.error("الخطأ الكامل القادم من السيرفر:", error);
      let errorMessage = "حدث خطأ أثناء إضافة الدفعة";

      if (axios.isAxiosError(error)) {
        errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      alert("خطأ: " + errorMessage);
    },
  });

  // فتح الـ Modal لإضافة دفعة
  const openModal = (rawMaterialId: number, rawMaterialName: string) => {
    setSelectedMaterialId(rawMaterialId);
    setSelectedMaterialName(rawMaterialName);
    setIsModalOpen(true);
  };

  // غلق الـ Modal لإضافة دفعة
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMaterialId(null);
    setSelectedMaterialName("");
    setQuantity("");
    setUnitPrice("");
  };

  // تنفيذ الإرسال عند الضغط على زر حفظ
  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterialId) return;

    const payload = {
      raw_material_id: selectedMaterialId,
      quantity: Number(quantity),
      unit_price: Number(unitPrice),
    };

    addPaymentMutation.mutate(payload);
  };

 // 1. تعديل mutation الحذف لتستقبل paymentId فقط وتجلب raw_material_id من الـ state الحالي
  const deletePaymentMutation = useMutation({
    mutationFn: (paymentId: number) => {
      const rawMaterialId = selectedMaterialForPayments?.id;
      if (!rawMaterialId) throw new Error("لم يتم تحديد الخامة");
      return DeleteInventoryPayment(
        Number(categoryId),     
        Number(rawMaterialId),  
        Number(paymentId)       
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory", categoryId] });
      alert("تم حذف الدفعة بنجاح");

      // إعادة تحديث قائمة الدفعات داخل الـ Modal المفتوح حالياً
      if (selectedMaterialForPayments) {
        openPaymentsModal(
          selectedMaterialForPayments.id,
          selectedMaterialForPayments.name,
        );
      }
    },
    onError: (error: unknown) => {
      let errorMessage = "حدث خطأ أثناء حذف الدفعة";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      alert("خطأ: " + errorMessage);
    },
  });

  // دالة تنفيذ الحذف عند الضغط على الزر
  const handleDeletePayment = (paymentId: number) => {
    if (confirm("هل أنت متأكد من رغبتك في حذف هذه الدفعة؟")) {
      deletePaymentMutation.mutate(paymentId);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
        <h2 className="font-bold text-gray-800">{inventoryDetails.name}</h2>
        <span className="text-xs text-gray-400">
          {inventoryDetails.raw_materials.length} خامة
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-auto md:w-full text-right border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 text-xs">
              <th className="py-3 px-6 font-medium">الخامة</th>
              <th className="py-3 px-6 font-medium">الرصيد الحالي</th>
              <th className="py-3 px-6 font-medium">متوسط سعر الوحدة</th>
              <th className="py-3 px-6 font-medium">الحالة</th>
              <th className="py-3 px-6 font-medium">دفعات الشراء</th>
              <th className="py-3 px-6 font-medium">اضافة دفعة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {inventoryDetails.raw_materials.map((item: RawMaterial) => {
              const isLowStock =
                Number(item.current_stock) <= Number(item.minimum_stock_level);

              return (
                <tr key={item.id} className="hover:bg-gray-50/50 transition">
                  <td className="py-4 px-6 font-bold text-gray-800">
                    {item.name}
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {item.current_stock} {item.unit}
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {item.current_unit_price}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        isLowStock
                          ? "bg-red-50 text-red-500"
                          : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      {isLowStock ? "قرب النفاد" : "متوفر"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-left flex gap-2">
                    <button
                      onClick={() => openPaymentsModal(item.id, item.name)}
                      className="inline-flex items-center gap-2 px-4 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
                    >
                      دفعات الشراء
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => openModal(item.id, item.name)}
                      className="inline-flex items-center gap-2 px-4 py-1.5 border border-blue-200 rounded-lg text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition"
                    >
                      اضافه دفعة
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* --- Modal إضافة دفعة شراء --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              اضافه دفعة {selectedMaterialName}
            </h3>

            <form onSubmit={handleSubmitPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  الكمية (Quantity)
                </label>
                <input
                  type="number"
                  step="any"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="أدخل الكمية"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  سعر الوحدة (Unit Price)
                </label>
                <input
                  type="number"
                  step="any"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  placeholder="أدخل سعر الوحدة"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={addPaymentMutation.isPending}
                  className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {addPaymentMutation.isPending
                    ? "جاري الحفظ..."
                    : "حفظ الدفعة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Modal عرض دفعات الشراء --- */}
      {isPaymentsModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-lg max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  دفعات شراء الخامة
                </h3>
                {selectedMaterialForPayments && (
                  <span className="text-xs text-blue-600 font-semibold">
                    {selectedMaterialForPayments.name}
                  </span>
                )}
              </div>
              <button
                onClick={closePaymentsModal}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              {isLoadingPayments ? (
                <p className="text-center py-8 text-gray-500 text-sm">
                  جاري تحميل الدفعات...
                </p>
              ) : paymentsList.length === 0 ? (
                <p className="text-center py-8 text-gray-400 text-sm">
                  لا توجد دفعات شراء مسجلة لهذه الخامة.
                </p>
              ) : (
                <table className="w-full text-right border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 text-xs">
                      <th className="py-2 px-4">الكمية</th>
                      <th className="py-2 px-4">سعر الوحدة</th>
                      <th className="py-2 px-4">الإجمالي</th>
                      <th className="py-2 px-4">تاريخ الإضافة</th>
                      <th className="py-2 px-4 text-center">التحكم</th>{" "}
                      {/* 👈 عمود جديد */}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {Array.isArray(paymentsList) &&
                      paymentsList.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-700">
                            {payment.quantity}
                          </td>
                          <td className="py-3 px-4 text-gray-700">
                            {payment.unit_price}
                          </td>
                          <td className="py-3 px-4 font-bold text-emerald-600">
                            {payment.total_cost}
                          </td>
                          <td className="py-3 px-4 text-gray-500 text-xs">
                            {payment.created_at
                              ? new Date(payment.created_at).toLocaleDateString(
                                  "ar-EG",
                                )
                              : ""}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleDeletePayment(payment.id)}
                              disabled={deletePaymentMutation.isPending}
                              className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-medium transition disabled:opacity-50"
                            >
                              {deletePaymentMutation.isPending
                                ? "جاري الحذف..."
                                : "حذف"}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="flex justify-end mt-4 pt-3 border-t">
              <button
                onClick={closePaymentsModal}
                className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
