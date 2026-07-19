import { useState, type FormEvent, type ReactNode } from "react";
import { CheckCircle2, Send, Info } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { usePageMeta } from "@/hooks/usePageMeta";
import { business } from "@/config/business";
import { api } from "@/lib/api";

type CustomerType = "dealer" | "contractor" | "retail" | "builder" | "architect" | "electrician";

interface WholesaleForm {
  customerName: string;
  companyName: string;
  gstNumber: string;
  phone: string;
  whatsapp: string;
  email: string;
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
  customerType: CustomerType;
  businessDescription: string;
  requiredProducts: string;
  bulkQuantity: string;
  expectedBudget: string;
  deliveryAddress: string;
  preferredDeliveryDate: string;
  additionalRequirements: string;
}

const customerTypes: { value: CustomerType; label: string }[] = [
  { value: "dealer", label: "Dealer" },
  { value: "contractor", label: "Contractor" },
  { value: "retail", label: "Retail" },
  { value: "builder", label: "Builder" },
  { value: "architect", label: "Architect" },
  { value: "electrician", label: "Electrician" },
];

const initialForm: WholesaleForm = {
  customerName: "",
  companyName: "",
  gstNumber: "",
  phone: "",
  whatsapp: "",
  email: "",
  addressLine1: "",
  city: "Lucknow",
  state: "Uttar Pradesh",
  pincode: "",
  customerType: "contractor",
  businessDescription: "",
  requiredProducts: "",
  bulkQuantity: "",
  expectedBudget: "",
  deliveryAddress: "",
  preferredDeliveryDate: "",
  additionalRequirements: "",
};

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-navy">
        {label} {required && <span className="text-volt">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-volt";

export function Wholesale() {
  const [form, setForm] = useState<WholesaleForm>(initialForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [requestNumber, setRequestNumber] = useState<string | null>(null);

  usePageMeta({
    title: "Wholesale Portal | RK Traders — Bulk Pricing & GST Billing",
    description: "Request wholesale pricing at RK Traders — bulk electrical supply for dealers, contractors, builders, and electricians in Lucknow. GST billing included.",
  });

  function update<K extends keyof WholesaleForm>(key: K, value: WholesaleForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const { data } = await api.post("/wholesale-requests", {
        customerName: form.customerName,
        companyName: form.companyName || undefined,
        gstNumber: form.gstNumber || undefined,
        phone: form.phone,
        whatsapp: form.whatsapp || undefined,
        email: form.email || undefined,
        address: {
          line1: form.addressLine1,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
        customerType: form.customerType,
        businessDescription: form.businessDescription || undefined,
        requiredProducts: form.requiredProducts,
        bulkQuantity: form.bulkQuantity || undefined,
        expectedBudget: form.expectedBudget || undefined,
        deliveryAddress: form.deliveryAddress || undefined,
        preferredDeliveryDate: form.preferredDeliveryDate || undefined,
        additionalRequirements: form.additionalRequirements || undefined,
      });
      setRequestNumber(data.request?.requestNumber ?? null);
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
          <h1 className="font-display text-2xl font-bold text-navy">Request received</h1>
          {requestNumber && <p className="mt-1 font-mono text-sm text-slate">Ref #{requestNumber}</p>}
          <p className="mt-4 text-sm leading-relaxed text-slate">
            Our wholesale desk will review your requirements and get back to you with a quotation,
            usually within one business day.
          </p>
          <Button as="a" href={`tel:${business.phone}`} className="mt-6">
            Call {business.phone} for urgent orders
          </Button>
        </div>
      </Section>
    );
  }

  return (
    <Section className="pt-12 md:pt-16">
      <Eyebrow>Wholesale</Eyebrow>
      <h1 className="max-w-xl font-display text-3xl font-bold tracking-tight md:text-4xl">
        Bulk pricing, GST billing, dedicated support
      </h1>
      <p className="mt-3 max-w-xl text-sm text-slate">
        Tell us what you need — dealer pricing, contractor supply, or a one-time bulk order —
        and our team will follow up with a quotation.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 max-w-3xl space-y-8">
        <div>
          <h2 className="mb-4 font-display text-sm font-semibold text-navy">Your Details</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Customer Name" required>
              <input required value={form.customerName} onChange={(e) => update("customerName", e.target.value)} className={inputClass} />
            </Field>
            <Field label="Company Name">
              <input value={form.companyName} onChange={(e) => update("companyName", e.target.value)} className={inputClass} />
            </Field>
            <Field label="GST Number">
              <input value={form.gstNumber} onChange={(e) => update("gstNumber", e.target.value.toUpperCase())} className={inputClass} />
            </Field>
            <Field label="Customer Type" required>
              <select required value={form.customerType} onChange={(e) => update("customerType", e.target.value as CustomerType)} className={inputClass}>
                {customerTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Phone" required>
              <input required type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} />
            </Field>
            <Field label="WhatsApp Number">
              <input type="tel" value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} className={inputClass} />
            </Field>
            <Field label="Email">
              <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} />
            </Field>
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-display text-sm font-semibold text-navy">Address</h2>
          <div className="grid grid-cols-1 gap-4">
            <Field label="Address" required>
              <input required value={form.addressLine1} onChange={(e) => update("addressLine1", e.target.value)} className={inputClass} />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="City" required>
                <input required value={form.city} onChange={(e) => update("city", e.target.value)} className={inputClass} />
              </Field>
              <Field label="State" required>
                <input required value={form.state} onChange={(e) => update("state", e.target.value)} className={inputClass} />
              </Field>
              <Field label="PIN" required>
                <input required pattern="[0-9]{6}" value={form.pincode} onChange={(e) => update("pincode", e.target.value)} className={inputClass} />
              </Field>
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-display text-sm font-semibold text-navy">Order Requirements</h2>
          <div className="space-y-4">
            <Field label="Business Description">
              <textarea rows={2} value={form.businessDescription} onChange={(e) => update("businessDescription", e.target.value)} placeholder="What does your business do?" className={`${inputClass} resize-none`} />
            </Field>
            <Field label="Required Products" required>
              <textarea required rows={3} value={form.requiredProducts} onChange={(e) => update("requiredProducts", e.target.value)} placeholder="List products, brands, and specifications you need" className={`${inputClass} resize-none`} />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Bulk Quantity">
                <input value={form.bulkQuantity} onChange={(e) => update("bulkQuantity", e.target.value)} placeholder="e.g. 500 units" className={inputClass} />
              </Field>
              <Field label="Expected Budget">
                <input value={form.expectedBudget} onChange={(e) => update("expectedBudget", e.target.value)} placeholder="e.g. ₹50,000 – ₹1,00,000" className={inputClass} />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Delivery Address">
                <input value={form.deliveryAddress} onChange={(e) => update("deliveryAddress", e.target.value)} placeholder="If different from above" className={inputClass} />
              </Field>
              <Field label="Preferred Delivery Date">
                <input type="date" value={form.preferredDeliveryDate} onChange={(e) => update("preferredDeliveryDate", e.target.value)} className={inputClass} />
              </Field>
            </div>
            <Field label="Additional Requirements">
              <textarea rows={2} value={form.additionalRequirements} onChange={(e) => update("additionalRequirements", e.target.value)} className={`${inputClass} resize-none`} />
            </Field>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-xl border border-line bg-surface p-4 text-xs text-slate">
          <Info size={15} className="mt-0.5 shrink-0" />
          <p>
            BOQ / PDF / Excel upload isn't wired up yet — it needs a Cloudinary account for file
            storage. Email your document to {business.email} referencing your name, or attach it
            on WhatsApp after submitting this form.
          </p>
        </div>

        {status === "error" && (
          <p className="text-sm text-red-500">
            Couldn't submit — check the backend is running, or call us directly at {business.phone}.
          </p>
        )}

        <Button type="submit" disabled={status === "submitting"} icon={<Send size={16} />}>
          {status === "submitting" ? "Submitting..." : "Submit Wholesale Request"}
        </Button>
      </form>
    </Section>
  );
}
