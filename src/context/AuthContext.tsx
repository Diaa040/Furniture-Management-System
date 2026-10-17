"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation"; // 🟢 استيراد الـ useRouter
import { authApi } from "@/apis/auth.api";
import type { User } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // 🟢 تعريف الـ router

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = await authApi.getCurrentUser();
          setUser(userData);
        } catch {
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    // نفترض أن authApi.login ترجع الـ response بالكامل أو الـ data الخاصة بالباك إند
    const response = await authApi.login(email, password);
    
    // استخراج الـ token و user من داخل كائن الـ data بناءً على شكل الـ Response لديك
    const token = response?.data?.token ;
    const userData = response?.data?.user ;

    if (token) {
      localStorage.setItem("token", token);
      if (userData) {
        setUser(userData);
      } else {
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser);
      }
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e: unknown) {
      console.error(e);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      router.replace("/login"); // 🟢 استخدام router.replace بدل window.location.href
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};