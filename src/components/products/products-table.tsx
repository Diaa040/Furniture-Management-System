"use client";

import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { Product } from "@/types/profits";

interface ProductsTableProps {
  products: Product[];
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

function getStatusStyle(status: Product["status"]) {
  switch (status) {
    case "available":
      return "bg-emerald-100 text-emerald-700";

    case "low":
      return "bg-amber-100 text-amber-700";

    case "out":
      return "bg-red-100 text-red-700";

    default:
      return "bg-muted text-muted-foreground";
  }
}

function getStatusLabel(status: Product["status"]) {
  switch (status) {
    case "available":
      return "متوفر";

    case "low":
      return "منخفض";

    case "out":
      return "نافد";

    default:
      return status;
  }
}

function formatPrice(price: number) {
  return `${price.toLocaleString("ar-EG")} ج.م`;
}

export function ProductsTable({
  products,
  onView,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="px-6 py-4 text-right text-[14px] font-bold">
              المنتج
            </TableHead>

            <TableHead className="text-right text-[14px] font-bold">
              الفئة
            </TableHead>

            <TableHead className="text-right text-[14px] font-bold">
              السعر
            </TableHead>

            <TableHead className="text-right text-[14px] font-bold">
              المخزون
            </TableHead>

            <TableHead className="text-right text-[14px] font-bold">
              الحالة
            </TableHead>

            <TableHead className="w-16" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-32 text-center text-muted-foreground"
              >
                لا توجد منتجات مطابقة للبحث
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow
                key={product.id}
                className="hover:bg-muted/30"
              >
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary">
                      {product.name.charAt(0)}
                    </div>

                    <span className="text-[15px] font-semibold">
                      {product.name}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-[14px] text-muted-foreground">
                  {product.category}
                </TableCell>

                <TableCell className="text-[15px] font-semibold">
                  {formatPrice(product.price)}
                </TableCell>

                <TableCell className="text-[15px]">
                  {product.stock} قطعة
                </TableCell>

                <TableCell>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                      product.status,
                    )}`}
                  >
                    {getStatusLabel(product.status)}
                  </span>
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex size-9 items-center justify-center rounded-lg hover:bg-accent">
                      <MoreHorizontal className="size-5" />

                      <span className="sr-only">
                        خيارات المنتج
                      </span>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      className="w-44"
                    >
                      <DropdownMenuItem
                        className="cursor-pointer gap-2"
                        onClick={() => onView(product)}
                      >
                        <Eye className="size-4" />
                        عرض التفاصيل
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="cursor-pointer gap-2"
                        onClick={() => onEdit(product)}
                      >
                        <Pencil className="size-4" />
                        تعديل المنتج
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                        onClick={() => onDelete(product)}
                      >
                        <Trash2 className="size-4" />
                        حذف المنتج
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}