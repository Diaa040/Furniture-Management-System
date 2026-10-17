"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const monthsList = [
  { value: 1, label: "يناير" },
  { value: 2, label: "فبراير" },
  { value: 3, label: "مارس" },
  { value: 4, label: "أبريل" },
  { value: 5, label: "مايو" },
  { value: 6, label: "يونيو" },
  { value: 7, label: "يوليو" },
  { value: 8, label: "أغسطس" },
  { value: 9, label: "سبتمبر" },
  { value: 10, label: "أكتوبر" },
  { value: 11, label: "نوفمبر" },
  { value: 12, label: "ديسمبر" },
];

interface DateFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (month?: number, year?: number) => void;
  currentMonth?: number;
  currentYear?: number;
}

export function DateFilterModal({
  isOpen,
  onClose,
  onApply,
  currentMonth,
  currentYear,
}: DateFilterModalProps) {
  // بنحدد القيمة الأولية مباشرة بدون الحاجة لـ useEffect
  const [tempMonth, setTempMonth] = useState<string>(
    currentMonth ? String(currentMonth) : ""
  );
  const [tempYear, setTempYear] = useState<string>(
    currentYear ? String(currentYear) : ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedMonth = tempMonth ? Number(tempMonth) : undefined;
    const parsedYear = tempYear ? Number(tempYear) : undefined;

    onApply(parsedMonth, parsedYear);
    onClose();
  };

  return (
    // بنستخدم key متغير (مثل isOpen أو وقت الفتح) عشان الـ component يعيد بناء نفسه بالقيم الجديدة أول ما يفتح فوراً
    <Dialog open={isOpen} onOpenChange={onClose} key={isOpen ? "open" : "closed"}>
      <DialogContent className="sm:max-w-md dir-rtl rounded-2xl bg-white p-6" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-[#2C2420] text-right">
            اختيار الشهر والسنة للتقرير
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* اختيار الشهر (Dropdown) */}
          <div className="space-y-1.5 text-right">
            <Label className="text-sm font-bold text-[#2C2420]">الشهر</Label>
            <select
              value={tempMonth}
              onChange={(e) => setTempMonth(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white h-11 px-3 text-sm font-semibold text-[#2C2420] focus:outline-none focus:ring-2 focus:ring-[#7C4A26]"
            >
              <option value="">اختر الشهر</option>
              {monthsList.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* إدخال السنة يدوياً */}
          <div className="space-y-1.5 text-right">
            <Label className="text-sm font-bold text-[#2C2420]">السنة</Label>
            <Input
              type="number"
              placeholder="أدخل السنة (مثال: 2026)"
              value={tempYear}
              onChange={(e) => setTempYear(e.target.value)}
              className="rounded-xl border-gray-200 h-11 text-center text-sm font-bold"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl font-bold border-gray-200"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              className="rounded-xl font-black bg-[#7C4A26] hover:bg-[#633a1e] text-white px-6"
            >
              حفظ وعرض
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}