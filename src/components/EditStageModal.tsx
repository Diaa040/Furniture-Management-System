"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EditStageForm } from "@/components/EditStageForm";
import type { EditStageInitialData } from "@/types/order";

interface EditStageModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  itemId: number;
  stageName: string;
  initialData: EditStageInitialData;
  onSuccess: () => void;
}

export function EditStageModal({
  isOpen,
  onClose,
  orderId,
  itemId,
  stageName,
  initialData,
  onSuccess,
}: EditStageModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md bg-card rounded-2xl" dir="rtl">
        {/*
          الفورم بيتعمله mount بس لما المودال يكون مفتوح (isOpen).
          كده useForm جوه EditStageForm بياخد الـ defaultValues بتاعته
          من initialData في لحظة الفتح مباشرة، من غير أي useEffect بيعمل
          reset يدوي — ده اللي كان بيسبب تحذير
          "Calling setState synchronously within an effect".
        */}
        {isOpen && (
          <EditStageForm
            orderId={orderId}
            itemId={itemId}
            stageName={stageName}
            initialData={initialData}
            onClose={onClose}
            onSuccess={onSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}