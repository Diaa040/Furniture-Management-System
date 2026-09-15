"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResponse, IDisplayPayment, RawMaterial } from "@/types/inventory";
import {
  AddInventoryPayment,
  DeleteInventoryPayment,
  DisplayInventoryPayment,
} from "@/apis/inventory.api";
import { api } from "@/lib/api";
import axios from "axios";

interface InventoryProps {
  data: ApiResponse;
  categoryId: number | string;
}

// بنجمّع منطق استخراج رسالة الخطأ من الرد في مكان واحد بدل ما يتكرر في كل mutation
function extractErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      fallback
    );
  }
  if (error instanceof Error) {
    return error.message || fallback;
  }
  return fallback;
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

  // --- حالة خاصة بمودال تأكيد حذف دفعة (بدل الـ confirm/alert) ---
  const [paymentIdPendingDelete, setPaymentIdPendingDelete] = useState<
    number | null
  >(null);

  // --- حالات خاصة بمودال "استرجاع للمخزن" ---
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnMaterialId, setReturnMaterialId] = useState<number | null>(
    null,
  );
  const [returnMaterialName, setReturnMaterialName] = useState<string>("");
  const [returnQuantity, setReturnQuantity] = useState("");

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
        Number(categoryId),
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
    deletePaymentMutation.reset();
  };

  // استخدام useMutation لإرسال الدفعة
  const addPaymentMutation = useMutation({
    mutationFn: (paymentData: {
      raw_material_id: number;
      quantity: number;
      unit_price: number;
    }) => AddInventoryPayment(Number(categoryId), paymentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory", categoryId] });
      closeModal();
    },
    onError: (error: unknown) => {
      // بنسجل الخطأ في الكونسول بس، والرسالة بتتعرض جوه المودال نفسه (تحت)
      console.error("الخطأ الكامل القادم من السيرفر:", error);
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
    addPaymentMutation.reset();
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

  // mutation الحذف تستقبل paymentId فقط وتجلب raw_material_id من الـ state الحالي
  const deletePaymentMutation = useMutation({
    mutationFn: (paymentId: number) => {
      const rawMaterialId = selectedMaterialForPayments?.id;
      if (!rawMaterialId) throw new Error("لم يتم تحديد الخامة");
      return DeleteInventoryPayment(
        Number(categoryId),
        Number(rawMaterialId),
        Number(paymentId),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory", categoryId] });
      setPaymentIdPendingDelete(null);

      // إعادة تحديث قائمة الدفعات داخل الـ Modal المفتوح حالياً
      if (selectedMaterialForPayments) {
        openPaymentsModal(
          selectedMaterialForPayments.id,
          selectedMaterialForPayments.name,
        );
      }
    },
    onError: (error: unknown) => {
      console.error("خطأ أثناء حذف الدفعة:", error);
      // بنسيب مودال التأكيد مقفول عشان رسالة الخطأ تبان في مودال الدفعات نفسه
      setPaymentIdPendingDelete(null);
    },
  });

  // دالة فتح مودال تأكيد الحذف بدل الـ confirm() المباشر
  const handleDeletePayment = (paymentId: number) => {
    setPaymentIdPendingDelete(paymentId);
  };

  const confirmDeletePayment = () => {
    if (paymentIdPendingDelete != null) {
      deletePaymentMutation.mutate(paymentIdPendingDelete);
    }
  };

  const cancelDeletePayment = () => {
    setPaymentIdPendingDelete(null);
  };

  // ✅ mutation استرجاع كمية للمخزن - POST /api/raw-materials/{rawMaterialId}/return
  const returnMaterialMutation = useMutation({
    mutationFn: (payload: { rawMaterialId: number; quantity: number }) =>
      api.post(`/api/raw-materials/${payload.rawMaterialId}/return`, {
        quantity: payload.quantity,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory", categoryId] });
      closeReturnModal();
    },
    onError: (error: unknown) => {
      console.error("خطأ أثناء استرجاع الكمية للمخزن:", error);
    },
  });

  // فتح مودال استرجاع للمخزن
  const openReturnModal = (rawMaterialId: number, rawMaterialName: string) => {
    setReturnMaterialId(rawMaterialId);
    setReturnMaterialName(rawMaterialName);
    setIsReturnModalOpen(true);
  };

  // غلق مودال استرجاع للمخزن
  const closeReturnModal = () => {
    setIsReturnModalOpen(false);
    setReturnMaterialId(null);
    setReturnMaterialName("");
    setReturnQuantity("");
    returnMaterialMutation.reset();
  };

  const handleSubmitReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnMaterialId || !returnQuantity) return;

    returnMaterialMutation.mutate({
      rawMaterialId: returnMaterialId,
      quantity: Number(returnQuantity),
    });
  };

  const addPaymentErrorMessage = addPaymentMutation.isError
    ? extractErrorMessage(addPaymentMutation.error, "حدث خطأ أثناء إضافة الدفعة")
    : "";

  const deletePaymentErrorMessage = deletePaymentMutation.isError
    ? extractErrorMessage(deletePaymentMutation.error, "حدث خطأ أثناء حذف الدفعة")
    : "";

  const returnErrorMessage = returnMaterialMutation.isError
    ? extractErrorMessage(
        returnMaterialMutation.error,
        "حدث خطأ أثناء استرجاع الكمية للمخزن",
      )
    : "";

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
              <th className="py-3 px-6 font-medium">استرجاع للمخزن</th>
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
                  <td className="py-4 px-6">
                    <button
                      onClick={() => openReturnModal(item.id, item.name)}
                      className="inline-flex items-center gap-2 px-4 py-1.5 border border-amber-200 rounded-lg text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 transition"
                    >
                      استرجاع للمخزن
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

              {/* رسالة الخطأ جوه المودال بدل الـ alert */}
              {addPaymentErrorMessage && (
                <div className="rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-3 py-2.5">
                  {addPaymentErrorMessage}
                </div>
              )}

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

            {/* رسالة خطأ الحذف بتظهر هنا بدل الـ alert */}
            {deletePaymentErrorMessage && (
              <div className="mb-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-3 py-2.5">
                {deletePaymentErrorMessage}
              </div>
            )}

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
                              onClick={() => handleDeletePayment(Number(payment.id))}
                              disabled={deletePaymentMutation.isPending}
                              className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-medium transition disabled:opacity-50"
                            >
                              {deletePaymentMutation.isPending &&
                              paymentIdPendingDelete === payment.id
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

      {/* --- Modal استرجاع كمية للمخزن --- */}
      {isReturnModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              استرجاع كمية للمخزن - {returnMaterialName}
            </h3>

            <form onSubmit={handleSubmitReturn} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  الكمية المسترجعة (Quantity)
                </label>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  value={returnQuantity}
                  onChange={(e) => setReturnQuantity(e.target.value)}
                  placeholder="أدخل الكمية"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              {returnErrorMessage && (
                <div className="rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-3 py-2.5">
                  {returnErrorMessage}
                </div>
              )}

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={closeReturnModal}
                  className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={returnMaterialMutation.isPending}
                  className="px-4 py-2 text-xs font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition disabled:opacity-50"
                >
                  {returnMaterialMutation.isPending
                    ? "جاري الاسترجاع..."
                    : "تأكيد الاسترجاع"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- مودال تأكيد حذف دفعة (بديل الـ confirm) --- */}
      {paymentIdPendingDelete !== null && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
            <h3 className="text-base font-bold text-gray-800 mb-2">
              تأكيد حذف الدفعة
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              هل أنت متأكد من رغبتك في حذف هذه الدفعة؟ لا يمكن التراجع عن هذا
              الإجراء.
            </p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={cancelDeletePayment}
                disabled={deletePaymentMutation.isPending}
                className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={confirmDeletePayment}
                disabled={deletePaymentMutation.isPending}
                className="px-5 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {deletePaymentMutation.isPending ? "جاري الحذف..." : "حذف"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}