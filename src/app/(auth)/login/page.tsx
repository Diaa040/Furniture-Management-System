"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden p-6"
      dir="rtl"
    >
      {/* خلفية الصفحة */}
      <Image
        src="/login-bg.jpg"
        alt=""
        fill
        priority
        className="object-cover"
      />
      {/* طبقة تعتيم خفيفة فوق الصورة عشان الكارت يفضل واضح من غير ما يبوظ لون الصورة */}
      <div className="absolute inset-0 bg-black/35" />

      <Card className="relative z-10 w-full max-w-md rounded-2xl border border-amber-200/20 shadow-2xl shadow-black/50 bg-black/35 backdrop-blur-xl p-6">
        <CardHeader className="space-y-1 text-center pb-4">
          <CardTitle className="text-2xl font-black text-amber-100 tracking-wide">
            تسجيل الدخول
          </CardTitle>
          <CardDescription className="text-xs text-amber-100/60 font-bold">
            أدخل بيانات حسابك للوصول إلى لوحة التحكم
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5 text-right">
              <Label htmlFor="email" className="text-xs font-black text-amber-100/90">
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
                className="rounded-xl border-amber-100/20 bg-white/10 text-amber-50 placeholder:text-amber-100/30 h-11 text-sm font-bold px-3.5 focus-visible:ring-amber-300/40 focus-visible:border-amber-200/40"
              />
            </div>

            <div className="space-y-1.5 text-right">
              <Label htmlFor="password" className="text-xs font-black text-amber-100/90">
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
                className="rounded-xl border-amber-100/20 bg-white/10 text-amber-50 placeholder:text-amber-100/30 h-11 text-sm font-bold px-3.5 focus-visible:ring-amber-300/40 focus-visible:border-amber-200/40"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 p-3 text-xs text-red-300 font-black border border-red-400/30">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-l from-amber-400 to-yellow-600 hover:from-amber-500 hover:to-yellow-700 text-[#2C2420] rounded-xl h-11 text-sm font-black gap-2 mt-2 shadow-md shadow-amber-900/30 transition-all"
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