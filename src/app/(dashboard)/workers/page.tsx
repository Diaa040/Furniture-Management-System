"use client";

import { useState } from "react";
import { useWorkers } from "@/hooks/use-workers";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Users, Banknote, Calendar, Plus, Pencil } from "lucide-react";
import WorkerDetailsModal from "@/components/workers/WorkerDetailsModal";
import AddWorkerPaymentModal from "@/components/workers/AddWorkerPaymentModal";
import WorkerPaymentsModal from "@/components/workers/WorkerPaymentsModal"; // استيراد مودال الدفعات
import AddWorkerModal from "@/components/workers/AddWorkerModal";
import EditWorkerModal from "@/components/workers/EditWorkerModal";
import type { IWorker } from "@/types/workers";

export default function WorkersPage() {
  const { workers, isLoading, isError } = useWorkers();

  const [selectedWorker, setSelectedWorker] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isPaymentsModalOpen, setIsPaymentsModalOpen] = useState(false); // حالة فتح مودال الدفعات
  const [isAddWorkerOpen, setIsAddWorkerOpen] = useState(false); // حالة فتح مودال إضافة صنايعي

  // الصنايعي اللي بيتعدل دلوقتي + حالة فتح مودال التعديل
  const [editingWorker, setEditingWorker] = useState<IWorker | null>(null);
  const [isEditWorkerOpen, setIsEditWorkerOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center dir-rtl">
        <Loader2 className="size-8 animate-spin text-[#7C4A26]" />
        <span className="mr-3 text-sm text-muted-foreground">
          جاري تحميل بيانات العمال...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 dir-rtl">
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-sm">
          حدث خطأ أثناء جلب بيانات العمال.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-[#FDFBF7] min-h-screen" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2C2420]">
            العمال والمنفذون
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            قائمة بجميع العمال والأجور والمدفوعات الخاصة بهم
          </p>
        </div>

        <Button
          onClick={() => setIsAddWorkerOpen(true)}
          className="bg-[#7C4A26] hover:bg-[#633a1e] text-white rounded-xl text-sm font-bold gap-1.5"
        >
          <Plus className="size-4" /> إضافة صنايعي
        </Button>
      </div>

      {workers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map((worker) => {
            const initials = worker.name ? worker.name.slice(0, 2) : "ع";

            return (
              <Card
                key={worker.id}
                className="border-sidebar-border/40 shadow-sm rounded-2xl bg-white p-6 flex flex-col justify-between hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full bg-[#EFEBE4] text-[#7C4A26] flex items-center justify-center font-bold text-base shrink-0">
                      {initials}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#2C2420] text-lg">
                        {worker.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Calendar className="size-3.5" /> معرف منذ:{" "}
                        {worker.created_at
                          ? new Date(worker.created_at).toLocaleDateString(
                              "ar-EG",
                            )
                          : "غير متوفر"}
                      </p>
                    </div>
                  </div>

                  {/* زر التعديل الذي سيفتح المودال ويمرر بيانات الصنايعي الحالي */}
                  <button
                    type="button"
                    onClick={() => {
                      setEditingWorker(worker);
                      setIsEditWorkerOpen(true);
                    }}
                    className="w-9 h-9 shrink-0 rounded-full border border-[#7C4A26]/30 text-[#7C4A26] bg-white hover:bg-[#FAF8F5] flex items-center justify-center transition cursor-pointer"
                    aria-label="تعديل بيانات الصنايعي"
                  >
                    <Pencil className="size-4" />
                  </button>
                </div>

                {/* باقي محتوى الكارت (الأجور، المدفوعات، والأزرار) */}
                <div className="space-y-3 mb-6 border-t border-gray-100 pt-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Banknote className="size-4 text-emerald-600" /> أجر
                      اليومية
                    </span>
                    <span className="font-mono font-bold text-emerald-600">
                      {Number(worker.daily_wage).toLocaleString()} ج.م
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-t border-gray-50 pt-3">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Users className="size-4 text-[#7C4A26]" /> إجمالي
                      المدفوعات
                    </span>
                    <span className="font-mono font-bold text-[#7C4A26]">
                      {Number(worker.payment).toLocaleString()} ج.م
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedWorker({ id: worker.id, name: worker.name });
                    setIsDetailsOpen(true);
                  }}
                  className="w-full py-2.5 px-4 border border-[#7C4A26]/30 rounded-xl text-[#7C4A26] bg-white hover:bg-[#FAF8F5] text-sm font-semibold transition text-center cursor-pointer"
                >
                  عناصر الأوردرات المرتبطة
                </button>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-sidebar-border/40">
          <p className="text-sm text-muted-foreground">
            لا توجد سجلات لعاملين حالياً
          </p>
        </div>
      )}

      {/* المودال الأساسي لعرض عناصر الأوردرات والزرين في المنتصف */}
      <WorkerDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        worker={selectedWorker}
        onOpenAddPayment={() => {
          setIsDetailsOpen(false);
          setIsAddPaymentOpen(true);
        }}
        onOpenHistory={() => {
          setIsDetailsOpen(false);
          setIsPaymentsModalOpen(true); // فتح مودال الدفعات عند الضغط على زر "الدفعات"
        }}
      />

      {/* مودال إضافة دفعة */}
      <AddWorkerPaymentModal
        isOpen={isAddPaymentOpen}
        onClose={() => setIsAddPaymentOpen(false)}
        worker={selectedWorker}
      />

      {/* مودال عرض الدفعات */}
      <WorkerPaymentsModal
        isOpen={isPaymentsModalOpen}
        onClose={() => setIsPaymentsModalOpen(false)}
        worker={selectedWorker}
      />

      {/* مودال إضافة صنايعي جديد */}
      <AddWorkerModal
        isOpen={isAddWorkerOpen}
        onClose={() => setIsAddWorkerOpen(false)}
      />

      {/* مودال تعديل بيانات صنايعي */}
      <EditWorkerModal
        isOpen={isEditWorkerOpen}
        onClose={() => setIsEditWorkerOpen(false)}
        worker={editingWorker}
      />
    </div>
  );
}
