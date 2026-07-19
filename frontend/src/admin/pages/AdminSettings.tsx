import { useEffect, useState } from "react";
import { adminApi, extractErrorMessage } from "@/admin/lib/adminApi";
import { PageHeader, AdminButton } from "@/admin/components/ui";

interface ShopSettings {
  shopName: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  gstNumber: string;
  logo: string;
  social: { instagram: string; facebook: string };
}

const empty: ShopSettings = {
  shopName: "",
  email: "",
  phone: "",
  whatsapp: "",
  address: "",
  gstNumber: "",
  logo: "",
  social: { instagram: "", facebook: "" },
};

export function AdminSettings() {
  const [form, setForm] = useState<ShopSettings>(empty);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminApi
      .get("/admin/settings")
      .then(({ data }) => setForm({ ...empty, ...data.settings }))
      .catch((err) => setError(extractErrorMessage(err, "Couldn't load settings — check the backend is running.")))
      .finally(() => setLoading(false));
  }, []);

  function update<K extends keyof ShopSettings>(key: K, value: ShopSettings[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await adminApi.put("/admin/settings", form);
      setSaved(true);
    } catch (err) {
      setError(extractErrorMessage(err, "Couldn't save settings"));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-slate">Loading settings...</p>;

  return (
    <div>
      <PageHeader title="Settings" />

      <div className="mb-4 rounded-lg bg-surface p-3 text-xs text-slate">
        These values are saved to the database and available via the API for future use. The
        public website currently reads shop details from a static config file
        (src/config/business.ts) rather than this collection — wiring the two together is a
        follow-up task, noted in the CHANGELOG.
      </div>

      <div className="max-w-xl space-y-4 rounded-xl border border-line bg-white p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate">Shop Name</label>
            <input value={form.shopName} onChange={(e) => update("shopName", e.target.value)} className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-volt" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate">GST Number</label>
            <input value={form.gstNumber} onChange={(e) => update("gstNumber", e.target.value)} className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-volt" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate">Email</label>
            <input value={form.email} onChange={(e) => update("email", e.target.value)} className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-volt" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate">Phone</label>
            <input value={form.phone} onChange={(e) => update("phone", e.target.value)} className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-volt" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate">WhatsApp Number</label>
            <input value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} placeholder="919999999999" className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-volt" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate">Logo URL</label>
            <input value={form.logo} onChange={(e) => update("logo", e.target.value)} placeholder="Cloudinary upload not wired up yet" className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-volt" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate">Address</label>
          <textarea rows={2} value={form.address} onChange={(e) => update("address", e.target.value)} className="w-full resize-none rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-volt" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate">Instagram URL</label>
            <input value={form.social.instagram} onChange={(e) => update("social", { ...form.social, instagram: e.target.value })} className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-volt" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate">Facebook URL</label>
            <input value={form.social.facebook} onChange={(e) => update("social", { ...form.social, facebook: e.target.value })} className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-volt" />
          </div>
        </div>

        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
        {saved && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">Saved.</p>}

        <AdminButton onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </AdminButton>
      </div>
    </div>
  );
}
