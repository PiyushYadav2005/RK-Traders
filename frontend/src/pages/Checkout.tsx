import { useState, useEffect, useRef, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Phone,
  ArrowLeft,
  Banknote,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/CartContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import { business } from "@/config/business";
import { api } from "@/lib/api";

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

interface FormState {
  name: string;
  phone: string;
  email: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  notes: string;
  paymentMethod: "cod";
}

type FieldErrors = Partial<Record<keyof FormState | "items", string>>;

const initialForm: FormState = {
  name: "",
  phone: "",
  email: "",
  line1: "",
  city: "Lucknow",
  state: "Uttar Pradesh",
  pincode: "",
  notes: "",
  paymentMethod: "cod",
};

// ─── Success Popup ─────────────────────────────────────────────────────────────
function SuccessPopup({
  orderNumber,
  emailFailed,
  onContinue,
}: {
  orderNumber: string;
  emailFailed: boolean;
  onContinue: () => void;
}) {
  const [countdown, setCountdown] = useState(5);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current!);
          navigate("/products");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [navigate]);

  function handleContinue() {
    clearInterval(timerRef.current!);
    onContinue();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 px-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl"
      >
        {/* Animated check */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 350, damping: 20, delay: 0.1 }}
          className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100"
        >
          <CheckCircle2 size={44} className="text-emerald-500" />
        </motion.div>

        <h1 className="font-display text-2xl font-bold text-navy">
          Order Placed Successfully!
        </h1>
        <p className="mt-2 text-sm text-slate">
          Thank you for shopping with RK Traders. Your order has been received.
        </p>

        {/* Order ID */}
        <div className="my-5 rounded-2xl border border-line bg-surface px-6 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate">
            Your Order ID
          </p>
          <p className="mt-1 font-mono text-2xl font-bold tracking-wider text-volt">
            {orderNumber}
          </p>
          <p className="mt-2 text-xs text-slate">
            We'll contact you shortly to confirm delivery details.
          </p>
          <p className="mt-1 text-xs text-slate-light">
            Receipt will be sent after your order is delivered.
          </p>
        </div>

        {/* Email failed notice */}
        {emailFailed && (
          <div className="mb-4 rounded-lg bg-amber-50 px-4 py-2 text-xs text-amber-700">
            Order placed successfully. Email notification failed — our team will be informed via WhatsApp.
          </div>
        )}

        {/* Phone */}
        <div className="mb-5 flex items-center justify-center gap-2 text-sm text-slate">
          <Phone size={14} className="text-volt" />
          <span>
            Questions? Call{" "}
            <a href={`tel:${business.phone}`} className="font-semibold text-navy hover:text-volt">
              {business.phone}
            </a>
          </span>
        </div>

        <Button
          onClick={handleContinue}
          icon={<ShoppingBag size={16} />}
          className="w-full"
        >
          Continue Shopping
        </Button>

        {/* Countdown */}
        <p className="mt-4 text-xs text-slate-light">
          Redirecting to products in{" "}
          <span className="font-semibold text-navy">{countdown}s</span>…
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─── Field input component ─────────────────────────────────────────────────────
function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-navy">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}

