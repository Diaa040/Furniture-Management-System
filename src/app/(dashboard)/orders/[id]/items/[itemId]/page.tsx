"use client";

import { use, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, AlertCircle, Loader2, Pencil, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { DispenseMaterialModal } from "@/components/orders/DispenseMaterialModal";
import PaymentsModal from "@/components/orders/PaymentsModal";
import { EditStageModal } from "@/components/EditStageModal";
import { StartStageForm } from "@/components/orders/StartStageModal";
import { StageTabs } from "@/components/orders/StageTabs";
import { StageSummaryBanner } from "@/components/orders/StageSummaryBanner";
import { WorkshopInfoCard } from "@/components/orders/WorkshopInfoCard";
import { RawMaterialsTable } from "@/components/orders/RawMaterialsTable";
import { StageDetailsList } from "@/components/orders/StageDetailsList";
import { AddPaymentDialog } from "@/components/orders/AddPaymentDialog";
import { AddDetailDialog } from "@/components/orders/AddDetailDialog";

import { useItemStages } from "@/hooks/use-orders";
import { useAddDetailForm } from "@/hooks/use-add-detail-form";
import { usePaymentForm } from "@/hooks/use-payment-form";
import { usePersistedDailyInfo } from "@/hooks/use-persisted-daily-info";

import {
  buildAllStages,
  getActiveStageIndex,
  getCurrentCategoryId,
} from "@/lib/stage-helpers";
import type { ItemStagesResponse, OrderItemStage } from "@/types/order";

export default function ItemDetailsPage({
  params,
}: {
  params: Promise<{ id: string; itemId: string }>;
}) {
  const resolvedParams = use(params);
  const orderId = Number(resolvedParams.id);
  const itemId = Number(resolvedParams.itemId);

  const router = useRouter();
  const searchParams = useSearchParams();

  // حالات محلية بسيطة خاصة بالصفحة نفسها فقط
  const [showStartForm, setShowStartForm] = useState(false);
  const [isDispenseModalOpen, setIsDispenseModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const currentStageFromUrl = searchParams.get("stage")
    ? decodeURIComponent(searchParams.get("stage")!)
    : undefined;

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

  const activeStageIndex = getActiveStageIndex(
    currentStageFromUrl,
    fetchedStages[0]?.stage_name,
  );
  const allStages = buildAllStages(fetchedStages);
  const currentStage = allStages[activeStageIndex] || allStages[0];
  const currentCategoryId = getCurrentCategoryId(currentStage);

  // فورمات البنود والدفعات بقت جوّه هوكس منفصلة
  const detailForm = useAddDetailForm(orderId, itemId, currentStage.name);
  const paymentForm = usePaymentForm(orderId, itemId, currentStage.name);

  // حل مؤقت لحد ما الباك إند يرجّع بيانات اليومية مع المرحلة: بنخزّنها في
  // localStorage عشان الشكل ميرجعش "مصنعية بالعقد" بعد الـ refresh لو أصلاً
  // اتحفظت كـ "يومية". القراءة/الكتابة بتتم على مستوى كل مرحلة لوحدها.
  const [dailyInfo, setDailyInfo] = usePersistedDailyInfo(
    orderId,
    itemId,
    currentStage.name,
  );

  const handleStageChange = (stageName: string) => {
    setShowStartForm(false);
    router.push(
      `/orders/${orderId}/items/${itemId}?stage=${encodeURIComponent(stageName)}`,
      { scroll: false },
    );
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

      <StageTabs
        stages={allStages}
        activeIndex={activeStageIndex}
        onChange={handleStageChange}
      />

      <StageSummaryBanner stage={currentStage} />

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
              onSuccess={(info) => {
                setDailyInfo(info ?? null);
                setShowStartForm(false);
              }}
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

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              className="bg-white hover:bg-gray-50 text-[#7C4A26] border-gray-300 font-bold rounded-xl gap-1.5 text-sm shadow-none h-9 px-3.5"
            >
              <Pencil className="size-4" />
              <span>تعديل البيانات</span>
            </Button>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <WorkshopInfoCard
              orderId={orderId}
              itemId={itemId}
              stage={currentStage}
              dailyInfo={dailyInfo}
              onAddPayment={() => paymentForm.setIsAddOpen(true)}
              onViewPayments={() => paymentForm.setIsViewOpen(true)}
            />

            {currentStage.rawExecutionType === "internal" && (
              <>
                <RawMaterialsTable
                  stage={currentStage}
                  onDispense={() => setIsDispenseModalOpen(true)}
                />
                <StageDetailsList
                  stage={currentStage}
                  isDeleting={detailForm.isDeletingDetail}
                  onAdd={() => detailForm.setIsOpen(true)}
                  onDelete={detailForm.remove}
                />
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* المودالات */}
      <DispenseMaterialModal
        isOpen={isDispenseModalOpen}
        onClose={() => setIsDispenseModalOpen(false)}
        orderId={orderId}
        itemId={itemId}
        stageName={currentStage?.name || "المرحلة الحالية"}
        categoryId={currentCategoryId}
      />

      <PaymentsModal
        isOpen={paymentForm.isViewOpen}
        onClose={() => paymentForm.setIsViewOpen(false)}
        orderId={Number(orderId)}
        itemId={Number(itemId)}
        stageName={currentStage.name}
      />

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

      <AddPaymentDialog
        isOpen={paymentForm.isAddOpen}
        onOpenChange={paymentForm.setIsAddOpen}
        stageName={currentStage.name}
        amount={paymentForm.amount}
        onAmountChange={paymentForm.setAmount}
        note={paymentForm.note}
        onNoteChange={paymentForm.setNote}
        isSubmitting={paymentForm.isSubmitting}
        onSubmit={paymentForm.submit}
        onCancel={() => paymentForm.setIsAddOpen(false)}
      />

      <AddDetailDialog
        isOpen={detailForm.isOpen}
        onOpenChange={detailForm.setIsOpen}
        stageName={currentStage.name}
        name={detailForm.name}
        onNameChange={detailForm.setName}
        cost={detailForm.cost}
        onCostChange={detailForm.setCost}
        isSubmitting={detailForm.isAddingDetail}
        error={detailForm.addDetailError as Error | null}
        onSubmit={detailForm.submit}
        onCancel={() => detailForm.setIsOpen(false)}
      />
    </div>
  );
}