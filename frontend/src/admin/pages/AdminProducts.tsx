import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Copy, Eye, EyeOff, Star, ChevronDown, ChevronUp } from "lucide-react";
import { adminApi, extractErrorMessage } from "@/admin/lib/adminApi";
import { PageHeader, AdminButton, Modal, EmptyState, LoadingRows } from "@/admin/components/ui";

interface CategoryOption {
  _id: string;
  name: string;
  slug: string;
}
interface AdminProduct {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  category: CategoryOption | string;
  description: string;
  images: { url: string; alt: string }[];
  pricing: {
    retailPrice: number;
    wholesalePrice: number;
    minWholesaleQty: number;
    mrp?: number;
    gstPercent: number;
  };
  stock: { quantity: number; unit: string };
  isFeatured: boolean;
  isActive: boolean;
}

const emptyForm = {
  name: "",
  sku: "",
  brand: "",
  category: "",
  description: "",
  imageUrl: "",
  retailPrice: "",
  wholesalePrice: "",
  minWholesaleQty: "",
  mrp: "",
  gstPercent: "18",
  stockQuantity: "0",
  stockUnit: "pcs",
  isFeatured: false,
  isActive: true,
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function AdminProducts() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showAdvancedPricing, setShowAdvancedPricing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodRes, catRes] = await Promise.all([
        adminApi.get("/products", { params: { limit: 100 } }),
        adminApi.get("/categories"),
      ]);
      setProducts(prodRes.data.products);
      setCategories(catRes.data.categories);
    } catch (err) {
      setError(extractErrorMessage(err, "Couldn't load products — check the backend is running."));
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
    setShowAdvancedPricing(false);
    setModalOpen(true);
  }

  function openEdit(p: AdminProduct) {
    setEditingId(p._id);
    setForm({
      name: p.name,
      sku: p.sku,
      brand: p.brand,
      category: typeof p.category === "string" ? p.category : p.category._id,
      description: p.description,
      imageUrl: p.images[0]?.url ?? "",
      retailPrice: String(p.pricing.retailPrice),
      wholesalePrice: p.pricing.wholesalePrice ? String(p.pricing.wholesalePrice) : "",
      minWholesaleQty: p.pricing.minWholesaleQty ? String(p.pricing.minWholesaleQty) : "",
      mrp: p.pricing.mrp ? String(p.pricing.mrp) : "",
      gstPercent: String(p.pricing.gstPercent),
      stockQuantity: String(p.stock.quantity),
      stockUnit: p.stock.unit,
      isFeatured: p.isFeatured,
      isActive: p.isActive,
    });
    setFormError(null);
    
    // Auto-open advanced pricing if any optional field was previously filled
    if (p.pricing.wholesalePrice || p.pricing.mrp) {
      setShowAdvancedPricing(true);
    } else {
      setShowAdvancedPricing(false);
    }
    
    setModalOpen(true);
  }

  function openDuplicate(p: AdminProduct) {
    openEdit(p);
    setEditingId(null); // duplicate = create new with prefilled fields
    setForm((f) => ({ ...f, name: `${f.name} (Copy)`, sku: `${f.sku}-COPY` }));
  }

  async function handleSave() {
    setSaving(true);
    setFormError(null);
    try {
      const payload = {
        name: form.name,
        slug: slugify(form.name),
        sku: form.sku,
        brand: form.brand,
        category: form.category,
        description: form.description,
        shortDescription: form.description.slice(0, 100),
        images: form.imageUrl ? [{ url: form.imageUrl, alt: form.name }] : [],
        pricing: {
          retailPrice: Number(form.retailPrice),
          wholesalePrice: form.wholesalePrice ? Number(form.wholesalePrice) : Number(form.retailPrice), // fallback to retail
          minWholesaleQty: form.minWholesaleQty ? Number(form.minWholesaleQty) : 50,
          mrp: form.mrp ? Number(form.mrp) : undefined,
          gstPercent: Number(form.gstPercent),
        },
        stock: { quantity: Number(form.stockQuantity), unit: form.stockUnit },
        isFeatured: form.isFeatured,
        isActive: form.isActive,
      };

      if (editingId) {
        await adminApi.put(`/products/${editingId}`, payload);
      } else {
        await adminApi.post("/products", payload);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setFormError(extractErrorMessage(err, "Couldn't save product"));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this product? This can't be undone.")) return;
    try {
      await adminApi.delete(`/products/${id}`);
      load();
    } catch (err) {
      alert(extractErrorMessage(err, "Couldn't delete product"));
    }
  }

  async function toggleVisibility(p: AdminProduct) {
    try {
      await adminApi.put(`/products/${p._id}`, { isActive: !p.isActive });
      load();
    } catch (err) {
      alert(extractErrorMessage(err, "Couldn't update visibility"));
    }
  }

  async function toggleFeatured(p: AdminProduct) {
    try {
      await adminApi.put(`/products/${p._id}`, { isFeatured: !p.isFeatured });
      load();
    } catch (err) {
      alert(extractErrorMessage(err, "Couldn't update"));
    }
  }

  return (
    <div>
      <PageHeader
        title="Products"
        action={
          <AdminButton onClick={openCreate}>
            <Plus size={16} /> Add Product
          </AdminButton>
        }
      />

      {error && <p className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</p>}
      {loading && !error && <LoadingRows />}

      {!loading && !error && products.length === 0 && (
        <EmptyState message="No products yet. Add one, or run the backend seed script." />
      )}

      {!loading && products.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-surface text-xs uppercase tracking-wide text-slate-light">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {products.map((p) => (
                <tr key={p._id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images[0]?.url}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-navy">{p.name}</p>
                        <p className="text-xs text-slate-light">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate">{p.sku}</td>
                  <td className="px-4 py-3 font-mono text-xs text-navy">₹{p.pricing.retailPrice}</td>
                  <td className="px-4 py-3 text-xs text-slate">
                    {p.stock.quantity} {p.stock.unit}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                        p.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {p.isActive ? "Visible" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => toggleFeatured(p)}
                        title="Toggle featured"
                        className={`rounded p-1.5 hover:bg-surface ${
                          p.isFeatured ? "text-live-dim" : "text-slate-light"
                        }`}
                      >
                        <Star size={15} fill={p.isFeatured ? "currentColor" : "none"} />
                      </button>
                      <button
                        onClick={() => toggleVisibility(p)}
                        title="Toggle visibility"
                        className="rounded p-1.5 text-slate-light hover:bg-surface hover:text-navy"
                      >
                        {p.isActive ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                      <button
                        onClick={() => openDuplicate(p)}
                        title="Duplicate"
                        className="rounded p-1.5 text-slate-light hover:bg-surface hover:text-navy"
                      >
                        <Copy size={15} />
                      </button>
                      <button
                        onClick={() => openEdit(p)}
                        title="Edit"
                        className="rounded p-1.5 text-slate-light hover:bg-surface hover:text-navy"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        title="Delete"
                        className="rounded p-1.5 text-slate-light hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Product" : "Add Product"}
      >
        <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate">Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-volt"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate">SKU *</label>
              <input
                value={form.sku}
                onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-volt"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate">Brand *</label>
              <input
                value={form.brand}
                onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-volt"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-volt"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate">Image URL</label>
            <input
              value={form.imageUrl}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
              placeholder="https://... (Cloudinary upload not wired up yet)"
              className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-volt"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate">Description *</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full resize-none rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-volt"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate">Selling Price *</label>
              <input
                type="number"
                value={form.retailPrice}
                onChange={(e) => setForm((f) => ({ ...f, retailPrice: e.target.value }))}
                className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-volt"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate">Stock Qty *</label>
              <input
                type="number"
                value={form.stockQuantity}
                onChange={(e) => setForm((f) => ({ ...f, stockQuantity: e.target.value }))}
                className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-volt"
              />
            </div>
          </div>

          {/* Optional Advanced Pricing section */}
          <div className="rounded-lg border border-line p-3">
            <button
              type="button"
              onClick={() => setShowAdvancedPricing(!showAdvancedPricing)}
              className="flex w-full items-center justify-between text-sm font-medium text-navy"
            >
              <span>Advanced Pricing (Optional)</span>
              {showAdvancedPricing ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showAdvancedPricing && (
              <div className="mt-3 grid grid-cols-3 gap-3 border-t border-line pt-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate">MRP</label>
                  <input
                    type="number"
                    value={form.mrp}
                    onChange={(e) => setForm((f) => ({ ...f, mrp: e.target.value }))}
                    className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-volt"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate">GST %</label>
                  <input
                    type="number"
                    value={form.gstPercent}
                    onChange={(e) => setForm((f) => ({ ...f, gstPercent: e.target.value }))}
                    className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-volt"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate">Wholesale Price</label>
                  <input
                    type="number"
                    value={form.wholesalePrice}
                    onChange={(e) => setForm((f) => ({ ...f, wholesalePrice: e.target.value }))}
                    className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-volt"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-navy">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                className="h-4 w-4 accent-volt"
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-navy">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                className="h-4 w-4 accent-volt"
              />
              Visible on site
            </label>
          </div>

          {formError && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{formError}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <AdminButton variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Product"}
            </AdminButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
