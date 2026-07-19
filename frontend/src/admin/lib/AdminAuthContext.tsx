import { createContext, useContext, useState, type ReactNode } from "react";
import { adminApi, adminSession, extractErrorMessage } from "@/admin/lib/adminApi";

interface AdminAuthContextValue {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(adminSession.get()));

  async function login(username: string, password: string) {
    try {
      const { data } = await adminApi.post("/admin/auth/login", { username, password });
      adminSession.set(data.token);
      setIsAuthenticated(true);
    } catch (err) {
      throw new Error(extractErrorMessage(err, "Login failed"));
    }
  }

  function logout() {
    adminSession.clear();
    setIsAuthenticated(false);
  }

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
