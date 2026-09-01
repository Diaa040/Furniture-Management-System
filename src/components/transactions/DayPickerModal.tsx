"use client";

import { useState } from "react";

interface DayPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (date: { day: number; month: number; year: number }) => void;
  initialDate: { day: number; month: number; year: number };
}

export function DayPickerModal({
  isOpen,
  onClose,
  onSave,
  initialDate,
}: DayPickerModalProps) {
  const [day, setDay] = useState(initialDate.day);
  const [month, setMonth] = useState(initialDate.month);
  const [year, setYear] = useState(initialDate.year);

  if (!isOpen) return null;

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border p-6 rounded-2xl w-full max-w-sm space-y-4 shadow-xl" dir="rtl">
        <h2 className="text-lg font-bold text-foreground">اختيار تاريخ المعاملات</h2>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1">اليوم</label>
            <select
              value={day}
              onChange={(e) => setDay(Number(e.target.value))}
              className="w-full bg-background border border-border rounded-xl p-2.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {days.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1">الشهر</label>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="w-full bg-background border border-border rounded-xl p-2.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {months.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1">السنة</label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full bg-background border border-border rounded-xl p-2.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => onSave({ day, month, year })}
            className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors"
          >
            حفظ
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-secondary text-secondary-foreground py-2.5 rounded-xl font-bold text-sm hover:bg-secondary/80 transition-colors"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}