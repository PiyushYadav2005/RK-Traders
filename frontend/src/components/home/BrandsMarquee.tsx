import { Link } from "react-router-dom";
import { Eyebrow } from "@/components/ui/Section";
import { brands } from "@/config/business";

/** Two rows scrolling in opposite directions. Each brand pill links to the
 * Products page pre-filtered by that brand — reuses the existing `brand`
 * query param the backend already supports (see productController.js). */
function Row({ direction, duration }: { direction: "left" | "right"; duration: number }) {
  const looped = [...brands, ...brands];

  return (
    <div className="relative overflow-hidden py-2">
      <div
        className="flex w-max gap-4"
        style={{ animation: `brand-scroll-${direction} ${duration}s linear infinite` }}
      >
        {looped.map((brand, i) => (
          <Link
            key={`${brand}-${i}`}
            to={`/products?brand=${encodeURIComponent(brand)}`}
            className="group flex items-center whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-6 py-3 font-display text-sm font-semibold text-white/75 transition-colors hover:border-live/40 hover:bg-live/10 hover:text-live"
          >
            {brand}
          </Link>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-navy to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-navy to-transparent" />
    </div>
  );
}

export function BrandsMarquee() {
  return (
    <div className="bg-navy px-6 py-20">
      <style>{`
        @keyframes brand-scroll-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes brand-scroll-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="brand-scroll"] { animation: none !important; }
        }
      `}</style>
      <div className="mx-auto max-w-7xl">
        <Eyebrow>Top Brands</Eyebrow>
        <h2 className="mb-10 max-w-lg font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
          The names electricians ask for. Tap one to browse.
        </h2>
      </div>

      <div className="space-y-2">
        <Row direction="left" duration={38} />
        <Row direction="right" duration={44} />
      </div>
    </div>
  );
}
