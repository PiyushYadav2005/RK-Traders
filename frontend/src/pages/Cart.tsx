import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/CartContext";
import { usePageMeta } from "@/hooks/usePageMeta";

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export function Cart() {
  const { lines, removeItem, setQuantity, subtotal } = useCart();
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  usePageMeta({
    title: "Your Cart | RK Traders",
    description: "Review your cart items and proceed to checkout at RK Traders.",
  });

  if (lines.length === 0) {
    return (
      <Section className="min-h-[50vh] text-center">
        <ShoppingBag size={40} className="mx-auto mb-4 text-slate-light" />
        <h1 className="font-display text-2xl font-bold text-navy">Your cart is empty</h1>
        <p className="mt-2 text-slate">Browse the catalogue and add something in.</p>
        <Button as="a" href="/products" className="mt-6">
          Explore Products
        </Button>
      </Section>
    );
  }

  return (
    <Section className="pt-12">
      <Eyebrow>{lines.length} item{lines.length !== 1 ? "s" : ""}</Eyebrow>
      <h1 className="mb-8 font-display text-3xl font-bold tracking-tight">Your Cart</h1>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_320px]">
        <div className="divide-y divide-line rounded-2xl border border-line bg-white">
          {lines.map((line) => (
            <div key={line.productId} className="p-4">
              <div className="flex items-start gap-4">
                <Link to={`/products/${line.slug}`} className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface sm:h-20 sm:w-20">
                  {line.image && <img src={line.image} alt={line.name} className="h-full w-full object-cover" />}
                </Link>
                <div className="min-w-0 flex-1">
                  <Link to={`/products/${line.slug}`} className="font-display text-sm font-semibold text-navy hover:text-volt">
                    {line.name}
                  </Link>
                  <p className="mt-1 font-mono text-sm text-slate">{formatINR(line.unitPrice)} / {line.unit}</p>
                </div>
                <button
                  onClick={() => removeItem(line.productId)}
                  className="shrink-0 text-slate-light hover:text-red-500 sm:hidden"
                  aria-label={`Remove ${line.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 pl-0 sm:mt-0 sm:pl-20">
                <div className="flex items-center rounded-full border border-line">
                  <button
                    onClick={() => setQuantity(line.productId, line.quantity - 1)}
                    className="flex h-8 w-8 items-center justify-center text-slate hover:text-navy"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-8 text-center font-mono text-sm">{line.quantity}</span>
                  <button
                    onClick={() => setQuantity(line.productId, line.quantity + 1)}
                    className="flex h-8 w-8 items-center justify-center text-slate hover:text-navy"
                    aria-label="Increase quantity"
                  >
                    <Plus size={13} />
                  </button>
                </div>
                <p className="font-mono text-sm font-semibold text-navy">
                  {formatINR(line.unitPrice * line.quantity)}
                </p>
                <button
                  onClick={() => removeItem(line.productId)}
                  className="hidden shrink-0 text-slate-light hover:text-red-500 sm:block"
                  aria-label={`Remove ${line.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-line bg-white p-6">
          <h2 className="mb-4 font-display text-sm font-semibold text-navy">Order Summary</h2>
          <div className="space-y-2 text-sm text-slate">
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
          <Button as="a" href="/checkout" className="mt-5 w-full">
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </Section>
  );
}
