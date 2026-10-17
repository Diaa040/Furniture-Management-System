"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isPending?: boolean;
  variant?: "default" | "destructive";
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "تأكيد",
  cancelText = "إلغاء",
  isPending = false,
  variant = "destructive",
}: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm dir-rtl rounded-2xl bg-white p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-black text-[#2C2420] text-right">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-right text-sm text-muted-foreground pt-1">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending} className="rounded-xl font-bold border-gray-200">
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className={
              variant === "destructive"
                ? "rounded-xl font-black bg-red-600 hover:bg-red-700 text-white px-6"
                : "rounded-xl font-black bg-[#7C4A26] hover:bg-[#633a1e] text-white px-6"
            }
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}