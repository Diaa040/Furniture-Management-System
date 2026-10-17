"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAdditions } from "@/hooks/use-additions";
import { AdditionCard } from "@/components/orders/AdditionCard";
import { AddAdditionDialog } from "@/components/orders/AddAdditionDialog";

interface AdditionsSectionProps {
  orderId: number;
  itemId: number;
}

export function AdditionsSection({ orderId, itemId }: AdditionsSectionProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { data, isLoading, isError } = useAdditions(orderId, itemId);

  const additions = data ?? [];

  if (isLoading) {
    return (
      <Card className="border-sidebar-border/40 shadow-sm rounded-2xl bg-white p-12 flex items-center justify-center">
        <Loader2 className="size-7 animate-spin text-[#7C4A26]" />
        <span className="mr-3 font-bold text-[#2C2420]">
          جاري تحميل الإضافات...
        </span>
      </Card>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600">
        <p className="font-extrabold text-lg">حدث خطأ أثناء تحميل بيانات الإضافات</p>
      </div>
    );
  }

  // لا توجد إضافات: صفحة فاضية مع زرار في النص للإضافة
  if (additions.length === 0) {
    return (
      <>
        <Card className="border-sidebar-border/40 shadow-sm rounded-2xl bg-white overflow-hidden p-8">
          <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-gray-300 rounded-2xl bg-[#FAF8F5]/50 text-center space-y-4">
            <div className="size-14 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
              <Plus className="size-8" />
            </div>
            <h3 className="text-xl font-black text-[#2C2420]">
              لا توجد إضافات مسجلة
            </h3>
            <p className="text-sm text-gray-500 max-w-md font-bold">
              لم يتم تسجيل أي بنود إضافية لهذا العنصر حتى الآن.
            </p>
            <Button
              onClick={() => setIsAddOpen(true)}
              className="bg-[#7C4A26] hover:bg-[#633a1e] text-white font-black rounded-xl px-6 py-5 shadow-sm gap-2 mt-2"
            >
              <Plus className="size-5" /> إضافة جديدة
            </Button>
          </div>
        </Card>

        <AddAdditionDialog
          isOpen={isAddOpen}
          onOpenChange={setIsAddOpen}
          orderId={orderId}
          itemId={itemId}
        />
      </>
    );
  }

  // يوجد إضافات: كارد لكل إضافة + زرار إضافة جديدة فوق
  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button
          onClick={() => setIsAddOpen(true)}
          className="bg-[#7C4A26] hover:bg-[#633a1e] text-white font-black rounded-xl gap-2"
        >
          <Plus className="size-4" /> إضافة جديدة
        </Button>
      </div>

      {additions.map((addition) => (
        <AdditionCard key={addition.id} addition={addition} itemId={itemId} />
      ))}

      <AddAdditionDialog
        isOpen={isAddOpen}
        onOpenChange={setIsAddOpen}
        orderId={orderId}
        itemId={itemId}
      />
    </div>
  );
}