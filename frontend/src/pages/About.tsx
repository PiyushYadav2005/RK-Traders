import { Target, Eye, Heart, Warehouse, Store, HardHat, Building2, MapPin } from "lucide-react";
import { Section, Eyebrow, CurrentLine } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { BrandsMarquee } from "@/components/home/BrandsMarquee";
import { usePageMeta } from "@/hooks/usePageMeta";
import { business, fullAddress } from "@/config/business";

const values = [
  { icon: Target, title: "Mission", body: "Make genuine, well-priced electrical goods easy to get — whether that's one switch for a home repair or a full site's wiring." },
  { icon: Eye, title: "Vision", body: "To be the electrical supplier Lucknow's contractors and homeowners default to, known equally for stock depth and straight dealing." },
  { icon: Heart, title: "Values", body: "No counterfeits, no inflated quotes, no runaround. If we don't have it, we'll say so and help you find it." },
];

const services = [
  { icon: Store, title: "Retail Supply", body: "Walk in for a single item — served with the same attention as a bulk order." },
  { icon: HardHat, title: "Wholesale Supply", body: "Dealer and contractor pricing with GST billing on every order." },
  { icon: Building2, title: "Project Supply", body: "Full material lists for construction and renovation projects, sourced and scheduled." },
  { icon: Warehouse, title: "Commercial Supply", body: "Ongoing supply arrangements for shops, offices, and institutions." },
];

export function About() {
  usePageMeta({
    title: "About Us | RK Traders — Electrical Wholesale & Retail, Lucknow",
    description: "Learn about RK Traders — Lucknow's trusted electrical supplier. 25+ years serving homeowners, contractors, and businesses with genuine products and straight pricing.",
  });

  return (
    <>
      <div className="bg-navy px-6 pt-16 pb-20 text-white md:pt-24">
        <div className="mx-auto max-w-4xl text-center">
          <Eyebrow>About RK Traders</Eyebrow>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-5xl">
            An electrical shop run the way a good hardware store should be
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-white/70">
            R. K. Traders has supplied electrical goods — wiring, lighting, switchgear, and fans —
            to homes, contractors, and businesses from our shop on Gautam Budh Marg, Lucknow.
            Retail or wholesale, the same stock and the same straight pricing.
          </p>
        </div>
      </div>

      <Section>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl border border-line bg-white p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-volt/10 text-volt">
                <v.icon size={18} />
              </span>
              <h2 className="mt-4 font-display text-sm font-semibold text-navy">{v.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate">{v.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <CurrentLine className="mb-16" />
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
          <div>
            <Eyebrow>Run by</Eyebrow>
            <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              {business.owner}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate">
              Proprietor of R. K. Traders, {business.owner} runs the shop day-to-day and is
              usually the first call for product advice, bulk pricing, or a delivery question.
            </p>
            <div className="mt-5 flex items-center gap-2 text-sm text-slate">
              <MapPin size={15} className="shrink-0 text-volt" />
              {fullAddress}
            </div>
            <Button as="a" href="/contact" className="mt-6">
              Get in touch
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {services.map((s) => (
              <div key={s.title} className="rounded-2xl border border-line bg-white p-5">
                <s.icon size={18} className="text-volt" />
                <h3 className="mt-3 font-display text-xs font-semibold text-navy">{s.title}</h3>
                <p className="mt-1 text-[11px] leading-relaxed text-slate">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <WhyChooseUs />
      <BrandsMarquee />

      <Section className="text-center">
        <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
          Come see the showroom, or send us your list
        </h2>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Button as="a" href="/contact">Visit or Message Us</Button>
          <Button as="a" href="/wholesale" variant="secondary">Request Bulk Pricing</Button>
        </div>
      </Section>
    </>
  );
}
