"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { createWorker } from "@/apis/workers.api";

interface AddWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddWorkerModal({ isOpen, onClose }: AddWorkerModalProps) {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [dailyWage, setDailyWage] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: createWorker,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workers"] });
      resetAndClose();
    },
  });

  const resetAndClose = () => {
    setName("");
    setDailyWage("");
    setFormError(null);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError("اسم الصنايعي مطلوب");
      return;
    }

    const numericWage = Number(dailyWage);
    if (isNaN(numericWage) || numericWage < 0) {
      setFormError("الرجاء إدخال يومية صحيحة (أكبر من أو تساوي صفر)");
      return;
    }

    mutation.mutate({ name: name.trim(), daily_wage: numericWage });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetAndClose()}>
      <DialogContent className="sm:max-w-md dir-rtl rounded-2xl bg-white p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-[#2C2420] text-right">
            إضافة صنايعي جديد
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5 text-right">
            <Label className="text-sm font-bold text-[#2C2420]">اسم الصنايعي *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: محمد محمود"
              className="rounded-xl border-gray-200 h-11 text-right text-sm font-bold"
            />
          </div>

          <div className="space-y-1.5 text-right">
            <Label className="text-sm font-bold text-[#2C2420]">أجر اليومية *</Label>
            <Input
              type="number"
              step="any"
              min="0"
              value={dailyWage}
              onChange={(e) => setDailyWage(e.target.value)}
              placeholder="0.00"
              className="rounded-xl border-gray-200 h-11 text-center text-sm font-bold"
            />
          </div>

          {(formError || mutation.isError) && (
            <p className="text-sm text-red-600 font-semibold text-right">
              {formError ||
                (mutation.error as any)?.response?.data?.message ||
                "حدث خطأ أثناء إضافة الصنايعي"}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={resetAndClose}
              className="rounded-xl font-bold border-gray-200"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="rounded-xl font-black bg-[#7C4A26] hover:bg-[#633a1e] text-white px-6"
            >
              {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : "حفظ"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}