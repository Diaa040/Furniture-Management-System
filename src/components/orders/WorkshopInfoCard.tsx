import { CreditCard, Plus } from "lucide-react";
import type { StageViewModel } from "@/lib/stage-helpers";

interface WorkshopInfoCardProps {
  stage: StageViewModel;
  onAddPayment: () => void;
  onViewPayments: () => void;
}

export function WorkshopInfoCard({
  stage,
  onAddPayment,
  onViewPayments,
}: WorkshopInfoCardProps) {
  return (
    <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-amber-100/60 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👷</span>
          <h3 className="text-xl font-black text-[#2C2420]">
            بيانات الصنيعي
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onAddPayment}
            className="flex items-center gap-1.5 text-sm font-bold text-white bg-[#7C4A26] hover:bg-[#633a1e] px-4 py-2 rounded-xl shadow-sm transition-all"
          >
            <Plus className="size-4" />
            <span>إضافة دفعة</span>
          </button>

          <button
            type="button"
            onClick={onViewPayments}
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
            {stage.workshopName}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-600 block">
            الأجرة المتفق عليها
          </label>
          <div className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-base font-black text-[#2C2420] shadow-sm">
            {stage.agreedCost.toLocaleString()} ج.م
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-600 block">
            المدفوع
          </label>
          <div className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-base font-black text-emerald-700 shadow-sm">
            {stage.totalPaid.toLocaleString()} ج.م
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-600 block">
            المتبقي
          </label>
          <div className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-base font-black text-red-600 shadow-sm">
            {stage.remainingAmount.toLocaleString()} ج.م
          </div>
        </div>
      </div>
    </div>
  );
}