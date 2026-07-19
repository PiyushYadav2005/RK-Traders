import { useCountUp } from "@/hooks/useCountUp";
import type { TrustStat } from "@/types";

const stats: TrustStat[] = [
  { label: "Years in Business", value: 25, suffix: "+" },
  { label: "Products Stocked", value: 3000, suffix: "+" },
  { label: "Happy Customers", value: 12000, suffix: "+" },
  { label: "Google Rating", value: 4.8, suffix: "/5", decimals: 1 },
];

function Stat({ stat }: { stat: TrustStat }) {
  const { ref, value } = useCountUp(stat.value * (stat.decimals ? 10 : 1));
  const display = stat.decimals ? (value / 10).toFixed(stat.decimals) : value;

  return (
    <div ref={ref} className="border-l-2 border-live pl-5">
      <div className="font-mono text-3xl font-semibold text-white md:text-4xl">
        {display}
        {stat.suffix}
      </div>
      <div className="mt-1 text-sm text-white/60">{stat.label}</div>
    </div>
  );
}

export function TrustStats() {
  return (
    <div className="bg-navy-soft px-6 py-14">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 md:grid-cols-4">
        {stats.map((stat) => (
          <Stat key={stat.label} stat={stat} />
        ))}
      </div>
    </div>
  );
}
