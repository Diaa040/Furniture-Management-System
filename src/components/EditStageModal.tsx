"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { stageApi } from "@/apis/order.api";
import { EditStageInitialData, EditStagePayload } from "@/types/order";

const editStageSchema = z.object({
  execution_type: z.enum(["internal", "external"], {
    errorMap: () => ({ message: "نوع التنفيذ مطلوب" }),
  }),
  handler_name: z.string().optional(),
  agreed_cost: z.coerce.number().min(0, "التكلفة يجب ألا تقل عن صفر"),
});

type EditStageFormValues = z.infer<typeof editStageSchema>;

interface EditStageModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  itemId: number;
  stageName: string;
  initialData: EditStageInitialData;
  onSuccess: (updatedData: any) => void;
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
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditStageFormValues>({
    resolver: zodResolver(editStageSchema),
    defaultValues: {
      execution_type: "internal",
      handler_name: "",
      agreed_cost: 0,
    },
  });

  // تحديث بيانات الفورم تلقائياً عند فتح المودال أو تغير القيم الأولية
  useEffect(() => {
    if (isOpen && initialData) {
      reset({
        execution_type: initialData.executionType === "external" ? "external" : "internal",
        handler_name: initialData.workshopName === "غير محدد" ? "" : initialData.workshopName,
        agreed_cost: initialData.agreedCost,
      });
      setErrorMessage("");
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = async (data: EditStageFormValues) => {
    try {
      setLoading(true);
      setErrorMessage("");

      const payload: EditStagePayload = {
        stage_name: stageName,
        ...data,
      };

      // استقبال الاستجابة (Response) القادمة من السيرفر
      const response = await stageApi.updateStage(orderId, itemId, payload);
      
      // استخراج البيانات المحدثة (حسب هيكل الاستجابة لديك، سواء كانت في response.data أو response مباشرة)
      const updatedStageData = response?.data || response;

      // تمرير البيانات الجديدة للـ onSuccess في المكون الأب لتحديث الواجهة لحظياً
      onSuccess(updatedStageData);
      onClose();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setErrorMessage(
        err?.response?.data?.message || "حدث خطأ أثناء تحديث بيانات المرحلة."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-[#2C2420]">
            تعديل بيانات مرحلة: {stageName}
          </DialogTitle>
        </DialogHeader>

        {errorMessage && (
          <div className="rounded-xl bg-red-50 p-3 text-xs font-bold text-red-600 border border-red-200">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* نوع التنفيذ */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-700">نوع التنفيذ</Label>
            <select
              {...register("execution_type")}
              className="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#7C4A26]"
            >
              <option value="internal">داخلي (Internal)</option>
              <option value="external">خارجي (External)</option>
            </select>
            {errors.execution_type && (
              <span className="text-[10px] text-red-500 font-bold">
                {errors.execution_type.message}
              </span>
            )}
          </div>

          {/* اسم المسؤول / الورشة */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-700">
              اسم المسؤول / الجهة
            </Label>
            <Input
              type="text"
              {...register("handler_name")}
              placeholder="أدخل اسم الورشة أو المسؤول"
              className="rounded-xl border-gray-300 h-10 text-sm font-medium"
            />
          </div>

          {/* التكلفة المتفق عليها */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-700">
              التكلفة المتفق عليها
            </Label>
            <Input
              type="number"
              step="any"
              {...register("agreed_cost")}
              className="rounded-xl border-gray-300 h-10 text-sm font-medium"
            />
            {errors.agreed_cost && (
              <span className="text-[10px] text-red-500 font-bold">
                {errors.agreed_cost.message}
              </span>
            )}
          </div>

          {/* الأزرار */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl font-bold text-gray-600"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#7C4A26] hover:bg-[#633a1e] text-white font-bold rounded-xl gap-2"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              حفظ التعديلات
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}