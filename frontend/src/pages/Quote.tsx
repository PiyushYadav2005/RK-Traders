import { useState, type FormEvent, type ReactNode } from "react";
import { CheckCircle2, Send, FileSearch, MessageSquareText, PackageCheck, ShieldCheck, Clock, Info } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { usePageMeta } from "@/hooks/usePageMeta";
import { business } from "@/config/business";
import { productCategories } from "@/data/productCategories";
import { brands } from "@/config/business";
import { api } from "@/lib/api";

interface QuoteForm {
  fullName: string;
  company: string;
  phone: string;
  email: string;
  gstNumber: string;
  address: string;
  projectType: string;
  productCategory: string;
  brand: string;
  requiredProducts: string;
  quantity: string;
  budget: string;
  preferredDelivery: string;
  message: string;
}

const initialForm: QuoteForm = {
  fullName: "",
  company: "",
  phone: "",
  email: "",
  gstNumber: "",
  address: "",
  projectType: "",
  productCategory: "",
  brand: "",
  requiredProducts: "",
  quantity: "",
  budget: "",
  preferredDelivery: "",
  message: "",
};

const benefits = [
  { icon: ShieldCheck, title: "Genuine stock, best rates", body: "Direct distributor pricing — the same we'd quote a walk-in dealer." },
  { icon: Clock, title: "Same-day response", body: "Quotes typically go out within one business day." },
  { icon: PackageCheck, title: "No minimum order", body: "One product or a full site list — every quote gets the same attention." },
];

