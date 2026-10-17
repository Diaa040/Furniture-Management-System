"use client";

import { useState } from "react";
import { CheckCircle2, CreditCard, Loader2, Plus, Save } from "lucide-react";
import type { StageViewModel } from "@/lib/stage-helpers";
import { useStopWorker } from "@/hooks/use-stop-worker";
import { usePersistedSavedDays } from "@/hooks/use-persisted-saved-days";
import { getApiErrorMessage } from "@/lib/error-helpers";

interface DailyInfo {
  workerName: string;
  dailyRate: number;
}

interface WorkshopInfoCardProps {
  orderId: number;
  itemId: number;
  stage: StageViewModel;
  dailyInfo?: DailyInfo | null;
  onAddPayment: () => void;
  onViewPayments: () => void;
}

export function WorkshopInfoCard({
  orderId,
  itemId,
  stage,
  dailyInfo,
  onAddPayment,
  onViewPayments,
}: WorkshopInfoCardProps) {
  // عدد الأيام: حالة محلية بس (لحد ما يتحفظ فعليًا)
  const [daysWorked, setDaysWorked] = useState("");
  const days = Number(daysWorked) || 0;

  // نتيجة الحفظ (عدد الأيام + التكلفة) بعد ما تتبعت لـ /worker/stop، متخزنة
  // عشان تفضل ظاهرة وثابتة حتى بعد الـ refresh، وتاخد مكان الإنبوت والزرار.
  const [savedDays, setSavedDays] = usePersistedSavedDays(
    orderId,
    itemId,
    stage.name,
  );

  // لو الـ dailyInfo مش جاي من البروبس، ممكن نقرأه احتياطيًا من الـ stage لو الخادم بيرجعه أو نعتمد على الـ props
  const effectiveDailyInfo = dailyInfo;

  const computedCost = effectiveDailyInfo ? effectiveDailyInfo.dailyRate * days : 0;

  const stopWorker = useStopWorker(orderId, itemId);

  const handleSaveDays = () => {
    if (days <= 0 || computedCost <= 0) return;

    stopWorker.mutate(
      {
        item_id: itemId,
        quantity: computedCost, // التكلفة الإجمالية = اليومية × عدد الأيام
        days,
      },
      {
        onSuccess: (data) => {
          // بنعتمد على رد الباك إند لو موجود، ولو ناقص حاجة نرجع للقيم المحسوبة عندنا
          setSavedDays({
            days: data?.days ?? days,
            agreedCost: data?.agreed_cost ?? computedCost,
            status: data?.status,
          });
        },
      },
    );
  };

  const stopWorkerError = stopWorker.isError
    ? getApiErrorMessage(stopWorker.error, "حدث خطأ أثناء حفظ عدد الأيام")
    : "";

  const isSaved = Boolean(savedDays);

  return (
    <div className="bg-accent/40 p-6 rounded-2xl border border-primary/20 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👷</span>
          <h3 className="text-xl font-black text-foreground">بيانات الصنيعي</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onAddPayment}
            className="flex items-center gap-1.5 text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 px-4 py-2 rounded-xl shadow-sm transition-all"
          >
            <Plus className="size-4" />
            <span>إضافة دفعة</span>
          </button>

          <button
            type="button"
            onClick={onViewPayments}
            className="flex items-center gap-2 text-sm font-bold text-chart-2 hover:opacity-80 bg-chart-2/10 hover:bg-chart-2/20 px-4 py-2 rounded-xl border border-chart-2/30 shadow-sm transition-all"
          >
            <CreditCard className="size-4" />
            <span>الدفعات</span>
          </button>
        </div>
      </div>

      {effectiveDailyInfo ? (
        // وضع اليومية: الاسم / اليومية / عدد الأيام / التكلفة
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 pt-1">
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground block">
                اسم الصنايعي
              </label>
              <div className="w-full bg-card border border-border rounded-2xl px-5 py-3.5 text-base font-black text-foreground shadow-sm">
                {effectiveDailyInfo.workerName}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground block">
                اليومية
              </label>
              <div className="w-full bg-card border border-border rounded-2xl px-5 py-3.5 text-base font-black text-foreground shadow-sm">
                {effectiveDailyInfo.dailyRate.toLocaleString()} ج.م
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground block">
                عدد الأيام
              </label>
              {isSaved ? (
                <div className="w-full bg-card border border-border rounded-2xl px-5 py-3.5 text-base font-black text-foreground shadow-sm text-center">
                  {savedDays!.days}
                </div>
              ) : (
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={daysWorked}
                  onChange={(e) => setDaysWorked(e.target.value)}
                  placeholder="0"
                  className="w-full bg-card border border-border rounded-2xl px-5 py-3.5 text-base font-black text-foreground shadow-sm text-center focus:outline-none focus:ring-2 focus:ring-ring"
                />
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground block">
                التكلفة
              </label>
              <div className="w-full bg-card border border-border rounded-2xl px-5 py-3.5 text-base font-black text-chart-2 shadow-sm">
                {(isSaved ? savedDays!.agreedCost : computedCost).toLocaleString()} ج.م
              </div>
            </div>
          </div>

          {!isSaved && stopWorkerError && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm font-bold rounded-xl border border-destructive/30">
              {stopWorkerError}
            </div>
          )}

          {isSaved ? (
            <div className="flex items-center gap-1.5 text-sm font-bold text-chart-2">
              <CheckCircle2 className="size-4" />
              <span>
                تم حفظ عدد الأيام والتكلفة
                {savedDays?.status ? ` — الحالة: ${savedDays.status}` : ""}
              </span>
            </div>
          ) : (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveDays}
                disabled={days <= 0 || stopWorker.isPending}
                className="flex items-center gap-1.5 text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2.5 rounded-xl shadow-sm transition-all"
              >
                {stopWorker.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                <span>حفظ عدد الأيام</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        // الوضع العادي (مصنعية بالعقد)
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 pt-1">
          <div className="space-y-2 md:col-span-1">
            <label className="text-sm font-bold text-muted-foreground block">
              اسم المصنعية / الصنيعي
            </label>
            <div className="w-full bg-card border border-border rounded-2xl px-5 py-3.5 text-base font-black text-foreground shadow-sm">
              {stage.workshopName}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground block">
              الأجرة المتفق عليها
            </label>
            <div className="w-full bg-card border border-border rounded-2xl px-5 py-3.5 text-base font-black text-foreground shadow-sm">
              {stage.agreedCost.toLocaleString()} ج.م
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground block">
              المدفوع
            </label>
            <div className="w-full bg-card border border-border rounded-2xl px-5 py-3.5 text-base font-black text-chart-2 shadow-sm">
              {stage.totalPaid.toLocaleString()} ج.م
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground block">
              المتبقي
            </label>
            <div className="w-full bg-card border border-border rounded-2xl px-5 py-3.5 text-base font-black text-destructive shadow-sm">
              {stage.remainingAmount.toLocaleString()} ج.م
            </div>
          </div>
        </div>
      )}
    </div>
  );
}