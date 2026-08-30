import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export function usePaymentForm(
  orderId: number,
  itemId: number,
  stageName: string,
) {
  const router = useRouter();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post(`/api/orders/${orderId}/items/${itemId}/payments`, {
        stage_name: stageName,
        amount: Number(amount),
        notes: note,
      });

      setIsAddOpen(false);
      setAmount("");
      setNote("");
      router.refresh();
    } catch (error) {
      console.error("حدث خطأ:", error);
      alert("حدث خطأ أثناء حفظ الدفعة.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isAddOpen,
    setIsAddOpen,
    isViewOpen,
    setIsViewOpen,
    amount,
    setAmount,
    note,
    setNote,
    isSubmitting,
    submit,
  };
}