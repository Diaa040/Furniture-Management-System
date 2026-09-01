"use client";

import { useRouter } from "next/navigation";
import { OrderItem } from "@/types/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil } from "lucide-react";
import { getStatusInfo } from "@/lib/order-status";

interface OrderItemsCardProps {
  orderId: string;
  items: OrderItem[];
  onAddClick: () => void;
  onEditClick: (item: OrderItem) => void;
}

export default function OrderItemsCard({ orderId, items, onAddClick, onEditClick }: OrderItemsCardProps) {
  const router = useRouter();

  return (
    <Card className="border-sidebar-border/40 shadow-sm rounded-2xl bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg font-bold text-[#2C2420]">عناصر الأوردر</CardTitle>
        <Button variant="outline" size="sm" onClick={onAddClick} className="rounded-xl border-sidebar-border text-xs font-semibold gap-1">
          <Plus className="size-3.5" /> إضافة عنصر
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length > 0 ? (
          items.map((item) => {
            const itemStatus = getStatusInfo(item.status);
            return (
              <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-[#FAFAFA] transition-colors">
                <div onClick={() => router.push(`/orders/${orderId}/items/${item.id}`)} className="flex items-center gap-4 text-right cursor-pointer flex-1">
                  <div className="size-14 rounded-xl bg-[#EFEBE4] shrink-0" />
                  <div>
                    <h4 className="font-bold text-[#2C2420] text-base">{item.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.notes || "لا توجد ملاحظات"}</p>
                    <span className="text-xs font-bold text-[#7C4A26] mt-1 block">
                      {Number(item.price).toLocaleString()} ج.م
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge className={`${itemStatus.className} border-none rounded-full px-3 text-xs`}>{itemStatus.label}</Badge>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditClick(item);
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
          <p className="text-center text-sm text-muted-foreground py-4">لا توجد عناصر مضافة لهذا الأوردر بعد</p>
        )}
      </CardContent>
    </Card>
  );
}