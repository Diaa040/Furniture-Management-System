import { api } from "@/lib/api";
import type { LoginResponse, User } from "@/types/auth";
import { RegisterPayload, RegisterResponse } from "@/types/auth";

export async function registerApi(payload: RegisterPayload): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>("/api/register", {
    ...payload,
    role: payload.role || "assistance",
  });
  return data;
}

export const authApi = {
  // طلب تسجيل الدخول
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post("/api/login", { email, password });
    return response.data;
  },

  // جلب بيانات المستخدم الحالي
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get("/api/user");
    return response.data;
  },

  // تسجيل الخروج
  logout: async (): Promise<void> => {
    await api.post("/api/logout");
  },
};


