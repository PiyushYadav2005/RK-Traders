import { useEffect, useState } from "react";
import { adminApi, extractErrorMessage } from "@/admin/lib/adminApi";
import { PageHeader, EmptyState, LoadingRows } from "@/admin/components/ui";

interface AdminCustomer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: string;
}

export function AdminCustomers() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .get("/admin/customers")
      .then(({ data }) => setCustomers(data.customers))
      .catch((err) => setError(extractErrorMessage(err, "Couldn't load customers — check the backend is running.")))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="Customers" />

      {error && <p className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</p>}
      {loading && !error && <LoadingRows />}
      {!loading && !error && customers.length === 0 && (
        <EmptyState message="No customers yet — accounts are created automatically the first time someone checks out." />
      )}

      {!loading && customers.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-surface text-xs uppercase tracking-wide text-slate-light">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {customers.map((c) => (
                <tr key={c._id}>
                  <td className="px-4 py-3 font-medium text-navy">{c.name}</td>
                  <td className="px-4 py-3 text-slate">{c.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-slate">{c.email}</td>
                  <td className="px-4 py-3 capitalize text-slate">{c.role}</td>
                  <td className="px-4 py-3 text-xs text-slate-light">
                    {new Date(c.createdAt).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
