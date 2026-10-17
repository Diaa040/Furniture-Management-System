"use client";

interface StartNewDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export default function StartNewDayModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: StartNewDayModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg text-right" dir="rtl">
        <h3 className="text-lg font-bold text-gray-900 mb-2">تأكيد بدء يوم جديد</h3>
        <p className="text-sm text-gray-500 mb-6">
          هل أنت متأكد من بدء يوم جديد؟ سيتم تصفير وبدء دورة حسابية جديدة للمعاملات.
        </p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-semibold transition"
          >
            إلغاء
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-xs font-semibold transition disabled:opacity-50"
          >
            {isPending ? "جاري التنفيذ..." : "نعم، متأكد"}
          </button>
        </div>
      </div>
    </div>
  );
}