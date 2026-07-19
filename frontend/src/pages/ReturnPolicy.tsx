import { ShieldCheck, RotateCcw, PackageX, AlertTriangle, Clock, Phone } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { usePageMeta } from "@/hooks/usePageMeta";
import { business } from "@/config/business";

const sections = [
  {
    icon: RotateCcw,
    title: "Replacement Window",
    body: "Unused, unopened items in original packaging can be exchanged within 7 days of purchase, with the original bill. This applies to retail counter purchases and delivered orders alike.",
  },
  {
    icon: PackageX,
    title: "Damaged or Wrong Item Received",
    body: "If a delivered item arrives damaged or doesn't match what you ordered, contact us within 48 hours of delivery with photos of the item and packaging. We'll arrange a free replacement or refund — no questions asked.",
  },
  {
    icon: ShieldCheck,
    title: "Manufacturer Warranty",
    body: "Most electrical goods we stock (Havells, Anchor, Philips, Polycab and others) carry a manufacturer warranty ranging from 6 months to 2 years depending on the product. Warranty claims are routed through the brand's official service process — we'll help you file the claim.",
  },
  {
    icon: AlertTriangle,
    title: "What Can't Be Returned",
    body: "Cut wire/cable (sold by length), custom or special-order items, and products with signs of installation or use cannot be returned unless found defective.",
  },
  {
    icon: Clock,
    title: "Refund Timeline",
    body: "Approved refunds are processed within 5–7 business days to the original payment method. Cash-on-delivery refunds are issued via UPI or bank transfer.",
  },
];

export function ReturnPolicy() {
  usePageMeta({
    title: "Return Policy | RK Traders — Returns, Replacements & Warranty",
    description: "RK Traders return policy — 7-day replacement window, damaged item resolution, manufacturer warranty claims, and refund timelines.",
  });

  return (
    <Section className="pt-12 md:pt-16">
      <Eyebrow>Return Policy</Eyebrow>
      <h1 className="max-w-2xl font-display text-3xl font-bold tracking-tight md:text-4xl">
        Returns, replacements & warranty claims
      </h1>
      <p className="mt-4 max-w-xl text-sm text-slate">
        We stand behind what we sell. Here's exactly how returns, replacements, and warranty
        claims work at RK Traders.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        {sections.map((s) => (
          <div key={s.title} className="rounded-2xl border border-line bg-white p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-volt/10 text-volt">
              <s.icon size={18} />
            </span>
            <h2 className="mt-4 font-display text-sm font-semibold text-navy">{s.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-3 rounded-2xl border border-line bg-surface p-5">
        <Phone size={18} className="text-volt" />
        <p className="text-sm text-slate">
          Questions about a specific order?{" "}
          <a href={`tel:${business.phone}`} className="font-medium text-volt hover:underline">
            Call {business.phone}
          </a>{" "}
          or visit the showroom with your bill.
        </p>
      </div>
    </Section>
  );
}
