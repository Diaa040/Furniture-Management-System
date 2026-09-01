"use client";

import { useState } from "react";
import { CreditCard, Plus } from "lucide-react";
import type { StageViewModel } from "@/lib/stage-helpers";

interface DailyInfo {
  workerName: string;
  dailyRate: number;
}

interface WorkshopInfoCardProps {
  stage: StageViewModel;
  dailyInfo?: DailyInfo | null;
  onAddPayment: () => void;
  onViewPayments: () => void;
}

export function WorkshopInfoCard({
  stage,
  dailyInfo,
  onAddPayment,
  onViewPayments,
}: WorkshopInfoCardProps) {
  // عدد الأيام: حالة محلية بس (مش متحفوظة في الباك إند دلوقتي)
  const [daysWorked, setDaysWorked] = useState("");
  const days = Number(daysWorked) || 0;
  const computedCost = dailyInfo ? dailyInfo.dailyRate * days : 0;

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

      {dailyInfo ? (
        // وضع اليومية: الاسم / اليومية / عدد الأيام (إنبوت) / التكلفة (محسوبة)
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 pt-1">
          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground block">
              اسم الصنايعي
            </label>
            <div className="w-full bg-card border border-border rounded-2xl px-5 py-3.5 text-base font-black text-foreground shadow-sm">
              {dailyInfo.workerName}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground block">
              اليومية
            </label>
            <div className="w-full bg-card border border-border rounded-2xl px-5 py-3.5 text-base font-black text-foreground shadow-sm">
              {dailyInfo.dailyRate.toLocaleString()} ج.م
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground block">
              عدد الأيام
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={daysWorked}
              onChange={(e) => setDaysWorked(e.target.value)}
              placeholder="0"
              className="w-full bg-card border border-border rounded-2xl px-5 py-3.5 text-base font-black text-foreground shadow-sm text-center focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground block">
              التكلفة
            </label>
            <div className="w-full bg-card border border-border rounded-2xl px-5 py-3.5 text-base font-black text-chart-2 shadow-sm">
              {computedCost.toLocaleString()} ج.م
            </div>
          </div>
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