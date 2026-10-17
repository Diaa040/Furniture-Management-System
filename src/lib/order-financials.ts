import { OrderDetails } from "@/types/order";

export interface OrderFinancials {
  totalPrice: number;
  paidAmount: number;
  remainingAmount: number;
  paidPercentage: number;
  totalStagesCost: number;
  totalProfit: number;
}

export function extractTotalStagesCost(stagesCostData?: Record<string, unknown>): number {
  return Number(
    stagesCostData?.totalOrderStagesCost ??
      stagesCostData?.total_stages_cost ??
      stagesCostData?.cost ??
      0,
  );
}

export function getOrderFinancials(order: OrderDetails, totalStagesCost: number): OrderFinancials {
  const totalPrice = Number(order.total_price || 0);
  const paidAmount = Number(order.deposit_amount || 0);
  const remainingAmount = Number(order.remaining_amount || 0);
  const paidPercentage = totalPrice > 0 ? Math.round((paidAmount / totalPrice) * 100) : 0;
  const totalProfit = totalPrice - totalStagesCost;

  return { totalPrice, paidAmount, remainingAmount, paidPercentage, totalStagesCost, totalProfit };
}