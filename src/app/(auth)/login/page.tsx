"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, LogIn } from "lucide-react";

interface ApiErrorResponse {
  message?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email, password);
      router.replace("/dashboard");
    } catch (err: unknown) {
      console.error("خطأ في تسجيل الدخول:", err);

      if (err instanceof AxiosError) {
        const errorData = err.response?.data as ApiErrorResponse | undefined;
        setError(errorData?.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة");
      } else {
        setError("حدث خطأ غير متوقع، برجاء المحاولة لاحقاً");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FDFBF7] p-6" dir="rtl">
      <Card className="w-full max-w-md rounded-2xl border-sidebar-border/40 shadow-sm bg-white p-6">
        <CardHeader className="space-y-1 text-center pb-4">
          <CardTitle className="text-2xl font-black text-[#2C2420]">
            تسجيل الدخول
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground font-bold">
            أدخل بيانات حسابك للوصول إلى لوحة التحكم
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5 text-right">
              <Label htmlFor="email" className="text-xs font-black text-[#2C2420]">
                البريد الإلكتروني
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                disabled={loading}
                className="rounded-xl border-gray-200 h-11 text-sm font-bold px-3.5"
              />
            </div>

            <div className="space-y-1.5 text-right">
              <Label htmlFor="password" className="text-xs font-black text-[#2C2420]">
                كلمة المرور
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                className="rounded-xl border-gray-200 h-11 text-sm font-bold px-3.5"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 font-black border border-red-200">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7C4A26] hover:bg-[#633a1e] text-white rounded-xl h-11 text-sm font-black gap-2 mt-2 shadow-md shadow-[#7C4A26]/10 transition-all"
            >
              {loading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <>
                  <LogIn className="size-5" /> تسجيل الدخول
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}