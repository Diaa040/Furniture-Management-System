"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Payment } from "@/types/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { useDeleteOrderPayment } from "@/hooks/use-orders";
import { formatArabicDate } from "@/lib/date";
import ConfirmDialog from "@/components/ConfirmDialog";

interface OrderPaymentsCardProps {
  orderId: string;
  payments: Payment[];
  onAddClick: () => void;
}

export default function OrderPaymentsCard({ orderId, payments, onAddClick }: OrderPaymentsCardProps) {
  const queryClient = useQueryClient();
  const { mutate: deletePayment, isPending: isDeleting } = useDeleteOrderPayment(orderId);
  const [paymentToDelete, setPaymentToDelete] = useState<Payment | null>(null);

  const handleConfirmDelete = () => {
    if (!paymentToDelete) return;

    deletePayment(paymentToDelete.id, {
      onSuccess: () => {
        // ⚠️ لازم الـ key هنا يطابق بالظبط اللي جوه useOrderDetails - راجع الملاحظة فوق
        queryClient.invalidateQueries({ queryKey: ["order-details", Number(orderId)] });
        queryClient.invalidateQueries({ queryKey: ["order-stages-cost", orderId] });
        setPaymentToDelete(null);
      },
    });
  };

  return (
    <>
      <Card className="border-sidebar-border/40 shadow-sm rounded-2xl bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg font-bold text-[#2C2420]">الدفعات</CardTitle>
          <Button onClick={onAddClick} className="bg-[#7C4A26] hover:bg-[#633a1e] text-white rounded-xl text-xs font-semibold px-4 gap-1.5">
            <Plus className="size-4" /> تسجيل دفعة
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-[#FAF8F5]">
              <TableRow>
                <TableHead className="text-right font-bold text-[#2C2420]">الدفعة / البيان</TableHead>
                <TableHead className="text-center font-bold text-[#2C2420]">المبلغ</TableHead>
                <TableHead className="text-left font-bold text-[#2C2420] pl-6">التاريخ / الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length > 0 ? (
                payments.map((payment, index) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-semibold text-[#2C2420]">{payment.notes || `دفعة رقم ${index + 1}`}</TableCell>
                    <TableCell className="text-center font-mono font-bold">{Number(payment.amount).toLocaleString()} ج.م</TableCell>
                    <TableCell className="text-left pl-6 text-muted-foreground">
                      <div className="flex items-center justify-between gap-2">
                        <span>{formatArabicDate(payment.created_at)}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setPaymentToDelete(payment)}
                          className="size-8 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="حذف الدفعة"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-4">لم يتم تسجيل أي دفعات</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ConfirmDialog
        isOpen={!!paymentToDelete}
        onClose={() => setPaymentToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="تأكيد حذف الدفعة"
        description={
          paymentToDelete
            ? `هل أنت متأكد إنك عايز تمسح دفعة بقيمة ${Number(paymentToDelete.amount).toLocaleString()} ج.م؟ الإجراء ده مش هيترجع.`
            : undefined
        }
        confirmText="نعم، احذف"
        isPending={isDeleting}
      />
    </>
  );
}