const process = [
  { icon: FileSearch, title: "Tell us what you need", body: "Fill the form with products, quantities, and any budget in mind." },
  { icon: MessageSquareText, title: "We review & price it", body: "Our team checks stock and puts together the best rate we can offer." },
  { icon: Send, title: "Quote lands in your inbox", body: "You'll get pricing by email or WhatsApp, whichever you prefer." },
];

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-navy">
        {label} {required && <span className="text-volt">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass = "w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-volt";

export function Quote() {
  const [form, setForm] = useState<QuoteForm>(initialForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [quoteNumber, setQuoteNumber] = useState<string | null>(null);

  usePageMeta({
    title: "Get a Quote | RK Traders — Electrical Products Quotation",
    description: "Request a free quotation from RK Traders — pricing for electrical products, project supplies, and bulk orders. Same-day response guaranteed.",
  });

  function update<K extends keyof QuoteForm>(key: K, value: QuoteForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const { data } = await api.post("/quote-requests", {
        fullName: form.fullName,
        company: form.company || undefined,
        phone: form.phone,
        email: form.email || undefined,
        gstNumber: form.gstNumber || undefined,
        address: form.address || undefined,
        projectType: form.projectType || undefined,
        productCategory: form.productCategory || undefined,
        brand: form.brand || undefined,
        requiredProducts: form.requiredProducts,
        quantity: form.quantity || undefined,
        budget: form.budget || undefined,
        preferredDelivery: form.preferredDelivery || undefined,
        message: form.message || undefined,
      });
      setQuoteNumber(data.quote?.quoteNumber ?? null);
      setStatus("done");
      setForm(initialForm);
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <Section className="pt-16 text-center">
        <div className="mx-auto max-w-md rounded-2xl border border-line bg-white p-8">
          <CheckCircle2 size={44} className="mx-auto mb-4 text-emerald-500" />
          <h1 className="font-display text-2xl font-bold text-navy">Quote request sent</h1>
          {quoteNumber && <p className="mt-1 font-mono text-sm text-slate">Ref #{quoteNumber}</p>}
          <p className="mt-4 text-sm leading-relaxed text-slate">
            We'll review your requirements and send pricing within one business day.
          </p>
          <Button as="a" href={`tel:${business.phone}`} className="mt-6">
            Call {business.phone} for urgent quotes
          </Button>
        </div>
      </Section>
    );
  }

  return (
    <>
      <div className="bg-navy px-6 pt-16 pb-16 text-white md:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Get a Quote</Eyebrow>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-5xl">
            Tell us what you need. We'll price it fast.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            From a single fixture to a full project's material list — get real pricing from RK
            Traders, not a runaround.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <b.icon size={18} className="text-live" />
              <h3 className="mt-3 font-display text-sm font-semibold text-white">{b.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-white/60">{b.body}</p>
            </div>
          ))}
        </div>
      </div>

      <Section>
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {process.map((p, i) => (
            <div key={p.title} className="relative rounded-2xl border border-line bg-white p-6">
              <span className="font-mono text-xs text-slate-light">STEP {i + 1}</span>
              <span className="mt-2 flex h-10 w-10 items-center justify-center rounded-lg bg-volt/10 text-volt">
                <p.icon size={18} />
              </span>
              <h3 className="mt-4 font-display text-sm font-semibold text-navy">{p.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-white p-6 md:p-8">
          <h2 className="mb-6 font-display text-xl font-bold text-navy">Quote Request Form</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full Name" required>
                <input required value={form.fullName} onChange={(e) => update("fullName", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Company">
                <input value={form.company} onChange={(e) => update("company", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Phone" required>
                <input required type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Email">
                <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} />
              </Field>
              <Field label="GST Number">
                <input value={form.gstNumber} onChange={(e) => update("gstNumber", e.target.value.toUpperCase())} className={inputClass} />
              </Field>
              <Field label="Address">
                <input value={form.address} onChange={(e) => update("address", e.target.value)} className={inputClass} />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Project Type">
                <select value={form.projectType} onChange={(e) => update("projectType", e.target.value)} className={inputClass}>
                  <option value="">Select</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                  <option value="one-time-purchase">One-time Purchase</option>
                </select>
              </Field>
              <Field label="Product Category">
                <select value={form.productCategory} onChange={(e) => update("productCategory", e.target.value)} className={inputClass}>
                  <option value="">Select</option>
                  {productCategories.map((c) => (
                    <option key={c.slug} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Preferred Brand">
                <select value={form.brand} onChange={(e) => update("brand", e.target.value)} className={inputClass}>
                  <option value="">No preference</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Required Products" required>
              <textarea required rows={3} value={form.requiredProducts} onChange={(e) => update("requiredProducts", e.target.value)} placeholder="List products, specs, and anything else relevant" className={`${inputClass} resize-none`} />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Quantity">
                <input value={form.quantity} onChange={(e) => update("quantity", e.target.value)} placeholder="e.g. 200 units" className={inputClass} />
              </Field>
              <Field label="Budget">
                <input value={form.budget} onChange={(e) => update("budget", e.target.value)} placeholder="e.g. ₹25,000" className={inputClass} />
              </Field>
              <Field label="Preferred Delivery">
                <input type="date" value={form.preferredDelivery} onChange={(e) => update("preferredDelivery", e.target.value)} className={inputClass} />
              </Field>
            </div>

            <Field label="Message">
              <textarea rows={2} value={form.message} onChange={(e) => update("message", e.target.value)} className={`${inputClass} resize-none`} />
            </Field>

            <div className="flex items-start gap-2 rounded-xl border border-line bg-surface p-4 text-xs text-slate">
              <Info size={15} className="mt-0.5 shrink-0" />
              <p>
                File upload isn't wired up yet — it needs a Cloudinary account for storage. Email
                any drawings or lists to {business.email} referencing your name.
              </p>
            </div>

            {status === "error" && (
              <p className="text-sm text-red-500">
                Couldn't submit — check the backend is running, or call us directly at {business.phone}.
              </p>
            )}

            <Button type="submit" disabled={status === "submitting"} icon={<Send size={16} />} className="w-full">
              {status === "submitting" ? "Submitting..." : "Request Quote"}
            </Button>
          </form>
        </div>
      </Section>
    </>
  );
}
