import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { usePageMeta } from "@/hooks/usePageMeta";
import { business } from "@/config/business";

const faqs = [
  {
    q: "Do you sell retail, or only wholesale?",
    a: "Both. Walk in for a single switch or a single bulb, or register as a dealer for bulk pricing on large orders — same trusted stock, either way.",
  },
  {
    q: "Can I buy just one product?",
    a: "Yes — retail customers are welcome for any quantity, no minimum order.",
  },
  {
    q: "Do you provide GST bills?",
    a: "Yes, every order — retail or wholesale — comes with a proper GST invoice.",
  },
  {
    q: "Do you deliver?",
    a: "Yes, we offer same-day dispatch across Lucknow on stocked items, with delivery further afield for bulk orders.",
  },
  {
    q: "Which brands do you sell?",
    a: "Havells, Anchor, Finolex, Philips, Bajaj, Polycab, Syska, Osram, Opple, Crompton Greaves and more — see our full brands list on the homepage.",
  },
  {
    q: "How do I request a quotation?",
    a: "Use the Get Quote button, message us on WhatsApp, or call the shop directly — we'll get back with pricing the same day.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line py-5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="font-display text-base font-semibold text-navy">{q}</span>
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-volt/10 text-volt">
          {open ? <Minus size={14} /> : <Plus size={14} />}
        </span>
      </button>
      {open && <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate">{a}</p>}
    </div>
  );
}

export function FAQ() {
  usePageMeta({
    title: "FAQ | RK Traders — Frequently Asked Questions",
    description: "Find answers to common questions about RK Traders — retail and wholesale purchases, GST billing, delivery, brands, and quotations.",
  });

  // FAQPage structured data for Google rich results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Section className="pt-12 md:pt-16">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_1.4fr]">
        <div>
          <Eyebrow>FAQ</Eyebrow>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Questions we hear every day.
          </h1>
          <p className="mt-4 text-sm text-slate">
            Can't find your answer?{" "}
            <a
              href={`https://wa.me/${business.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-volt hover:underline"
            >
              Message us on WhatsApp →
            </a>
          </p>
        </div>
        <div>
          {faqs.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </div>
      </Section>
    </>
  );
}
