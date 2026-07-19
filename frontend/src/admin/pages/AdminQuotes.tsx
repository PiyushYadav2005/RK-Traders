import { useEffect, useState, useCallback } from "react";
import { adminApi, extractErrorMessage } from "@/admin/lib/adminApi";
import { PageHeader, StatusBadge, EmptyState, LoadingRows } from "@/admin/components/ui";

interface AdminQuote {
  _id: string;
  quoteNumber: string;
  fullName: string;
  phone: string;
  email?: string;
  requiredProducts: string;
  productCategory?: string;
  quantity?: string;
  budget?: string;
  status: string;
  createdAt: string;
}

const statuses = ["new", "reviewing", "quoted", "closed"];

export function AdminQuotes() {
  const [quotes, setQuotes] = useState<AdminQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await adminApi.get("/quote-requests");
      setQuotes(data.quotes);
    } catch (err) {
      setError(extractErrorMessage(err, "Couldn't load quotes — check the backend is running."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(id: string, status: string) {
    try {
      await adminApi.patch(`/quote-requests/${id}/status`, { status });
      load();
    } catch (err) {
      alert(extractErrorMessage(err, "Couldn't update status"));
    }
  }

  return (
    <div>
      <PageHeader title="Quote Requests" />

      {error && <p className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</p>}
      {loading && !error && <LoadingRows />}
      {!loading && !error && quotes.length === 0 && <EmptyState message="No quote requests yet." />}

      {!loading && quotes.length > 0 && (
        <div className="space-y-3">
          {quotes.map((q) => (
            <div key={q._id} className="rounded-xl border border-line bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-slate-light">{q.quoteNumber} · {new Date(q.createdAt).toLocaleDateString("en-IN")}</p>
                  <p className="font-display text-sm font-semibold text-navy">{q.fullName}</p>
                  <p className="text-xs text-slate">{q.phone} {q.email && `· ${q.email}`}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={q.status} />
                  <select
                    value={q.status}
                    onChange={(e) => updateStatus(q._id, e.target.value)}
                    className="rounded-lg border border-line px-2 py-1 text-xs outline-none focus:border-volt"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate">{q.requiredProducts}</p>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-light">
                {q.productCategory && <span>Category: {q.productCategory}</span>}
                {q.quantity && <span>Qty: {q.quantity}</span>}
                {q.budget && <span>Budget: {q.budget}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
