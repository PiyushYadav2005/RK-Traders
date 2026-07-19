import { useEffect, useState } from "react";
import {
  Package,
  ShoppingCart,
  IndianRupee,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { adminApi } from "@/admin/lib/adminApi";
import { PageHeader, LoadingRows, StatusBadge } from "@/admin/components/ui";

interface RecentOrder {
  _id: string;
  orderNumber: string;
  status: string;
  pricing: { total: number };
  shippingAddress: { name: string };
  createdAt: string;
  paymentMethod: string;
}

interface Summary {
  productCount: number;
  orderCount: number;
  pendingOrders: number;
  confirmedOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  todayOrders: number;
  quoteCount: number;
  newQuotes: number;
  wholesaleCount: number;
  customerCount: number;
  revenue: number;
  todayRevenue: number;
  recentOrders: RecentOrder[];
}

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function AdminDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .get("/admin/dashboard")
      .then(({ data }) => setSummary(data.summary))
      .catch(() =>
        setError("Couldn't load dashboard data — check the backend is running.")
      );
  }, []);

  const topCards = summary
    ? [
        { icon: Calendar, label: "Today's Orders", value: summary.todayOrders, color: "text-blue-500", bg: "bg-blue-50" },
        { icon: IndianRupee, label: "Today's Revenue", value: formatINR(summary.todayRevenue), color: "text-emerald-500", bg: "bg-emerald-50" },
        { icon: ShoppingCart, label: "Total Pending", value: summary.pendingOrders, color: "text-amber-500", bg: "bg-amber-50" },
      ]
    : [];

  const statsCards = summary
    ? [
        { icon: CheckCircle, label: "Completed Orders", value: summary.completedOrders },
        { icon: XCircle, label: "Cancelled Orders", value: summary.cancelledOrders },
        { icon: Package, label: "Active Products", value: summary.productCount },
        { icon: IndianRupee, label: "Total Revenue", value: formatINR(summary.revenue) },
      ]
    : [];

  return (
    <div>
      <PageHeader title="Dashboard" />

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </p>
      )}

      {!error && !summary && <LoadingRows />}

      {summary && (
        <div className="space-y-6">
          {/* Top Priority Metrics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {topCards.map((c) => (
              <div
                key={c.label}
                className="rounded-2xl border border-line bg-white p-5"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.bg} ${c.color}`}
                  >
                    <c.icon size={20} />
                  </span>
                  <div>
                    <p className="text-xs font-medium text-slate-light">{c.label}</p>
                    <p className="mt-0.5 font-display text-xl font-bold text-navy">
                      {c.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Recent Orders List */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-line bg-white">
                <div className="border-b border-line px-5 py-4">
                  <h2 className="font-display text-sm font-semibold text-navy">
                    Recent Orders
                  </h2>
                </div>
                <div className="divide-y divide-line">
                  {summary.recentOrders.length > 0 ? (
                    summary.recentOrders.map((o) => (
                      <div
                        key={o._id}
                        className="flex items-center justify-between px-5 py-3 hover:bg-surface"
                      >
                        <div>
                          <p className="font-mono text-sm font-semibold text-navy">
                            {o.orderNumber}
                          </p>
                          <p className="text-xs text-slate">
                            {o.shippingAddress.name} •{" "}
                            {new Date(o.createdAt).toLocaleDateString("en-IN")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-sm font-semibold text-navy">
                            {formatINR(o.pricing.total)}
                          </p>
                          <div className="mt-1">
                            <StatusBadge status={o.status} />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-5 text-center text-sm text-slate">
                      No orders yet.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Secondary Stats */}
            <div className="space-y-4">
              {statsCards.map((c) => (
                <div
                  key={c.label}
                  className="flex items-center justify-between rounded-xl border border-line bg-white p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-slate">
                      <c.icon size={16} />
                    </span>
                    <span className="text-sm font-medium text-slate">{c.label}</span>
                  </div>
                  <span className="font-display font-semibold text-navy">
                    {c.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
