"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CraftsmanPaymentTypeToggle, {
  CraftsmanPaymentType,
} from "@/components/orders/CraftsmanPaymentTypeToggle";
import CraftsmanDailyFields from "@/components/orders/CraftsmanDailyFields";
import { Worker } from "@/types/order";
import { useOrderWorkers } from "@/hooks/use-orders";
import { useStartStage } from "@/hooks/use-start-stage";
import { getApiErrorMessage } from "@/lib/error-helpers";

interface StartStageFormProps {
  orderId: number;
  itemId: number;
  stageName: string;
  onSuccess?: (
    dailyInfo?: { workerName: string; dailyRate: number } | null,
  ) => void;
}

export function StartStageForm({
  orderId,
  itemId,
  stageName,
  onSuccess,
}: StartStageFormProps) {
  const [executionType, setExecutionType] = useState<"internal" | "external">(
    "internal",
  );

  const [paymentType, setPaymentType] = useState<CraftsmanPaymentType>(
    "contract",
  );

  const [handlerName, setHandlerName] = useState("");
  const [agreedCost, setAgreedCost] = useState<string>("");

  const [craftsmanId, setCraftsmanId] = useState("");
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);

  const { data: workers = [], isLoading: isLoadingWorkers } = useOrderWorkers(
    paymentType === "daily",
  );

  const startStage = useStartStage(orderId, itemId);

  const handleWorkerSelect = (worker: Worker | undefined) => {
    setSelectedWorker(worker ?? null);
    setCraftsmanId(worker ? String(worker.id) : "");
  };

  const isDailyMode = executionType === "internal" && paymentType === "daily";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const infoPayload =
      isDailyMode && selectedWorker
        ? {
            workerName: selectedWorker.name,
            dailyRate: Number(selectedWorker.daily_wage) || 0,
          }
        : null;

    startStage.mutate(
      {
        stage_name: stageName,
        execution_type: executionType,
        handler_name: isDailyMode
          ? selectedWorker?.name || null
          : handlerName || null,
        agreed_cost: isDailyMode
          ? Number(selectedWorker?.daily_wage) || 0
          : Number(agreedCost) || 0,
        ...(isDailyMode && selectedWorker
          ? { worker_id: selectedWorker.id }
          : {}),
      },
      {
        onSuccess: () => {
          onSuccess?.(infoPayload);
        },
      },
    );
  };

  const errorMessage = startStage.isError
    ? getApiErrorMessage(startStage.error, "حدث خطأ أثناء حفظ المرحلة")
    : "";

  return (
    <div className="w-full bg-card rounded-[28px] border border-border p-6 md:p-8 shadow-xs dir-rtl">
      <h3 className="text-2xl font-black text-foreground text-right mb-6">
        بُدء مرحلة: {stageName}
      </h3>

      {errorMessage && (
        <div className="mb-5 p-3 bg-destructive/10 text-destructive text-sm font-bold rounded-xl border border-destructive/30 text-right">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-extrabold text-foreground block text-right">
            نوع التنفيذ *
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setExecutionType("internal")}
              className={`py-3.5 px-4 rounded-[20px] text-sm font-black transition-all flex items-center justify-center gap-2 border ${
                executionType === "internal"
                  ? "border-primary bg-accent text-primary shadow-xs"
                  : "border-border bg-card text-muted-foreground hover:bg-accent/50"
              }`}
            >
              🏠 داخلي (في الورشة)
            </button>
            <button
              type="button"
              onClick={() => setExecutionType("external")}
              className={`py-3.5 px-4 rounded-[20px] text-sm font-black transition-all flex items-center justify-center gap-2 border ${
                executionType === "external"
                  ? "border-primary bg-accent text-primary shadow-xs"
                  : "border-border bg-card text-muted-foreground hover:bg-accent/50"
              }`}
            >
              🚚 خارجي (مصنعية خارجية)
            </button>
          </div>
        </div>

        <div className="bg-accent/40 p-5 rounded-[24px] border border-primary/20 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h4 className="font-extrabold text-base text-foreground flex items-center gap-2 text-right">
              <span>🧘</span> بيانات المصنعية / الورشة
            </h4>

            {executionType === "internal" && (
              <CraftsmanPaymentTypeToggle
                value={paymentType}
                onChange={setPaymentType}
              />
            )}
          </div>

          {isDailyMode ? (
            <CraftsmanDailyFields
              craftsmanId={craftsmanId}
              onCraftsmanSelect={handleWorkerSelect}
              workers={workers}
              isLoadingWorkers={isLoadingWorkers}
              dailyRate={selectedWorker?.daily_wage ?? null}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5 text-right">
                <Label className="text-xs font-black text-foreground">
                  اسم الورشة / الصنيعي
                </Label>
                <Input
                  value={handlerName}
                  onChange={(e) => setHandlerName(e.target.value)}
                  placeholder="مثال: ورشة أسر"
                  className="rounded-[18px] bg-card border-border h-11 text-right text-sm font-bold"
                />
              </div>
              <div className="space-y-1.5 text-right">
                <Label className="text-xs font-black text-foreground">
                  الأجرة المتفق عليها *
                </Label>
                <Input
                  type="number"
                  required
                  value={agreedCost}
                  onChange={(e) => setAgreedCost(e.target.value)}
                  placeholder="0.00"
                  className="rounded-[18px] bg-card border-border h-11 text-center text-sm font-bold"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-start gap-3 pt-3 border-t border-border">
          <Button
            type="submit"
            disabled={startStage.isPending}
            className="rounded-[18px] font-black bg-primary hover:bg-primary/90 text-primary-foreground px-7 h-12 text-sm shadow-xs"
          >
            {startStage.isPending ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              "حفظ وبدء المرحلة"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}