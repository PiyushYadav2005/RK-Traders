import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { adminApi, extractErrorMessage } from "@/admin/lib/adminApi";
import { PageHeader, AdminButton, Modal, EmptyState, LoadingRows } from "@/admin/components/ui";

interface AdminCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  displayOrder: number;
  isActive: boolean;
}

const emptyForm = { name: "", description: "", image: "", displayOrder: "0" };

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function AdminCategories() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
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
      const { data } = await adminApi.get("/categories");
      setCategories(data.categories);
    } catch (err) {
      setError(extractErrorMessage(err, "Couldn't load categories — check the backend is running."));
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

  function openEdit(c: AdminCategory) {
    setEditingId(c._id);
    setForm({
      name: c.name,
      description: c.description ?? "",
      image: c.image ?? "",
      displayOrder: String(c.displayOrder ?? 0),
    });
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    setFormError(null);
    try {
      const payload = {
        name: form.name,
        slug: slugify(form.name),
        description: form.description,
        image: form.image,
        imageAlt: form.name,
        displayOrder: Number(form.displayOrder),
      };
      if (editingId) {
        await adminApi.put(`/categories/${editingId}`, payload);
      } else {
        await adminApi.post("/categories", payload);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setFormError(extractErrorMessage(err, "Couldn't save category"));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category? Products in it will remain but lose their category link.")) return;
    try {
      await adminApi.delete(`/categories/${id}`);
      load();
    } catch (err) {
      alert(extractErrorMessage(err, "Couldn't delete category"));
    }
  }

  return (
    <div>
      <PageHeader
        title="Categories"
        action={
          <AdminButton onClick={openCreate}>
            <Plus size={16} /> Add Category
          </AdminButton>
        }
      />

      {error && <p className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</p>}
      {loading && !error && <LoadingRows />}
      {!loading && !error && categories.length === 0 && <EmptyState message="No categories yet." />}

      {!loading && categories.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((c) => (
              <div key={c._id} className="flex items-center gap-3 rounded-xl border border-line bg-white p-4">
                {c.image && <img src={c.image} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-navy">{c.name}</p>
                  <p className="truncate text-xs text-slate-light">{c.description}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => openEdit(c)} className="rounded p-1.5 text-slate-light hover:bg-surface hover:text-navy">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(c._id)} className="rounded p-1.5 text-slate-light hover:bg-red-50 hover:text-red-600">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Category" : "Add Category"}>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate">Name *</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-volt" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate">Description</label>
            <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-volt" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate">Banner/Icon Image URL</label>
            <input value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} placeholder="https://... (Cloudinary upload not wired up yet)" className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-volt" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate">Display Order</label>
            <input type="number" value={form.displayOrder} onChange={(e) => setForm((f) => ({ ...f, displayOrder: e.target.value }))} className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-volt" />
          </div>

          {formError && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{formError}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <AdminButton variant="secondary" onClick={() => setModalOpen(false)}>Cancel</AdminButton>
            <AdminButton onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Category"}
            </AdminButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
