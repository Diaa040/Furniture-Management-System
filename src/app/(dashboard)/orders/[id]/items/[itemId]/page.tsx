"use client";

import { use, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DispenseMaterialModal } from "@/components/orders/DispenseMaterialModal";
import PaymentsModal from "@/components/orders/PaymentsModal";
import { EditStageModal } from "@/components/EditStageModal";

import {
  ArrowRight,
  Briefcase,
  CreditCard,
  Loader2,
  Package,
  Plus,
  Receipt,
  AlertCircle,
  X,
  Trash2,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useItemStages } from "@/hooks/use-orders";
import { useStageActions } from "@/hooks/use-stage-actions";
import { StartStageForm } from "@/components/orders/StartStageModal";
import type {
  ItemStagesResponse,
  OrderItemStage,
  RawMaterialItem,
  StageDetailItem,
} from "@/types/order";
import { api } from "@/lib/api";

const DEFAULT_STAGES = [
  { id: 1, name: "النجارة", order: 1 },
  { id: 2, name: "الدهان", order: 2 },
  { id: 3, name: "التنجيد", order: 3 },
  { id: 4, name: "إضافات", order: 4 },
  { id: 5, name: "التسليم", order: 5 },
];

const statusDotMap: Record<string, { color: string; label: string }> = {
  completed: { color: "bg-emerald-500", label: "مكتملة" },
  in_progress: { color: "bg-amber-500", label: "قيد التنفيذ" },
  not_started: { color: "bg-gray-300", label: "لم تبدأ" },
  pending: { color: "bg-gray-300", label: "لم تبدأ" },
};

