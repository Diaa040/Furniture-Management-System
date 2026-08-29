import { api } from "./api";

export async function getCsrfCookie() {
  await api.get("/sanctum/csrf-cookie");
}

export async function login(email: string, password: string) {
  // await getCsrfCookie();
  
  const response = await api.post("/login", {
    email,
    password,
  });
  console.log(response)
  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get("/api/user");

  return response.data;
}

export async function logout() {
  await api.post("/api/logout");
}