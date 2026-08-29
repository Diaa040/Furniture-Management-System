"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useOrderDetails,
  useAddOrderCustomerPayment,
  useAddOrderItem,
  useDeleteOrderPayment,
  useUpdateOrderItem,
  useOrderStagesCost,
} from "@/hooks/use-orders";
import { OrderItem, Payment, OrderDetails, TAddItem, TUpdateItemPayload } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRight, Loader2, Plus, Trash2, Pencil } from "lucide-react";
import AddItemModal, { TAddItem as ModalTAddItem } from "@/components/AddItemModal";
import EditOrderItemModal from "@/components/EditOrderItemModal";
import { useQueryClient } from "@tanstack/react-query";

// خريطة لترجمة حالة الأوردر والعناصر
const statusMap: Record<string, { label: string; className: string }> = {
  delivered: { label: "تم التسليم", className: "bg-[#E6F4EA] text-[#1E7E34]" },
  pending: { label: "قيد الانتظار", className: "bg-amber-100 text-amber-800" },
  processing: { label: "قيد التصنيع", className: "bg-blue-100 text-blue-800" },
  completed: { label: "مكتمل", className: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "ملغي", className: "bg-red-100 text-red-800" },
};

export default function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  const router = useRouter();
  const queryClient = useQueryClient();

  // 1️⃣ جلب بيانات الأوردر الأساسية
  const {
    data: responseData,
    isLoading,
    isError,
    error,
  } = useOrderDetails(Number(orderId));

  // 🟢 2️⃣ جلب تكلفة المراحل بالـ API المخصوص الجديد
  const { data: stagesCostData } = useOrderStagesCost(orderId);

  // استخراج إجمالي تكلفة المراحل بأمان تام
  const totalStagesCost = Number(
    (stagesCostData as Record<string, unknown>)?.totalOrderStagesCost ?? 
    (stagesCostData as Record<string, unknown>)?.total_stages_cost ?? 
    (stagesCostData as Record<string, unknown>)?.cost ?? 
    0
  );

  // 🟢 استدعاء هوك الحذف مباشرة بدون بوب أب
  const { mutate: deletePayment, isPending: isDeleting } =
    useDeleteOrderPayment(orderId);

  // الـ States الخاصة بالبوب أب وحقل المبلغ
  const [isAddOrderPaymentModalOpen, setIsAddOrderPaymentModalOpen] =
    useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");

  const { mutate: addPayment, isPending: isSubmittingPayment } =
    useAddOrderCustomerPayment(Number(orderId));

  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const { mutate: addItem, isPending: isSubmittingItem } =
    useAddOrderItem(Number(orderId));

  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [selectedItemToEdit, setSelectedItemToEdit] = useState<OrderItem | null>(null);
  const { mutate: updateItem, isPending: isUpdatingItem } = useUpdateOrderItem(Number(orderId));

  const handleSaveItemSubmit = (data: ModalTAddItem) => {
    const formattedData: TAddItem = {
      ...data,
      price: Number(data.price),
    };

    addItem(formattedData, {
      onSuccess: () => {
        setIsAddItemModalOpen(false);
        router.refresh();
      },
    });
  };

  const handleEditItemSubmit = (data: Partial<TUpdateItemPayload>) => {
    if (!selectedItemToEdit) return;

    updateItem(
      { itemId: selectedItemToEdit.id, data },
      {
        onSuccess: () => {
          setIsEditItemModalOpen(false);
          setSelectedItemToEdit(null);
          router.refresh();
        },
      }
    );
  };

  const handleSaveOrderPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numericAmount = Number(paymentAmount);
    if (isNaN(numericAmount) || numericAmount < 1) {
      alert("الرجاء إدخال مبلغ صحيح (أكبر من أو يساوي 1)");
      return;
    }

    addPayment(
      { amount: numericAmount },
      {
        onSuccess: () => {
          setIsAddOrderPaymentModalOpen(false);
          setPaymentAmount("");
          router.refresh();
        },
      },
    );
  };

  // استخراج بيانات الأوردر
  const res = responseData as Record<string, unknown> | undefined;
  const order: OrderDetails | null = (res?.data as OrderDetails) || (res?.order as OrderDetails) || (res as unknown as OrderDetails) || null;

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center dir-rtl">
        <Loader2 className="size-8 animate-spin text-[#7C4A26]" />
        <span className="mr-3 text-sm text-muted-foreground">
          جاري تحميل بيانات الأوردر...
        </span>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="p-6 dir-rtl space-y-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="rounded-xl gap-2"
        >
          <ArrowRight className="size-4" /> رجوع
        </Button>
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
          حدث خطأ أثناء جلب بيانات الأوردر:{" "}
          {(error as Error)?.message || "الأوردر غير موجود"}
        </div>
      </div>
    );
  }

  const totalPrice = Number(order.total_price || 0);
  const paidAmount = Number(order.deposit_amount || 0);
  const remainingAmount = Number(order.remaining_amount || 0);
  const paidPercentage =
    totalPrice > 0 ? Math.round((paidAmount / totalPrice) * 100) : 0;
  
  // حساب صافي الربح بدقة
  const totalProfit = totalPrice - totalStagesCost;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("ar-EG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const statusInfo = statusMap[order.status] || {
    label: order.status,
    className: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="p-6 space-y-6 bg-[#FDFBF7] min-h-screen" dir="rtl">
      {/* الهيدر */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/orders")}
            className="rounded-xl border-gray-200 bg-white hover:bg-gray-100 shrink-0"
            title="رجوع"
          >
            <ArrowRight className="size-5 text-[#2C2420]" />
          </Button>

          <div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-0.5">
              <span
                className="cursor-pointer hover:underline"
                onClick={() => router.push("/orders")}
              >
                الأوردرات
              </span>
              <span>‹</span>
              <span>#{order.id}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#2C2420]">
              أوردر #{order.id}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {order.customer_name} - {order.customer_phone}
            </p>
          </div>
        </div>

        <Badge
          className={`${statusInfo.className} border-none px-4 py-2 text-sm font-semibold rounded-full shadow-none`}
        >
          {statusInfo.label}
        </Badge>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* العمود الأيمن: عناصر الأوردر والدفعات */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-sidebar-border/40 shadow-sm rounded-2xl bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg font-bold text-[#2C2420]">
                عناصر الأوردر
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddItemModalOpen(true)}
                className="rounded-xl border-sidebar-border text-xs font-semibold gap-1"
              >
                <Plus className="size-3.5" /> إضافة عنصر
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items && order.items.length > 0 ? (
                order.items.map((item: OrderItem) => {
                  const itemStatus = statusMap[item.status] || {
                    label: item.status,
                    className: "bg-gray-100 text-gray-700",
                  };

                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-[#FAFAFA] transition-colors"
                    >
                      <div
                        onClick={() =>
                          router.push(`/orders/${orderId}/items/${item.id}`)
                        }
                        className="flex items-center gap-4 text-right cursor-pointer flex-1"
                      >
                        <div className="size-14 rounded-xl bg-[#EFEBE4] shrink-0" />
                        <div>
                          <h4 className="font-bold text-[#2C2420] text-base">
                            {item.name}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.notes || "لا توجد ملاحظات"}
                          </p>
                          <span className="text-xs font-bold text-[#7C4A26] mt-1 block">
                            {Number(item.price).toLocaleString()} ج.م
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge
                          className={`${itemStatus.className} border-none rounded-full px-3 text-xs`}
                        >
                          {itemStatus.label}
                        </Badge>

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItemToEdit(item);
                            setIsEditItemModalOpen(true);
                          }}
                          className="size-9 rounded-xl border-gray-200 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition"
                          title="تعديل العنصر"
                        >
                          <Pencil className="size-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-sm text-muted-foreground py-4">
                  لا توجد عناصر مضافة لهذا الأوردر بعد
                </p>
              )}
            </CardContent>
          </Card>

          {/* الدفعات */}
          <Card className="border-sidebar-border/40 shadow-sm rounded-2xl bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg font-bold text-[#2C2420]">
                الدفعات
              </CardTitle>
              <Button
                onClick={() => setIsAddOrderPaymentModalOpen(true)}
                className="bg-[#7C4A26] hover:bg-[#633a1e] text-white rounded-xl text-xs font-semibold px-4 gap-1.5"
              >
                <Plus className="size-4" /> تسجيل دفعة
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-[#FAF8F5]">
                  <TableRow>
                    <TableHead className="text-right font-bold text-[#2C2420]">
                      الدفعة / البيان
                    </TableHead>
                    <TableHead className="text-center font-bold text-[#2C2420]">
                      المبلغ
                    </TableHead>
                    <TableHead className="text-left font-bold text-[#2C2420] pl-6">
                      التاريخ / الإجراءات
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.payments && order.payments.length > 0 ? (
                    order.payments.map((payment: Payment, index: number) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-semibold text-[#2C2420]">
                          {payment.notes || `دفعة رقم ${index + 1}`}
                        </TableCell>
                        <TableCell className="text-center font-mono font-bold">
                          {Number(payment.amount).toLocaleString()} ج.م
                        </TableCell>
                        <TableCell className="text-left pl-6 text-muted-foreground">
                          <div className="flex items-center justify-between gap-2">
                            <span>{formatDate(payment.created_at)}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isDeleting}
                              onClick={() =>
                                deletePayment(payment.id, {
                                  onSuccess: () => {
                                    router.refresh();
                                  },
                                })
                              }
                              className="size-8 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50"
                              title="حذف الدفعة"
                            >
                              {isDeleting ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <Trash2 className="size-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center text-muted-foreground py-4"
                      >
                        لم يتم تسجيل أي دفعات
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* العمود الأيسر: بيانات العميل، الملخص، والتكلفة والربح */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-sidebar-border/40 shadow-sm rounded-2xl bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-right text-[#2C2420]">
                بيانات العميل
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">الاسم</span>
                <span className="font-semibold text-[#2C2420]">
                  {order.customer_name}
                </span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">الهاتف</span>
                <span dir="ltr" className="font-mono text-[#2C2420]">
                  {order.customer_phone}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">ملاحظات</span>
                <span className="text-[#2C2420] text-left max-w-50 truncate">
                  {order.notes || "لا يوجد"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-sidebar-border/40 shadow-sm rounded-2xl bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-right text-[#2C2420]">
                الملخص المالي
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">
                  إجمالي سعر الأوردر
                </span>
                <span className="font-bold text-[#2C2420]">
                  {totalPrice.toLocaleString()} ج.م
                </span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">المدفوع (المقدم)</span>
                <span className="font-bold text-[#2C2420]">
                  {paidAmount.toLocaleString()} ج.م
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">المتبقي</span>
                <span className="font-bold text-[#2C2420]">
                  {remainingAmount.toLocaleString()} ج.م
                </span>
              </div>

              <div className="pt-2 space-y-2">
                <Progress
                  value={paidPercentage}
                  className="h-2.5 bg-[#F3E7DA]"
                />
                <p className="text-xs text-center text-muted-foreground">
                  تم تحصيل %{paidPercentage} من قيمة الأوردر
                </p>
              </div>
            </CardContent>
          </Card>

          {/* التكلفة والربح المعتمِدة على الـ API المخصوص */}
          <Card className="border-sidebar-border/40 shadow-sm rounded-2xl bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-[#2C2420]">
                التكلفة والربح
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">إجمالي تكلفة التصنيع</span>
                <span className="font-semibold text-[#2C2420]">
                  {totalStagesCost.toLocaleString()} ج.م
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">إجمالي الربح</span>
                <span className="font-semibold text-[#7C4A26]">
                  {totalProfit.toLocaleString()} ج.م
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* المودالز */}
      <Dialog
        open={isAddOrderPaymentModalOpen}
        onOpenChange={setIsAddOrderPaymentModalOpen}
      >
        <DialogContent className="sm:max-w-md dir-rtl rounded-2xl bg-white p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-[#2C2420] text-right">
              تسجيل دفعة للأوردر
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSaveOrderPaymentSubmit}
            className="space-y-4 mt-2"
          >
            <div className="space-y-1.5 text-right">
              <Label className="text-sm font-bold text-[#2C2420]">
                المبلغ (Amount) *
              </Label>
              <Input
                type="number"
                step="any"
                min="1"
                required
                placeholder="أدخل المبلغ (مثال: 500)"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="rounded-xl border-gray-200 h-11 text-center text-sm font-bold"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOrderPaymentModalOpen(false)}
                className="rounded-xl font-bold border-gray-200"
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingPayment}
                className="rounded-xl font-black bg-[#7C4A26] hover:bg-[#633a1e] text-white px-6"
              >
                {isSubmittingPayment ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "حفظ الدفعة"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        onSubmit={handleSaveItemSubmit}
        isPending={isSubmittingItem}
      />

      <EditOrderItemModal
        isOpen={isEditItemModalOpen}
        onClose={() => {
          setIsEditItemModalOpen(false);
          setSelectedItemToEdit(null);
        }}
        onSubmit={handleEditItemSubmit}
        isPending={isUpdatingItem}
        item={selectedItemToEdit}
      />
    </div>
  );
}