"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { getStatusInfo } from "@/lib/order-status";

interface OrderPageHeaderProps {
  orderId: number;
  customerName: string;
  customerPhone: string;
  status: string;
}

export default function OrderPageHeader({ orderId, customerName, customerPhone, status }: OrderPageHeaderProps) {
  const router = useRouter();
  const statusInfo = getStatusInfo(status);

  return (
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
            <span className="cursor-pointer hover:underline" onClick={() => router.push("/orders")}>
              الأوردرات
            </span>
            <span>‹</span>
            <span>#{orderId}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#2C2420]">أوردر #{orderId}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{customerName} - {customerPhone}</p>
        </div>
      </div>

      <Badge className={`${statusInfo.className} border-none px-4 py-2 text-sm font-semibold rounded-full shadow-none`}>
        {statusInfo.label}
      </Badge>
    </div>
  );
}