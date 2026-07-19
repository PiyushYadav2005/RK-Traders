import { type ReactNode } from "react";
import { Navigate, NavLink } from "react-router-dom";
import {
  LayoutDashboard, Package, FolderTree, Tag, ShoppingCart, FileText, Users, Settings, LogOut, Zap,
} from "lucide-react";
import { useAdminAuth } from "@/admin/lib/AdminAuthContext";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/brands", label: "Brands", icon: Tag },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/quotes", label: "Quotes", icon: FileText },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, logout } = useAdminAuth();

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="flex w-60 shrink-0 flex-col border-r border-line bg-white">
        <div className="flex items-center gap-2 border-b border-line px-5 py-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-volt text-white">
            <Zap size={16} strokeWidth={2.5} />
          </span>
          <div>
            <p className="font-display text-sm font-bold text-navy">RK Traders</p>
            <p className="text-[10px] text-slate-light">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-volt/10 text-volt" : "text-slate hover:bg-surface hover:text-navy"
                }`
              }
            >
              <item.icon size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-line p-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden p-6 md:p-8">{children}</main>
    </div>
  );
}
