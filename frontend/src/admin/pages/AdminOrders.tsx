import { useEffect, useState, useCallback } from "react";
import { Printer, X } from "lucide-react";
import { adminApi, extractErrorMessage } from "@/admin/lib/adminApi";
import { PageHeader, StatusBadge, EmptyState, LoadingRows, Modal } from "@/admin/components/ui";

interface OrderItem { name: string; sku: string; unitPrice: number; quantity: number; lineTotal: number }
interface AdminOrder {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  pricing: { subtotal: number; gstAmount: number; total: number };
  shippingAddress: { name: string; phone: string; line1: string; city: string; state: string; pincode: string };
  paymentMethod: string;
  status: string;
  createdAt: string;
}

const statuses = ["placed", "confirmed", "packed", "shipped", "delivered", "cancelled"];

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [viewing, setViewing] = useState<AdminOrder | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await adminApi.get("/orders", {
        params: filter !== "all" ? { status: filter } : undefined,
      });
      setOrders(data.orders);
    } catch (err) {
      setError(extractErrorMessage(err, "Couldn't load orders — check the backend is running."));
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(id: string, status: string) {
    try {
      await adminApi.patch(`/orders/${id}/status`, { status });
      load();
      if (viewing?._id === id) setViewing((v) => (v ? { ...v, status } : v));
    } catch (err) {
      alert(extractErrorMessage(err, "Couldn't update order status"));
    }
  }

  return (
    <div>
      <PageHeader title="Orders" />

      <div className="mb-4 flex flex-wrap gap-2">
        {["all", ...statuses].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
              filter === s ? "bg-navy text-white" : "border border-line text-slate hover:border-navy"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</p>}
      {loading && !error && <LoadingRows />}
      {!loading && !error && orders.length === 0 && <EmptyState message="No orders match this filter." />}

      {!loading && orders.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-surface text-xs uppercase tracking-wide text-slate-light">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orders.map((o) => (
                <tr key={o._id}>
                  <td className="px-4 py-3 font-mono text-xs text-navy">{o.orderNumber}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-navy">{o.shippingAddress.name}</p>
                    <p className="text-xs text-slate-light">{o.shippingAddress.phone}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-navy">{formatINR(o.pricing.total)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                      className="rounded-lg border border-line px-2 py-1 text-xs outline-none focus:border-volt"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate">{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setViewing(o)} className="text-xs font-semibold text-volt hover:underline">
                      View / Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={`Order ${viewing?.orderNumber ?? ""}`}>
        {viewing && (
          <div>
            <div id="invoice-print" className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display text-lg font-bold text-navy">RK Traders</p>
                  <p className="text-xs text-slate">Invoice — {viewing.orderNumber}</p>
                  <p className="text-xs text-slate">{new Date(viewing.createdAt).toLocaleString("en-IN")}</p>
                </div>
                <StatusBadge status={viewing.status} />
              </div>

              <div className="rounded-lg bg-surface p-3 text-sm">
                <p className="font-semibold text-navy">{viewing.shippingAddress.name}</p>
                <p className="text-slate">{viewing.shippingAddress.phone}</p>
                <p className="text-slate">
                  {viewing.shippingAddress.line1}, {viewing.shippingAddress.city},{" "}
                  {viewing.shippingAddress.state} {viewing.shippingAddress.pincode}
                </p>
              </div>

              <table className="w-full text-left text-sm">
                <thead className="border-b border-line text-xs uppercase text-slate-light">
                  <tr>
                    <th className="py-2">Item</th>
                    <th className="py-2">Qty</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {viewing.items.map((i) => (
                    <tr key={i.sku}>
                      <td className="py-2">{i.name}</td>
                      <td className="py-2">{i.quantity}</td>
                      <td className="py-2 text-right font-mono">{formatINR(i.lineTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="ml-auto max-w-[200px] space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-slate">Subtotal</span><span className="font-mono">{formatINR(viewing.pricing.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-slate">GST</span><span className="font-mono">{formatINR(viewing.pricing.gstAmount)}</span></div>
                <div className="flex justify-between border-t border-line pt-1 font-semibold text-navy"><span>Total</span><span className="font-mono">{formatINR(viewing.pricing.total)}</span></div>
              </div>

              <p className="text-xs text-slate-light">Payment: {viewing.paymentMethod.toUpperCase()}</p>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setViewing(null)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line px-4 py-2 text-sm font-semibold text-navy hover:border-volt"
              >
                <X size={15} /> Close
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-volt px-4 py-2 text-sm font-semibold text-white hover:bg-volt-dim"
              >
                <Printer size={15} /> Print / Save PDF
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
