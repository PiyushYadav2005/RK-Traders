import { Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from "@/admin/lib/AdminAuthContext";
import { AdminLayout } from "@/admin/components/AdminLayout";
import { AdminLogin } from "@/admin/pages/AdminLogin";
import { AdminDashboard } from "@/admin/pages/AdminDashboard";
import { AdminProducts } from "@/admin/pages/AdminProducts";
import { AdminCategories } from "@/admin/pages/AdminCategories";
import { AdminBrands } from "@/admin/pages/AdminBrands";
import { AdminOrders } from "@/admin/pages/AdminOrders";
import { AdminQuotes } from "@/admin/pages/AdminQuotes";
import { AdminCustomers } from "@/admin/pages/AdminCustomers";
import { AdminSettings } from "@/admin/pages/AdminSettings";

export function AdminApp() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route
          path=""
          element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          }
        />
        <Route
          path="products"
          element={
            <AdminLayout>
              <AdminProducts />
            </AdminLayout>
          }
        />
        <Route
          path="categories"
          element={
            <AdminLayout>
              <AdminCategories />
            </AdminLayout>
          }
        />
        <Route
          path="brands"
          element={
            <AdminLayout>
              <AdminBrands />
            </AdminLayout>
          }
        />
        <Route
          path="orders"
          element={
            <AdminLayout>
              <AdminOrders />
            </AdminLayout>
          }
        />
        <Route
          path="quotes"
          element={
            <AdminLayout>
              <AdminQuotes />
            </AdminLayout>
          }
        />
        <Route
          path="customers"
          element={
            <AdminLayout>
              <AdminCustomers />
            </AdminLayout>
          }
        />
        <Route
          path="settings"
          element={
            <AdminLayout>
              <AdminSettings />
            </AdminLayout>
          }
        />
      </Routes>
    </AdminAuthProvider>
  );
}
