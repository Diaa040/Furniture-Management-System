"use client";

import { X } from "lucide-react";
import type { Product } from "@/types/profits";

interface ProductDetailsDialogProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export function ProductDetailsDialog({
  product,
  open,
  onClose,
}: ProductDetailsDialogProps) {
  if (!open || !product) {
    return null;
  }

  const statusLabel = {
    available: "متوفر",
    low: "منخفض",
    out: "نافد",
  }[product.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-bold">
              تفاصيل المنتج
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              معلومات المنتج بالكامل
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-lg hover:bg-accent"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-xl font-bold text-primary">
              {product.name.charAt(0)}
            </div>

            <div>
              <h3 className="font-bold">
                {product.name}
              </h3>

              <p className="text-sm text-muted-foreground">
                {product.category}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">
                السعر
              </p>

              <p className="mt-1 text-lg font-bold">
                {product.price.toLocaleString("ar-EG")} ج.م
              </p>
            </div>

            <div className="rounded-xl bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">
                المخزون
              </p>

              <p className="mt-1 text-lg font-bold">
                {product.stock} قطعة
              </p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold">
              الحالة
            </p>

            <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {statusLabel}
            </span>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold">
              الوصف
            </p>

            <p className="rounded-xl bg-muted/40 p-4 text-sm leading-7 text-muted-foreground">
              {product.description || "لا يوجد وصف لهذا المنتج."}
            </p>
          </div>

          <div className="text-xs text-muted-foreground">
            آخر تحديث:{" "}
            {new Date(product.updatedAt).toLocaleDateString(
              "ar-EG",
            )}
          </div>
        </div>
      </div>
    </div>
  );
}