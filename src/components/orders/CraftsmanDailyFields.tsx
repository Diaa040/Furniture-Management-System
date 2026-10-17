"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Worker } from "@/types/order";

interface CraftsmanDailyFieldsProps {
  craftsmanId: string;
  onCraftsmanSelect: (worker: Worker | undefined) => void;
  workers: Worker[];
  isLoadingWorkers: boolean;
  dailyRate: string | null;
}

export default function CraftsmanDailyFields({
  craftsmanId,
  onCraftsmanSelect,
  workers,
  isLoadingWorkers,
  dailyRate,
}: CraftsmanDailyFieldsProps) {
  // ✅ بقت بتقبل string | null عشان تطابق توقيع onValueChange بتاع Select
  const handleChange = (id: string | null) => {
    if (id === null) {
      onCraftsmanSelect(undefined);
      return;
    }
    const worker = workers.find((w) => String(w.id) === id);
    onCraftsmanSelect(worker);
  };

  // بنجيب اسم الصنايعي المختار بنفسنا ونديه لـ SelectValue كـ children، عشان
  // ماتسيبش الاعتماد على التقاط Radix التلقائي للنص (اللي كان بيرجع بيعرض
  // الـ id بدل الاسم في بعض الحالات).
  const selectedWorker = workers.find((w) => String(w.id) === craftsmanId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="space-y-1.5 text-right">
        <Label className="text-xs font-black text-[#2C2420]">اسم الصنايعي</Label>
        <Select value={craftsmanId} onValueChange={handleChange}>
          <SelectTrigger className="w-full rounded-[18px] bg-white border-gray-200 h-11 text-right text-sm font-bold [&>span]:line-clamp-1 [&>span]:text-right">
            <SelectValue
              placeholder={isLoadingWorkers ? "جاري التحميل..." : "اختر الصنايعي"}
            >
              {selectedWorker?.name}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="min-w-(--radix-select-trigger-width)">
            {isLoadingWorkers ? (
              <div className="flex items-center justify-center py-3">
                <Loader2 className="size-4 animate-spin text-gray-400" />
              </div>
            ) : (
              workers.map((worker) => (
                <SelectItem
                  key={worker.id}
                  value={String(worker.id)}
                  className="text-right text-sm font-bold py-2.5"
                >
                  {worker.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5 text-right">
        <Label className="text-xs font-black text-[#2C2420]">اليومية</Label>
        <Input
          value={dailyRate ?? ""}
          readOnly
          placeholder="— هتظهر تلقائي بعد اختيار الصنايعي"
          className="rounded-[18px] bg-gray-50 border-gray-200 h-11 text-center text-xs font-bold text-gray-600"
        />
      </div>
    </div>
  );
}