export default function ItemDetailsPage({
  params,
}: {
  params: Promise<{
    id: string;
    itemId: string;
  }>;
}) {
  const resolvedParams = use(params);
  const orderId = Number(resolvedParams.id);
  const itemId = Number(resolvedParams.itemId);
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    addDetailItem,
    isAddingDetail,
    addDetailError,
    deleteDetailItem,
    isDeletingDetail,
  } = useStageActions(orderId, itemId);

  // States المودال والنماذج
  const [showStartForm, setShowStartForm] = useState(false);
  const [isAddDetailOpen, setIsAddDetailOpen] = useState(false);
  const [newDetailItemName, setNewDetailItemName] = useState("");
  const [newDetailItemCost, setNewDetailItemCost] = useState("");
  const [isDispenseModalOpen, setIsDispenseModalOpen] = useState(false);

  // حالة فتح وإغلاق مودال تعديل البيانات
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // حالات مستقلة لكل زر من زري الدفعات
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [isViewPaymentsModalOpen, setIsViewPaymentsModalOpen] = useState(false);

  // حالات نموذج إضافة دفعة جديدة
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  // 1️⃣ قراءة اسم المرحلة الحالية من الـ URL
  const currentStageFromUrl = searchParams.get("stage")
    ? decodeURIComponent(searchParams.get("stage")!)
    : undefined;

  // 2️⃣ إرسال اسم المرحلة للـ Hook لطلب البيانات من الـ Backend
  const { data, isLoading, isError, error } = useItemStages(
    orderId,
    itemId,
    currentStageFromUrl,
  );

  const apiData = data as ItemStagesResponse | undefined;

  const fetchedStages: OrderItemStage[] = apiData
    ? apiData.stages
      ? apiData.stages
      : apiData.stage
        ? [apiData.stage]
        : []
    : [];

  const firstReturnedStageName = fetchedStages[0]?.stage_name;

  // 3️⃣ حساب التبويب النشط
  const activeStageIndex = (() => {
    if (currentStageFromUrl) {
      const foundIdx = DEFAULT_STAGES.findIndex(
        (s) => s.name === currentStageFromUrl,
      );
      if (foundIdx !== -1) return foundIdx;
    }
    if (firstReturnedStageName) {
      const foundIdx = DEFAULT_STAGES.findIndex(
        (s) => s.name === firstReturnedStageName,
      );
      if (foundIdx !== -1) return foundIdx;
    }
    return 0;
  })();

  const handleStageChange = (stageName: string) => {
    setShowStartForm(false);
    router.push(
      `/orders/${orderId}/items/${itemId}?stage=${encodeURIComponent(stageName)}`,
      { scroll: false },
    );
  };

  const allStages = DEFAULT_STAGES.map((defStage) => {
    const found = fetchedStages.find(
      (s) =>
        s.stage_name === defStage.name ||
        Number(s.stage_order) === defStage.order,
    );

    const sData = found || ({} as Partial<OrderItemStage>);
    const rawExecutionType = sData.execution_type
      ? String(sData.execution_type)
      : null;

    let executionTypeLabel = "غير محدد";
    if (rawExecutionType === "external") executionTypeLabel = "خارجي";
    if (rawExecutionType === "internal") executionTypeLabel = "داخلي";

    const detailsItems: StageDetailItem[] = sData.details?.details?.items || [];

    return {
      id: Number(sData.id) || defStage.id,
      name: defStage.name,
      order: defStage.order,
      status: String(sData.status || (found ? "not_started" : "not_started")),
      workshopName:
        sData.handler_name ||
        sData.workshop_name ||
        sData.workshop ||
        "غير محدد",
      agreedCost: Number(sData.agreed_cost || 0),
      totalPaid: Number(sData.total_paid || 0),
      remainingAmount: Number(sData.remaining_amount || 0),
      stageCost: Number(sData.stage_cost || 0),
      rawMaterialsCost: Number(sData.raw_materials_cost || 0),
      detailsCost: Number(sData.details_cost || 0),
      rawExecutionType,
      executionTypeLabel,
      rawMaterials: sData.raw_materials || [],
      detailsItems,
      hasStarted: Boolean(found && rawExecutionType),
    };
  });

  const currentStage = allStages[activeStageIndex] || allStages[0];
  const currentCategoryId = currentStage?.id || 1;

  // 🔹 دالة معالجة إضافة البند
  const handleAddDetailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDetailItem(
      {
        stageName: currentStage.name,
        item: newDetailItemName,
        cost: Number(newDetailItemCost),
      },
      {
        onSuccess: () => {
          setIsAddDetailOpen(false);
          setNewDetailItemName("");
          setNewDetailItemCost("");
        },
      },
    );
  };

  // 🔹 دالة معالجة حفظ الدفعة الجديدة وإرسالها للباك إند
  const handleSavePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPayment(true);

    try {
      await api.post(`/api/orders/${orderId}/items/${itemId}/payments`, {
        stage_name: currentStage.name,
        amount: Number(paymentAmount),
        notes: paymentNote,
      });

      setIsAddPaymentModalOpen(false);
      setPaymentAmount("");
      setPaymentNote("");
      router.refresh();
    } catch (error) {
      console.error("حدث خطأ:", error);
      alert("حدث خطأ أثناء حفظ الدفعة.");
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  // 🔹 دالة معالجة حذف البند
  const handleDeleteDetail = (itemName: string, itemCost: number) => {
    deleteDetailItem({
      stageName: currentStage.name,
      itemName,
      itemCost,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center dir-rtl">
        <div className="flex items-center gap-3 text-[#2C2420]">
          <Loader2 className="size-7 animate-spin text-[#7C4A26]" />
          <span className="text-base font-bold">جاري تحميل البيانات...</span>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] p-6 dir-rtl space-y-4">
        <Button
          variant="outline"
          onClick={() => router.push(`/orders/${orderId}`)}
          className="rounded-xl gap-2 bg-white text-base font-bold"
        >
          <ArrowRight className="size-5" /> رجوع
        </Button>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600">
          <p className="font-extrabold text-lg">
            حدث خطأ أثناء تحميل بيانات المرحلة
          </p>
          <p className="mt-1 text-base">
            {(error as Error)?.message || "البيانات غير متاحة"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6 space-y-6" dir="rtl">
      {/* Header & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push(`/orders/${orderId}`)}
            className="rounded-xl border-gray-200 bg-white hover:bg-gray-100 shrink-0 size-11"
          >
            <ArrowRight className="size-6 text-[#2C2420]" />
          </Button>

          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
              <span
                className="cursor-pointer hover:underline"
                onClick={() => router.push("/orders")}
              >
                الأوردرات
              </span>
              <span>‹</span>
              <span
                className="cursor-pointer hover:underline"
                onClick={() => router.push(`/orders/${orderId}`)}
              >
                أوردر #{orderId || apiData?.order_id || "—"}
              </span>
              <span>‹</span>
              <span className="font-bold text-[#2C2420]">
                {apiData?.item_name || "عنصر غير مسمى"}
              </span>
            </div>

            <h1 className="mt-1 text-3xl font-black text-[#2C2420]">
              {apiData?.item_name || "عنصر غير مسمى"}
            </h1>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white px-6 rounded-2xl shadow-sm">
        <div className="flex items-center justify-start gap-10 overflow-x-auto no-scrollbar">
          {allStages.map((stg, index) => {
            const isActive = activeStageIndex === index;
            const dot = statusDotMap[stg.status] || statusDotMap["not_started"];

            return (
              <button
                key={stg.id}
                onClick={() => handleStageChange(stg.name)}
                className={`relative flex items-center gap-2.5 py-5 text-base font-extrabold transition-colors whitespace-nowrap ${
                  isActive
                    ? "text-[#2C2420]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <span className={`size-3 rounded-full ${dot.color}`} />
                <span>
                  .{stg.order} {stg.name}
                </span>

                {isActive && (
                  <span className="absolute bottom-0 right-0 left-0 h-1.5 bg-amber-500 rounded-t-md" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* إجمالي التكلفة للمراحل */}
      {currentStage.hasStarted && (
        <div className="bg-[#E6F8F0] border border-[#BCECD7] rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div className="text-left space-y-1">
            <div className="flex items-center justify-end gap-2 text-[#0D5C3A] font-black text-xl md:text-2xl">
              <span>إجمالي تكلفة مرحلة {currentStage.name}</span>
              <Briefcase className="size-6 text-[#0D5C3A]" />
            </div>
            <p className="text-sm md:text-base font-bold text-[#1E7E53]">
              {currentStage.rawExecutionType === "internal"
                ? "تشمل الصنيعي + الخامات + البنود الأخرى"
                : "تكلفة المصنعية / الشغل الخارجي"}
            </p>
          </div>
          <span className="text-3xl font-black text-[#0D5C3A]">
            {currentStage.stageCost.toLocaleString()} ج.م
          </span>
        </div>
      )}

      {/* المحتوى الرئيسي */}
      {!currentStage.hasStarted ? (
        showStartForm ? (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button
                variant="ghost"
                onClick={() => setShowStartForm(false)}
                className="text-gray-500 hover:text-gray-700 font-bold gap-1 rounded-xl"
              >
                <X className="size-4" /> إلغاء وعودة
              </Button>
            </div>
            <StartStageForm
              orderId={orderId}
              itemId={itemId}
              stageName={currentStage.name}
              onSuccess={() => setShowStartForm(false)}
            />
          </div>
        ) : (
          <Card className="border-sidebar-border/40 shadow-sm rounded-2xl bg-white overflow-hidden p-8">
            <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-gray-300 rounded-2xl bg-[#FAF8F5]/50 text-center space-y-4">
              <div className="size-14 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                <AlertCircle className="size-8" />
              </div>
              <h3 className="text-xl font-black text-[#2C2420]">
                المرحلة لم تبدأ بعد
              </h3>
              <p className="text-sm text-gray-500 max-w-md font-bold">
                لم يتم إدخال أي تفاصيل أو بدء العمل في مرحلة (
                {currentStage.name}) حتى الآن.
              </p>
              <Button
                onClick={() => setShowStartForm(true)}
                className="bg-[#7C4A26] hover:bg-[#633a1e] text-white font-black rounded-xl px-6 py-5 shadow-sm gap-2 mt-2"
              >
                <Plus className="size-5" /> بدء مرحلة {currentStage.name}
              </Button>
            </div>
          </Card>
        )
      ) : (
        <Card className="border-sidebar-border/40 shadow-sm rounded-2xl bg-white overflow-hidden">
          <CardHeader className="bg-white pb-4 border-b border-gray-50 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-black text-[#2C2420]">
                مرحلة: {currentStage.name}
              </CardTitle>

              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm font-bold px-3.5 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                  {currentStage.executionTypeLabel}
                </span>
                {currentStage.workshopName && (
                  <span className="text-base font-extrabold text-gray-700">
                    • {currentStage.workshopName}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* الزر المعدل ليفتح الـ Modal بدلاً من تغيير الفورم بالكامل */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditModalOpen(true)}
                className="bg-white hover:bg-gray-50 text-[#7C4A26] border-gray-300 font-bold rounded-xl gap-1.5 text-sm shadow-none h-9 px-3.5"
              >
                <Pencil className="size-4" />
                <span>تعديل البيانات</span>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* بيانات الصنيعي */}
            <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-amber-100/60 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👷</span>
                  <h3 className="text-xl font-black text-[#2C2420]">
                    بيانات الصنيعي
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {/* زر مستقل يفتح مودال إضافة دفعة بالخانات */}
                  <button
                    type="button"
                    onClick={() => setIsAddPaymentModalOpen(true)}
                    className="flex items-center gap-1.5 text-sm font-bold text-white bg-[#7C4A26] hover:bg-[#633a1e] px-4 py-2 rounded-xl shadow-sm transition-all"
                  >
                    <Plus className="size-4" />
                    <span>إضافة دفعة</span>
                  </button>

                  {/* زر مستقل يفتح مودال عرض الدفعات السابقة */}
                  <button
                    type="button"
                    onClick={() => setIsViewPaymentsModalOpen(true)}
                    className="flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-100/80 hover:bg-emerald-200/80 px-4 py-2 rounded-xl border border-emerald-300 shadow-sm transition-all"
                  >
                    <CreditCard className="size-4 text-emerald-800" />
                    <span>الدفعات</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-5 pt-1">
                <div className="space-y-2 md:col-span-1">
                  <label className="text-sm font-bold text-gray-600 block">
                    اسم المصنعية / الصنيعي
                  </label>
                  <div className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-base font-black text-[#2C2420] shadow-sm">
                    {currentStage.workshopName}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 block">
                    الأجرة المتفق عليها
                  </label>
                  <div className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-base font-black text-[#2C2420] shadow-sm">
                    {currentStage.agreedCost.toLocaleString()} ج.م
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 block">
                    المدفوع
                  </label>
                  <div className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-base font-black text-emerald-700 shadow-sm">
                    {currentStage.totalPaid.toLocaleString()} ج.م
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 block">
                    المتبقي
                  </label>
                  <div className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-base font-black text-red-600 shadow-sm">
                    {currentStage.remainingAmount.toLocaleString()} ج.م
                  </div>
                </div>
              </div>
            </div>

            {currentStage.rawExecutionType === "internal" && (
              <>
                {/* المواد المسحوبة */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                  <div className="bg-[#FAF8F5] p-4 flex items-center justify-between border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-[#2C2420]">
                        المواد المسحوبه من المخزن
                      </h3>
                      <Package className="size-5 text-amber-700" />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsDispenseModalOpen(true)}
                      className="bg-white hover:bg-gray-50 text-[#7C4A26] border-gray-300 font-bold rounded-xl gap-1 text-sm shadow-none"
                    >
                      <Plus className="size-4" /> صرف خامة
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                      <thead>
                        <tr className="bg-[#FEF9E7] text-gray-700 text-sm font-black border-b border-amber-100">
                          <th className="p-3.5">الخامة</th>
                          <th className="p-3.5 text-center">الكمية</th>
                          <th className="p-3.5 text-center">سعر الوحدة</th>
                          <th className="p-3.5 text-left pl-6">الإجمالي</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm font-bold text-[#2C2420]">
                        {currentStage.rawMaterials.length > 0 ? (
                          currentStage.rawMaterials.map(
                            (mat: RawMaterialItem, idx: number) => {
                              const materialName =
                                mat.raw_material?.name || "خامة بدون اسم";
                              const unit = mat.raw_material?.unit || "";
                              const quantity = parseFloat(
                                String(mat.quantity || 0),
                              );
                              const rawUnitPrice =
                                mat.raw_material?.unit_price ??
                                mat.unit_price ??
                                0;
                              const unitPrice = parseFloat(
                                String(rawUnitPrice),
                              );
                              const totalCost = parseFloat(
                                String(mat.total_cost || 0),
                              );

                              return (
                                <tr
                                  key={mat.id || idx}
                                  className="hover:bg-gray-50/50 transition-colors"
                                >
                                  <td className="p-3.5 font-extrabold">
                                    {materialName}
                                  </td>
                                  <td className="p-3.5 text-center font-semibold text-gray-600">
                                    {quantity} {unit}
                                  </td>
                                  <td className="p-3.5 text-center font-semibold text-gray-600">
                                    {unitPrice.toLocaleString()} ج.م
                                  </td>
                                  <td className="p-3.5 text-left pl-6 font-black">
                                    {totalCost.toLocaleString()} ج.م
                                  </td>
                                </tr>
                              );
                            },
                          )
                        ) : (
                          <tr>
                            <td
                              colSpan={4}
                              className="text-center py-6 text-gray-400 font-semibold"
                            >
                              لا توجد مواد مسحوبة مسجلة لهذه المرحلة
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-[#FEF9E7] p-4 flex items-center justify-between border-t border-amber-100">
                    <span className="text-sm font-black text-[#2C2420]">
                      إجمالي المسحوب من المخزن
                    </span>
                    <span className="text-base font-black text-amber-900">
                      {currentStage.rawMaterialsCost.toLocaleString()} ج.م
                    </span>
                  </div>
                </div>

                {/* التفاصيل والبنود الفرعية */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm space-y-0">
                  <div className="bg-[#FAF8F5] p-4 flex items-center justify-between border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-[#2C2420]">
                        التفاصيل والبنود الفرعية
                      </h3>
                      <Receipt className="size-5 text-amber-700" />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAddDetailOpen(true)}
                      className="bg-white hover:bg-gray-50 text-[#7C4A26] border-gray-300 font-bold rounded-xl gap-1 text-sm shadow-none"
                    >
                      <Plus className="size-4" /> إضافة بند تكلفة
                    </Button>
                  </div>

                  <div className="p-4 space-y-3 bg-[#FAF8F5]/40">
                    {currentStage.detailsItems.length > 0 ? (
                      currentStage.detailsItems.map(
                        (detail: StageDetailItem, dIdx: number) => {
                          const itemName =
                            detail.item || detail.name || "بند بدون اسم";
                          const itemCost = Number(detail.cost || 0);

                          return (
                            <div
                              key={dIdx}
                              className="flex justify-between items-center text-base py-3 px-4 bg-white rounded-xl border border-gray-100 shadow-xs"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-[#2C2420] font-bold">
                                  {itemName}
                                </span>
                              </div>

                              <div className="flex justify-between gap-2">
                                <span className="font-black text-[#2C2420]">
                                  {itemCost.toLocaleString()} ج.م
                                </span>
                                <button
                                  type="button"
                                  title="حذف البند"
                                  disabled={isDeletingDetail}
                                  onClick={() =>
                                    handleDeleteDetail(itemName, itemCost)
                                  }
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors disabled:opacity-50"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </div>
                            </div>
                          );
                        },
                      )
                    ) : (
                      <div className="py-6 text-center text-sm font-semibold text-muted-foreground">
                        لا توجد بنود فرعية مسجلة لهذه المرحلة
                      </div>
                    )}
                  </div>

                  {currentStage.detailsItems.length > 0 && (
                    <div className="bg-[#FAF8F5] p-4 flex items-center justify-between border-t border-gray-200">
                      <span className="text-sm font-black text-[#2C2420]">
                        إجمالي البنود الفرعية
                      </span>
                      <span className="text-base font-black text-[#2C2420]">
                        {currentStage.detailsCost.toLocaleString()} ج.م
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* المودالات والـ Popups */}

      {/* 1️⃣ مودال صرف المواد */}
      <DispenseMaterialModal
        isOpen={isDispenseModalOpen}
        onClose={() => setIsDispenseModalOpen(false)}
        orderId={orderId}
        itemId={itemId}
        stageName={currentStage?.name || "المرحلة الحالية"}
        categoryId={currentCategoryId}
      />

      {/* 2️⃣ مودال عرض سجل الدفعات السابقة */}
      <PaymentsModal
        isOpen={isViewPaymentsModalOpen}
        onClose={() => setIsViewPaymentsModalOpen(false)}
        orderId={Number(orderId)}
        itemId={Number(itemId)}
        stageName={currentStage.name}
      />

      {/* مكون الـ Modal الخاص بالتعديل يتم وضعه هنا */}
      <EditStageModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        orderId={orderId}
        itemId={itemId}
        stageName={currentStage.name}
        initialData={{
          executionType: currentStage.rawExecutionType,
          workshopName: currentStage.workshopName,
          agreedCost: currentStage.agreedCost,
        }}
        onSuccess={() => {
          setIsEditModalOpen(false);
          router.refresh();
        }}
      />

      {/* 3️⃣ مودال إضافة دفعة جديدة (مع الخانات وزر الحفظ للباك إند) */}
      <Dialog
        open={isAddPaymentModalOpen}
        onOpenChange={setIsAddPaymentModalOpen}
      >
        <DialogContent className="sm:max-w-md dir-rtl rounded-2xl bg-white p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-[#2C2420] text-right">
              إضافة دفعة جديدة لصنيعي ({currentStage.name})
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSavePaymentSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5 text-right">
              <Label className="text-sm font-bold text-[#2C2420]">
                المبلغ المراد دفعه (ج.م) *
              </Label>
              <Input
                type="number"
                step="any"
                required
                placeholder="0.00"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="rounded-xl border-gray-200 h-11 text-center text-sm font-bold"
              />
            </div>

            <div className="space-y-1.5 text-right">
              <Label className="text-sm font-bold text-[#2C2420]">
                ملاحظات أو بيان الدفعة (اختياري)
              </Label>
              <Input
                placeholder="مثال: دفعة مقدمة، تسليم جزء من الحساب..."
                value={paymentNote}
                onChange={(e) => setPaymentNote(e.target.value)}
                className="rounded-xl border-gray-200 h-11 text-right text-sm font-bold"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddPaymentModalOpen(false)}
                className="rounded-xl font-bold border-gray-200"
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingPayment}
                className="rounded-xl font-black bg-[#7C4A26] hover:bg-[#633a1e] text-white px-6"
              >
                {isSubmittingPayment ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "حفظ الدفعة"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 4️⃣ مودال إضافة بند تكلفة جديد */}
      <Dialog open={isAddDetailOpen} onOpenChange={setIsAddDetailOpen}>
        <DialogContent className="sm:max-w-md dir-rtl rounded-2xl bg-white p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-[#2C2420] text-right">
              إضافة بند تكلفة جديد ({currentStage.name})
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddDetailSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5 text-right">
              <Label className="text-sm font-bold text-[#2C2420]">
                اسم البند *
              </Label>
              <Input
                required
                placeholder="مثال: CNC أو نقل أو لزق"
                value={newDetailItemName}
                onChange={(e) => setNewDetailItemName(e.target.value)}
                className="rounded-xl border-gray-200 h-11 text-right text-sm font-bold"
              />
            </div>

            <div className="space-y-1.5 text-right">
              <Label className="text-sm font-bold text-[#2C2420]">
                التكلفة (ج.م) *
              </Label>
              <Input
                type="number"
                step="any"
                required
                placeholder="0.00"
                value={newDetailItemCost}
                onChange={(e) => setNewDetailItemCost(e.target.value)}
                className="rounded-xl border-gray-200 h-11 text-center text-sm font-bold"
              />
            </div>

            {addDetailError && (
              <p className="text-xs font-bold text-red-500">
                {(addDetailError as Error)?.message}
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDetailOpen(false)}
                className="rounded-xl font-bold border-gray-200"
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={isAddingDetail}
                className="rounded-xl font-black bg-[#7C4A26] hover:bg-[#633a1e] text-white px-6"
              >
                {isAddingDetail ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "إضافة البند"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
