"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useOrderDetails,
  useAddOrderCustomerPayment,
  useAddOrderItem,
  useUpdateOrderItem,
  useOrderStagesCost,
} from "@/hooks/use-orders";
import { OrderItem, OrderDetails, TAddItem, TUpdateItemPayload } from "@/types/order";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import AddItemModal, { TAddItem as ModalTAddItem } from "@/components/AddItemModal";
import EditOrderItemModal from "@/components/EditOrderItemModal";
import OrderPageHeader from "@/components/orders/OrderPageHeader";
import OrderItemsCard from "@/components/orders/OrderItemsCard";
import OrderPaymentsCard from "@/components/orders/OrderPaymentsCard";
import CustomerInfoCard from "@/components/orders/CustomerInfoCard";
import FinancialSummaryCard from "@/components/orders/FinancialSummaryCard";
import CostProfitCard from "@/components/orders/CostProfitCard";
import AddOrderPaymentModal from "@/components/orders/AddOrderPaymentModal";
import { extractTotalStagesCost, getOrderFinancials } from "@/lib/order-financials";

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: orderId } = use(params);
  const router = useRouter();

  const { data: responseData, isLoading, isError, error } = useOrderDetails(Number(orderId));
  const { data: stagesCostData } = useOrderStagesCost(orderId);

  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const { mutate: addPayment, isPending: isSubmittingPayment } = useAddOrderCustomerPayment(Number(orderId));

  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const { mutate: addItem, isPending: isSubmittingItem } = useAddOrderItem(Number(orderId));

  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [selectedItemToEdit, setSelectedItemToEdit] = useState<OrderItem | null>(null);
  const { mutate: updateItem, isPending: isUpdatingItem } = useUpdateOrderItem(Number(orderId));

  const handleSaveItemSubmit = (data: ModalTAddItem) => {
    addItem({ ...data, price: Number(data.price) } as TAddItem, {
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
      },
    );
  };

  const handleAddPaymentSubmit = (amount: number) => {
    addPayment({ amount }, { onSuccess: () => setIsAddPaymentModalOpen(false) });
  };

  const res = responseData as Record<string, unknown> | undefined;
  const order: OrderDetails | null =
    (res?.data as OrderDetails) || (res?.order as OrderDetails) || (res as unknown as OrderDetails) || null;

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center dir-rtl">
        <Loader2 className="size-8 animate-spin text-[#7C4A26]" />
        <span className="mr-3 text-sm text-muted-foreground">جاري تحميل بيانات الأوردر...</span>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="p-6 dir-rtl space-y-4">
        <Button variant="outline" onClick={() => router.back()} className="rounded-xl gap-2">
          <ArrowRight className="size-4" /> رجوع
        </Button>
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
          حدث خطأ أثناء جلب بيانات الأوردر: {(error as Error)?.message || "الأوردر غير موجود"}
        </div>
      </div>
    );
  }

  const totalStagesCost = extractTotalStagesCost(stagesCostData as Record<string, unknown>);
  const financials = getOrderFinancials(order, totalStagesCost);

  return (
    <div className="p-6 space-y-6 bg-[#FDFBF7] min-h-screen" dir="rtl">
      <OrderPageHeader orderId={order.id} customerName={order.customer_name} customerPhone={order.customer_phone} status={order.status} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          <OrderItemsCard
            orderId={orderId}
            items={order.items || []}
            onAddClick={() => setIsAddItemModalOpen(true)}
            onEditClick={(item) => {
              setSelectedItemToEdit(item);
              setIsEditItemModalOpen(true);
            }}
          />
          <OrderPaymentsCard orderId={orderId} payments={order.payments || []} onAddClick={() => setIsAddPaymentModalOpen(true)} />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <CustomerInfoCard customerName={order.customer_name} customerPhone={order.customer_phone} notes={order.notes} />
          <FinancialSummaryCard {...financials} />
          <CostProfitCard totalStagesCost={financials.totalStagesCost} totalProfit={financials.totalProfit} />
        </div>
      </div>

      <AddOrderPaymentModal isOpen={isAddPaymentModalOpen} onClose={() => setIsAddPaymentModalOpen(false)} onSubmit={handleAddPaymentSubmit} isPending={isSubmittingPayment} />
      <AddItemModal isOpen={isAddItemModalOpen} onClose={() => setIsAddItemModalOpen(false)} onSubmit={handleSaveItemSubmit} isPending={isSubmittingItem} />
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