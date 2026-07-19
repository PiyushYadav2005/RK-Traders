import axios from "axios";

const ADMIN_TOKEN_KEY = "rk_admin_token";

export const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

adminApi.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Session token intentionally lives in sessionStorage (not localStorage) so
// it clears when the browser tab closes — reasonable for a shop-owner admin
// panel used on a shared/shop computer.
export const adminSession = {
  get: () => sessionStorage.getItem(ADMIN_TOKEN_KEY),
  set: (token: string) => sessionStorage.setItem(ADMIN_TOKEN_KEY, token),
  clear: () => sessionStorage.removeItem(ADMIN_TOKEN_KEY),
};

export function extractErrorMessage(err: unknown, fallback: string): string {
  const message = (err as { response?: { data?: { message?: string } } })?.response?.data
    ?.message;
  return message ?? fallback;
}
