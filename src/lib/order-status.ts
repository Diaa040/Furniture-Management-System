export const ORDER_STATUS_MAP: Record<string, { label: string; className: string }> = {
  delivered: { label: "تم التسليم", className: "bg-[#E6F4EA] text-[#1E7E34]" },
  pending: { label: "قيد الانتظار", className: "bg-amber-100 text-amber-800" },
  processing: { label: "قيد التصنيع", className: "bg-blue-100 text-blue-800" },
  completed: { label: "مكتمل", className: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "ملغي", className: "bg-red-100 text-red-800" },
};

export function getStatusInfo(status: string) {
  return ORDER_STATUS_MAP[status] ?? { label: status, className: "bg-gray-100 text-gray-800" };
}