// ─── Main Checkout ─────────────────────────────────────────────────────────────
export function Checkout() {
  const { lines, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(initialForm);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [emailFailed, setEmailFailed] = useState(false);

  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  usePageMeta({
    title: "Checkout | RK Traders",
    description: "Complete your order at RK Traders — delivery details and payment.",
  });

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    // Clear field error on change
    if (fieldErrors[key]) {
      setFieldErrors((e) => ({ ...e, [key]: undefined }));
    }
  }

  function validateLocally(): FieldErrors {
    const errors: FieldErrors = {};
    if (!form.name.trim()) errors.name = "Full name is required";
    if (!form.phone.trim()) {
      errors.phone = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(form.phone.trim())) {
      errors.phone = "Enter a valid 10-digit mobile number";
    }
    if (!form.line1.trim()) errors.line1 = "Address is required";
    if (!form.city.trim()) errors.city = "City is required";
    if (!form.state.trim()) errors.state = "State is required";
    if (!form.pincode.trim()) {
      errors.pincode = "Pincode is required";
    } else if (!/^[0-9]{6}$/.test(form.pincode.trim())) {
      errors.pincode = "Enter a valid 6-digit pincode";
    }
    return errors;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Client-side validation first (instant UX)
    const localErrors = validateLocally();
    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      // Scroll to first error
      const firstErrorEl = document.querySelector("[data-error]");
      firstErrorEl?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setStatus("submitting");
    setServerError(null);
    setFieldErrors({});

    try {
      const { data } = await api.post("/orders/guest", {
        customer: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || undefined,
        },
        shippingAddress: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          line1: form.line1.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
        },
        notes: form.notes.trim() || undefined,
        paymentMethod: form.paymentMethod,
        items: lines.map((l) => ({
          productId: l.productId,
          name: l.name,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
        })),
      });

      setOrderNumber(data.order?.orderNumber ?? null);
      // Check if business email notification failed
      setEmailFailed(data.notifications?.businessEmail?.sent === false);
      clear(); // clear cart after order saved
      setStatus("done");
    } catch (err: unknown) {
      const response = (err as { response?: { data?: { message?: string; errors?: FieldErrors } } })
        ?.response?.data;

      // If backend returned field-level errors, show them inline
      if (response?.errors) {
        setFieldErrors(response.errors);
      }
      setServerError(response?.message ?? "Couldn't place the order. Please try again.");
      setStatus("error");
    }
  }

  // Empty cart guard
  if (lines.length === 0 && status !== "done") {
    return (
      <Section className="min-h-[40vh] text-center">
        <p className="font-display text-xl font-semibold text-navy">Your cart is empty</p>
        <Button as="a" href="/products" className="mt-6">
          Explore Products
        </Button>
      </Section>
    );
  }

  const inputClass = (err?: string) =>
    `w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-volt ${
      err ? "border-red-400 bg-red-50/30" : "border-line"
    }`;

  return (
    <>
      {/* Success Popup Overlay */}
      <AnimatePresence>
        {status === "done" && orderNumber && (
          <SuccessPopup
            orderNumber={orderNumber}
            emailFailed={emailFailed}
            onContinue={() => navigate("/products")}
          />
        )}
      </AnimatePresence>

      <Section className="pt-12">
        <button
          onClick={() => navigate("/cart")}
          className="mb-6 flex items-center gap-1.5 text-sm text-slate hover:text-navy"
        >
          <ArrowLeft size={14} /> Back to cart
        </button>
        <Eyebrow>Checkout</Eyebrow>
        <h1 className="mb-8 font-display text-3xl font-bold tracking-tight">
          Delivery Details
        </h1>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_320px]">
          {/* ── Form ── */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-4 rounded-2xl border border-line bg-white p-6"
          >
            {/* Name + Phone */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full Name" required error={fieldErrors.name}>
                <input
                  data-error={fieldErrors.name ? true : undefined}
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="e.g. Piyush Yadav"
                  className={inputClass(fieldErrors.name)}
                />
              </Field>
              <Field label="Mobile Number" required error={fieldErrors.phone}>
                <input
                  data-error={fieldErrors.phone ? true : undefined}
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className={inputClass(fieldErrors.phone)}
                />
              </Field>
            </div>

            {/* Email */}
            <Field label="Email (optional)" error={fieldErrors.email}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="we'll send order confirmation here"
                className={inputClass(fieldErrors.email)}
              />
            </Field>

            {/* Address */}
            <Field label="Address" required error={fieldErrors.line1}>
              <input
                data-error={fieldErrors.line1 ? true : undefined}
                value={form.line1}
                onChange={(e) => update("line1", e.target.value)}
                placeholder="House no., street, landmark"
                className={inputClass(fieldErrors.line1)}
              />
            </Field>

            {/* City, State, Pincode */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="City" required error={fieldErrors.city}>
                <input
                  data-error={fieldErrors.city ? true : undefined}
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  className={inputClass(fieldErrors.city)}
                />
              </Field>
              <Field label="State" required error={fieldErrors.state}>
                <input
                  data-error={fieldErrors.state ? true : undefined}
                  value={form.state}
                  onChange={(e) => update("state", e.target.value)}
                  className={inputClass(fieldErrors.state)}
                />
              </Field>
              <Field label="Pincode" required error={fieldErrors.pincode}>
                <input
                  data-error={fieldErrors.pincode ? true : undefined}
                  value={form.pincode}
                  onChange={(e) => update("pincode", e.target.value)}
                  placeholder="6-digit pincode"
                  maxLength={6}
                  className={inputClass(fieldErrors.pincode)}
                />
              </Field>
            </div>

            {/* Notes */}
            <Field label="Order Notes (optional)">
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                placeholder="Preferred delivery time, special instructions, etc."
                className="w-full resize-none rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-volt"
              />
            </Field>

            {/* Payment Method */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy">
                Payment Method
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-volt bg-volt/5 px-4 py-2.5 text-sm font-medium text-volt">
                <Banknote size={16} />
                Cash on Delivery
              </div>
              <p className="mt-1.5 text-xs text-slate-light">
                Pay in cash when your order is delivered. Online payment coming soon.
              </p>
            </div>

            {/* Server error */}
            {status === "error" && serverError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {serverError} You can also call us at{" "}
                <a href={`tel:${business.phone}`} className="font-semibold underline">
                  {business.phone}
                </a>
                .
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "submitting"}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-volt px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(0,87,255,0.6)] transition-all hover:-translate-y-0.5 hover:bg-volt-dim disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Placing Order…
                </>
              ) : (
                `Place Order — ${formatINR(total)}`
              )}
            </button>
          </form>

          {/* ── Order Summary ── */}
          <div className="h-fit rounded-2xl border border-line bg-white p-6">
            <h2 className="mb-4 font-display text-sm font-semibold text-navy">
              Order Summary
            </h2>
            <ul className="mb-4 space-y-2 text-sm text-slate">
              {lines.map((l) => (
                <li key={l.productId} className="flex justify-between gap-2">
                  <span className="truncate">
                    {l.name} × {l.quantity}
                  </span>
                  <span className="shrink-0 font-mono">
                    {formatINR(l.unitPrice * l.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="space-y-2 border-t border-line pt-3 text-sm text-slate">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span className="font-mono">{formatINR(gst)}</span>
              </div>
            </div>
            <div className="mt-3 flex justify-between border-t border-line pt-3 font-display font-semibold text-navy">
              <span>Total</span>
              <span className="font-mono">{formatINR(total)}</span>
            </div>
          </div>
        </div>

        <Link
          to="/cart"
          className="mt-6 inline-block text-xs text-slate-light hover:text-slate"
        >
          Edit cart
        </Link>
      </Section>
    </>
  );
}
