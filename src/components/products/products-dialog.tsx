"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Product } from "@/types/profits";
import { createProduct, updateProduct } from "@/apis/profits.api";

interface ProductDialogProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSuccess: (product: Product) => void;
}

export default function ProductDialog({
  open,
  product,
  onClose,
  onSuccess,
}: ProductDialogProps) {
  if (!open) return null;

  return (
    <ProductDialogForm
      key={product ? `edit-${product.id}` : "create"}
      product={product}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
}

function ProductDialogForm({
  product,
  onClose,
  onSuccess,
}: Omit<ProductDialogProps, "open">) {
  const [name, setName] = useState(product?.name ?? "");
  const [category, setCategory] = useState(product?.category ?? "كراسي");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [stock, setStock] = useState(product ? String(product.stock) : "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSaving(true);

      const status: Product["status"] =
        product?.status ?? ("active" as Product["status"]);

      const data = {
        name: name.trim(),
        category,
        price: Number(price),
        stock: Number(stock),
        description: description.trim(),
        status,
      };

      const savedProduct = product
        ? await updateProduct(product.id, data)
        : await createProduct(data);

      onSuccess(savedProduct);
      onClose();
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء حفظ المنتج");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        dir="rtl"
        className="w-full max-w-lg rounded-2xl bg-card shadow-xl"
      >
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-lg font-bold">
            {product ? "تعديل المنتج" : "إضافة منتج"}
          </h2>

          <button type="button" onClick={onClose}>
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسم المنتج"
            className="h-11 w-full rounded-lg border px-3"
            required
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-11 w-full rounded-lg border px-3"
          >
            <option value="كراسي">كراسي</option>
            <option value="طاولات">طاولات</option>
            <option value="مكاتب">مكاتب</option>
            <option value="غرف نوم">غرف نوم</option>
            <option value="وحدات">وحدات</option>
          </select>

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="السعر"
            min="0"
            className="h-11 w-full rounded-lg border px-3"
            required
          />

          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="المخزون"
            min="0"
            className="h-11 w-full rounded-lg border px-3"
            required
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="الوصف"
            rows={4}
            className="w-full rounded-lg border p-3"
          />

          <div className="flex justify-start gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-5 py-2"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary px-5 py-2 text-primary-foreground disabled:opacity-50"
            >
              {saving
                ? "جاري الحفظ..."
                : product
                  ? "حفظ التعديلات"
                  : "إضافة المنتج"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}