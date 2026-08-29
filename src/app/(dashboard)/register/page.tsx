"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UserPlus, Users, Mail } from "lucide-react";
import { registerApi } from "@/apis/auth.api";
import { useUsers } from "@/apis/users.api";
import { isAxiosError } from "axios";
import { ApiErrorResponse} from "@/types/auth";
import { UserItem } from "@/types/users";

export default function RegisterAndUsersPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "assistance",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { data: usersResponse, isLoading: isUsersLoading, refetch } = useUsers(true);
  const usersList = usersResponse?.data || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      setIsSubmitting(true);
      await registerApi(formData);
      
      setSuccessMessage("تم إنشاء الحساب بنجاح!");
      setFormData({ name: "", email: "", password: "", role: "assistance" });
      refetch();
      router.refresh();
    } catch (error: unknown) {
      console.error("خطأ أثناء التسجيل:", error);
      
      if (isAxiosError<ApiErrorResponse>(error)) {
        setErrorMessage(
          error.response?.data?.message || "حدث خطأ أثناء عملية التسجيل، يرجى المحاولة مرة أخرى."
        );
      } else {
        setErrorMessage("حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "م";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  return (
    <div className="p-4 md:p-6 bg-[#FDFBF7] min-h-screen" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* القسم الأيمن: فورم التسجيل */}
        <div className="lg:col-span-5">
          <Card className="w-full rounded-2xl border-sidebar-border/40 shadow-sm bg-white p-5 md:p-6">
            <CardHeader className="space-y-1 text-center pb-4">
              <CardTitle className="text-xl md:text-2xl font-black text-[#2C2420]">
                إنشاء حساب جديد
              </CardTitle>
              <p className="text-xs md:text-sm text-muted-foreground font-bold">
                أدخل بياناتك لإنشاء حساب مساعد جديد بالدالن
              </p>
            </CardHeader>

            <CardContent>
              {errorMessage && (
                <div className="mb-3 p-3 bg-red-50 text-red-600 text-xs md:text-sm font-black rounded-xl border border-red-200">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="mb-3 p-3 bg-emerald-50 text-emerald-700 text-xs md:text-sm font-black rounded-xl border border-emerald-200">
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="space-y-1.5 text-right">
                  <Label className="text-xs md:text-sm font-black text-[#2C2420]">الاسم (Name) *</Label>
                  <Input
                    type="text"
                    name="name"
                    required
                    placeholder="أدخل اسمك الكامل"
                    value={formData.name}
                    onChange={handleChange}
                    className="rounded-xl border-gray-200 h-11 text-sm md:text-base font-bold px-3.5"
                  />
                </div>

                <div className="space-y-1.5 text-right">
                  <Label className="text-xs md:text-sm font-black text-[#2C2420]">البريد الإلكتروني (Email) *</Label>
                  <Input
                    type="email"
                    name="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="rounded-xl border-gray-200 h-11 text-sm md:text-base font-bold px-3.5"
                  />
                </div>

                <div className="space-y-1.5 text-right">
                  <Label className="text-xs md:text-sm font-black text-[#2C2420]">كلمة المرور (Password) *</Label>
                  <Input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="rounded-xl border-gray-200 h-11 text-sm md:text-base font-bold px-3.5"
                  />
                </div>

                <div className="space-y-1.5 text-right">
                  <Label className="text-xs md:text-sm font-black text-[#2C2420]">الدور (Role)</Label>
                  <Input
                    type="text"
                    name="role"
                    placeholder="assistance"
                    value={formData.role}
                    onChange={handleChange}
                    className="rounded-xl border-gray-200 h-11 text-sm md:text-base font-bold px-3.5 bg-gray-50 text-muted-foreground"
                  />
                  
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#7C4A26] hover:bg-[#633a1e] text-white rounded-xl h-11 text-sm md:text-base font-black gap-2 mt-2 shadow-md shadow-[#7C4A26]/10 transition-all"
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
            </CardContent>
          </Card>
        </div>

        {/* القسم الأيسر: قائمة المستخدمين (الاسم والدائرة يمين، والـ Role يسار) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg md:text-xl font-black text-[#2C2420] flex items-center gap-2">
              <Users className="size-5 text-[#7C4A26]" /> المستخدمون المسجلون ({usersResponse?.count || 0})
            </h2>
          </div>

          {isUsersLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="size-7 animate-spin text-[#7C4A26]" />
            </div>
          ) : usersList.length > 0 ? (
            <div className="space-y-3">
              {usersList.map((user: UserItem) => (
                <Card 
                  key={user.id} 
                  className="w-full rounded-2xl border-sidebar-border/40 shadow-sm bg-white p-4 md:p-5 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    
                    {/* الجانب الأيمن: الدائرة الرمزية + الاسم والبريد */}
                    <div className="flex items-center gap-3 text-right">
                      <div className="size-10 md:size-11 rounded-full bg-[#E8DCC4] text-[#7C4A26] font-black flex items-center justify-center text-xs md:text-sm shadow-inner shrink-0">
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <h3 className="text-sm md:text-base font-black text-[#2C2420]">
                          {user.name}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600 font-extrabold flex items-center gap-1 justify-start mt-0.5" dir="ltr">
                          <span className="text-right">{user.email}</span> <Mail className="size-3.5 text-gray-500 shrink-0" />
                        </p>
                      </div>
                    </div>

                    {/* الجانب الأيسر: الـ Badge الخاص بالدور */}
                    <div>
                      <span className="bg-[#EFECE6] text-[#7C4A26] px-3.5 py-1.5 rounded-full text-l font-black tracking-wide">
                        {user.role}
                      </span>
                    </div>

                  </div>

                  {/* تفاصيل سفلية */}
                  <div className="mt-3 pt-2.5 border-t border-gray-100 text-[11px] md:text-xs text-gray-700 font-extrabold flex justify-between items-center">
                    
                    <span className="font-mono ">
                      تاريخ الإنشاء: {user.created_at ? new Date(user.created_at).toLocaleDateString("ar-EG") : "غير متوفر"}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="rounded-2xl border-sidebar-border/40 bg-white p-6 text-center text-muted-foreground font-black text-sm">
              لا يوجد مستخدمون مضافون حتى الآن.
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}