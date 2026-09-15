"use client";

import { useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRegisterForm } from "@/hooks/use-register";

// عدّل القائمة دي براحتك عشان توافق الـ roles الفعلية عندك في السيستم
const ROLE_OPTIONS = [
  { value: "admin", label: "مدير (Admin)" },
  { value: "assistance", label: "مساعد (Assistance)" },
];

interface RegisterUserDialogProps {
  onRegistered?: () => void;
}

// كومبوننت مستقل بالكامل: فيه الزرار والمودال مع بعض،
// الصفحة الرئيسية بس بتحطه في مكانه من غير ما تدير أي state بتاعه
export function RegisterUserDialog({ onRegistered }: RegisterUserDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    formData,
    handleChange,
    setRole,
    submit,
    reset,
    isSubmitting,
    errorMessage,
    successMessage,
  } = useRegisterForm(() => onRegistered?.());

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) reset();
  };

  // ✅ setRole بتستقبل string بس، لكن onValueChange بتاعة Select ممكن تبعت null،
  // فبنلف هنا وبنمررلها القيمة بس لو مش null
  const handleRoleChange = (value: string | null) => {
    if (value !== null) setRole(value);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11 px-6 text-sm md:text-base font-black gap-2 shadow-md shadow-primary/10 transition-all"
      >
        <UserPlus className="size-5" /> إنشاء حساب جديد
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md dir-rtl rounded-2xl bg-card p-6">
          <DialogHeader className="space-y-1 text-center">
            <DialogTitle className="text-xl font-black text-foreground">
              إنشاء حساب جديد
            </DialogTitle>
            <p className="text-xs md:text-sm text-muted-foreground font-bold">
              أدخل بياناتك لإنشاء حساب مساعد جديد بالدالن
            </p>
          </DialogHeader>

          {errorMessage && (
            <div className="p-3 bg-destructive/10 text-destructive text-xs md:text-sm font-black rounded-xl border border-destructive/30">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-chart-2/10 text-chart-2 text-xs md:text-sm font-black rounded-xl border border-chart-2/30">
              {successMessage}
            </div>
          )}

          <form onSubmit={submit} className="space-y-3.5 mt-1">
            <div className="space-y-1.5 text-right">
              <Label className="text-xs md:text-sm font-black text-foreground">
                الاسم (Name) *
              </Label>
              <Input
                type="text"
                name="name"
                required
                placeholder="أدخل اسمك الكامل"
                value={formData.name}
                onChange={handleChange}
                className="rounded-xl border-border h-11 text-sm md:text-base font-bold px-3.5"
              />
            </div>

            <div className="space-y-1.5 text-right">
              <Label className="text-xs md:text-sm font-black text-foreground">
                البريد الإلكتروني (Email) *
              </Label>
              <Input
                type="email"
                name="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                className="rounded-xl border-border h-11 text-sm md:text-base font-bold px-3.5"
              />
            </div>

            <div className="space-y-1.5 text-right">
              <Label className="text-xs md:text-sm font-black text-foreground">
                كلمة المرور (Password) *
              </Label>
              <Input
                type="password"
                name="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="rounded-xl border-border h-11 text-sm md:text-base font-bold px-3.5"
              />
            </div>

            <div className="space-y-1.5 text-right">
              <Label className="text-xs md:text-sm font-black text-foreground">
                الدور (Role)
              </Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger className="rounded-xl border-border h-11 text-sm md:text-base font-bold px-3.5 w-full">
                  <SelectValue placeholder="اختر الدور" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11 text-sm md:text-base font-black gap-2 mt-2 shadow-md shadow-primary/10 transition-all"
            >
              {isSubmitting ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <>
                  <UserPlus className="size-5" /> تسجيل حساب جديد
                </>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}