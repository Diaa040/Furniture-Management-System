"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateStage } from "@/hooks/use-update-stage";
import type { EditStageInitialData, EditStagePayload } from "@/types/order";

const editStageSchema = z.object({
  execution_type: z.enum(["internal", "external"], {
    errorMap: () => ({ message: "نوع التنفيذ مطلوب" }),
  }),
  handler_name: z.string().optional(),
  agreed_cost: z.coerce.number().min(0, "التكلفة يجب ألا تقل عن صفر"),
});

type EditStageFormValues = z.infer<typeof editStageSchema>;

interface EditStageFormProps {
  orderId: number;
  itemId: number;
  stageName: string;
  initialData: EditStageInitialData;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditStageForm({
  orderId,
  itemId,
  stageName,
  initialData,
  onClose,
  onSuccess,
}: EditStageFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditStageFormValues>({
    resolver: zodResolver(editStageSchema),
    // القيم الابتدائية بتتاخد من initialData مباشرة عند أول تركيب (mount) للفورم.
    // الفورم بيتعمله mount من جديد في كل مرة يفتح فيها المودال (شوف EditStageModal.tsx)،
    // فمحتاجينش useEffect نعمل بيه reset يدوي خالص.
    defaultValues: {
      execution_type:
        initialData.executionType === "external" ? "external" : "internal",
      handler_name:
        initialData.workshopName === "غير محدد" ? "" : initialData.workshopName,
      agreed_cost: initialData.agreedCost,
    },
  });

  const updateStage = useUpdateStage(orderId, itemId);

  const onSubmit = (data: EditStageFormValues) => {
    const payload: EditStagePayload = {
      stage_name: stageName,
      ...data,
    };

    updateStage.mutate(payload, {
      onSuccess: () => {
        onSuccess();
        onClose();
      },
    });
  };

  const errorMessage = updateStage.isError
    ? updateStage.error instanceof Error
      ? updateStage.error.message
      : "حدث خطأ أثناء تحديث بيانات المرحلة."
    : "";

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl font-black text-foreground">
          تعديل بيانات مرحلة: {stageName}
        </DialogTitle>
      </DialogHeader>

      {errorMessage && (
        <div className="rounded-xl bg-destructive/10 p-3 text-xs font-bold text-destructive border border-destructive/30">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
        {/* نوع التنفيذ */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-muted-foreground">
            نوع التنفيذ
          </Label>
          <select
            {...register("execution_type")}
            className="w-full rounded-xl border border-border bg-card p-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="internal">داخلي (Internal)</option>
            <option value="external">خارجي (External)</option>
          </select>
          {errors.execution_type && (
            <span className="text-[10px] text-destructive font-bold">
              {errors.execution_type.message}
            </span>
          )}
        </div>

        {/* اسم المسؤول / الورشة */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-muted-foreground">
            اسم المسؤول / الجهة
          </Label>
          <Input
            type="text"
            {...register("handler_name")}
            placeholder="أدخل اسم الورشة أو المسؤول"
            className="rounded-xl border-border h-10 text-sm font-medium"
          />
        </div>

        {/* التكلفة المتفق عليها */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-muted-foreground">
            التكلفة المتفق عليها
          </Label>
          <Input
            type="number"
            step="any"
            {...register("agreed_cost")}
            className="rounded-xl border-border h-10 text-sm font-medium"
          />
          {errors.agreed_cost && (
            <span className="text-[10px] text-destructive font-bold">
              {errors.agreed_cost.message}
            </span>
          )}
        </div>

        {/* الأزرار */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl font-bold text-muted-foreground"
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            disabled={updateStage.isPending}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl gap-2"
          >
            {updateStage.isPending && (
              <Loader2 className="size-4 animate-spin" />
            )}
            حفظ التعديلات
          </Button>
        </div>
      </form>
    </>
  );
}