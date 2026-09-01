"use client";

import { useState } from "react";
import { useDayTransactionsDetails } from "@/hooks/use-day-details";

import { DayPickerButton } from "@/components/transactions/DayPickerButton";
import { DayPickerModal } from "@/components/transactions/DayPickerModal";
import { DayTotalsSummary } from "@/components/transactions/DayTotalsSummary";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { EditTransactionModal } from "@/components/transactions/EditTransactionModal"; // استيراد مودال التعديل المنفصل
import type { DayTransactionItem } from "@/types/transactions";

export default function DayTransactionsDetailsPage() {
  // حالة لمعرفة هل المستخدم اختار تاريخاً من الزرار/المودال أم لا (تبدأ false لتكون الصفحة فاضية)
  const [hasSelectedDate, setHasSelectedDate] = useState(false);

  // تخزين التاريخ المختار (قيم افتراضية للمودال كبداية)
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState({
    day: today.getDate(),
    month: today.getMonth() + 1,
    year: today.getFullYear(),
  });

  // حالات خاصة بمودال اختيار التاريخ
  const [isPickerModalOpen, setIsPickerModalOpen] = useState(false);

  // حالات خاصة بمودال التعديل
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTransactionToEdit, setSelectedTransactionToEdit] = useState<DayTransactionItem | null>(null);

  // الـ Hook لن يعمل نهائياً ولن يرسل أي طلب للـ API إلا إذا أصبحت hasSelectedDate تساوي true
  const { data, isLoading, error } = useDayTransactionsDetails(
    selectedDate.day,
    selectedDate.month,
    selectedDate.year,
    {
      enabled: hasSelectedDate, 
    }
  );

  // عند الضغط على حفظ في مودال اختيار التاريخ
  const handleSaveDate = (newDate: { day: number; month: number; year: number }) => {
    setSelectedDate(newDate);
    setHasSelectedDate(true); // السماح للـ API بالعمل وجلب البيانات
    setIsPickerModalOpen(false);
  };

  // عند الضغط على زر التعديل داخل الجدول
  const handleOpenEditModal = (tx: DayTransactionItem) => {
    setSelectedTransactionToEdit(tx);
    setIsEditModalOpen(true);
  };

  const currentFilter = data?.filters_applied;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto" dir="rtl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">تفاصيل المعاملات اليومية</h1>
          <p className="text-sm text-muted-foreground font-semibold mt-1">
            {hasSelectedDate && currentFilter 
              ? `التاريخ المعروض: ${currentFilter.day}/${currentFilter.month}/${currentFilter.year}`
              : "الرجاء اختيار تاريخ لعرض المعاملات"}
          </p>
        </div>

        {/* زرار فتح مودال اختيار التاريخ */}
        <DayPickerButton onClick={() => setIsPickerModalOpen(true)} />
      </div>

      {/* مودال اختيار التاريخ */}
      <DayPickerModal
        isOpen={isPickerModalOpen}
        onClose={() => setIsPickerModalOpen(false)}
        onSave={handleSaveDate}
        initialDate={selectedDate}
      />

      {/* مودال تعديل المعاملة (المستورد من الخارج) */}
      <EditTransactionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTransactionToEdit(null);
        }}
        transaction={selectedTransactionToEdit}
      />

      {/* الحالة الأولى: المستخدم لم يختار تاريخ بعد (الصفحة فاضية) */}
      {!hasSelectedDate && (
        <div className="py-24 text-center border-2 border-dashed rounded-2xl border-muted text-muted-foreground">
          <p className="text-lg font-bold">لم يتم اختيار تاريخ بعد</p>
          <p className="text-sm mt-1">اضغط على زر اختيار التاريخ بالأعلى لعرض المعاملات.</p>
        </div>
      )}

      {/* الحالة الثانية: جاري تحميل البيانات بعد اختيار التاريخ */}
      {hasSelectedDate && isLoading && (
        <div className="py-20 text-center text-muted-foreground font-bold">
          جاري تحميل بيانات اليوم...
        </div>
      )}

      {/* الحالة الثالثة: خطأ في الاتصال */}
      {hasSelectedDate && error && (
        <div className="py-20 text-center text-destructive font-bold">
          حدث خطأ أثناء جلب البيانات، تأكد من الاتصال.
        </div>
      )}

      {/* الحالة الرابعة: تم جلب البيانات بنجاح وعرض الجدول والملخصات */}
      {hasSelectedDate && data && !isLoading && !error && (
        <>
          <DayTotalsSummary totals={data.totals} />
          <TransactionsTable
            transactions={data.data}
            onEdit={(tx: DayTransactionItem) => handleOpenEditModal(tx)}
          />
        </>
      )}
    </div>
  );
}