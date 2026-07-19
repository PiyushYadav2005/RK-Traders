import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { adminApi, extractErrorMessage } from "@/admin/lib/adminApi";
import { PageHeader, AdminButton, Modal, EmptyState, LoadingRows } from "@/admin/components/ui";

interface AdminBrand {
  _id: string;
  name: string;
  logo?: string;
  description?: string;
}

const emptyForm = { name: "", logo: "", description: "" };

export function AdminBrands() {
  const [brands, setBrands] = useState<AdminBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await adminApi.get("/brands");
      setBrands(data.brands);
    } catch (err) {
      setError(extractErrorMessage(err, "Couldn't load brands — check the backend is running."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(b: AdminBrand) {
    setEditingId(b._id);
    setForm({ name: b.name, logo: b.logo ?? "", description: b.description ?? "" });
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    setFormError(null);
    try {
      if (editingId) {
        await adminApi.put(`/brands/${editingId}`, form);
      } else {
        await adminApi.post("/brands", form);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setFormError(extractErrorMessage(err, "Couldn't save brand"));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this brand?")) return;
    try {
      await adminApi.delete(`/brands/${id}`);
      load();
    } catch (err) {
      alert(extractErrorMessage(err, "Couldn't delete brand"));
    }
  }

  return (
    <div>
      <PageHeader
        title="Brands"
        action={
          <AdminButton onClick={openCreate}>
            <Plus size={16} /> Add Brand
          </AdminButton>
        }
      />

      <p className="mb-4 rounded-lg bg-surface p-3 text-xs text-slate">
        This list is for managing the brand catalogue shown on the site. Product records still
        store brand as free text (matching this list keeps things consistent, but isn't
        enforced by the database yet).
      </p>

      {error && <p className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</p>}
      {loading && !error && <LoadingRows />}
      {!loading && !error && brands.length === 0 && <EmptyState message="No brands yet." />}

      {!loading && brands.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((b) => (
            <div key={b._id} className="flex items-center gap-3 rounded-xl border border-line bg-white p-4">
              {b.logo && <img src={b.logo} alt="" className="h-10 w-10 shrink-0 rounded-lg object-contain" />}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-navy">{b.name}</p>
                {b.description && <p className="truncate text-xs text-slate-light">{b.description}</p>}
              </div>
              <div className="flex shrink-0 gap-1">
                <button onClick={() => openEdit(b)} className="rounded p-1.5 text-slate-light hover:bg-surface hover:text-navy">
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(b._id)} className="rounded p-1.5 text-slate-light hover:bg-red-50 hover:text-red-600">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Brand" : "Add Brand"}>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate">Name *</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-volt" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate">Logo URL</label>
            <input value={form.logo} onChange={(e) => setForm((f) => ({ ...f, logo: e.target.value }))} placeholder="https://... (Cloudinary upload not wired up yet)" className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-volt" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate">Description</label>
            <textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full resize-none rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-volt" />
          </div>

          {formError && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{formError}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <AdminButton variant="secondary" onClick={() => setModalOpen(false)}>Cancel</AdminButton>
            <AdminButton onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Brand"}
            </AdminButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
