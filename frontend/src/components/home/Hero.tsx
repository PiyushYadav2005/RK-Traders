import { motion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";

/** Animated circuit-schematic background: horizontal/vertical traces with
 * pulsing nodes, evoking a PCB / wiring diagram rather than a stock photo.
 * This is the page's opening thesis — the most characteristic visual idiom
 * of an electrical business. */
function CircuitBackdrop() {
  const traces = [
    "M0,120 H340 V60 H700",
    "M0,260 H180 V340 H520 V220 H900",
    "M0,400 H420 V480 H1000",
    "M1200,80 H860 V180 H600",
    "M1200,320 H980 V400 H700",
  ];

  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-[0.14]"
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {traces.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="#FFD500"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      {[
        [340, 120],
        [520, 220],
        [420, 400],
        [860, 180],
        [980, 320],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="4" fill="#FFD500">
          <animate
            attributeName="opacity"
            values="0.3;1;0.3"
            dur="2.4s"
            begin={`${i * 0.4}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  );
}

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-navy text-white">
      <CircuitBackdrop />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(0,87,255,0.35), transparent 55%), radial-gradient(circle at 80% 70%, rgba(255,213,0,0.12), transparent 45%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-7xl flex-col items-start px-6 pb-24 pt-20 md:pb-32 md:pt-28">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5 flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-mono text-xs tracking-wide text-live"
        >
          ESTD. AMINABAD, LUCKNOW
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl font-display text-4xl font-bold leading-[1.08] tracking-tight md:text-6xl"
        >
          Powering homes, businesses & industries with{" "}
          <span className="text-live">premium electrical</span> solutions
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-white/70 md:text-lg"
        >
          From a single switch to a full site fit-out — RK Traders supplies
          trusted electrical products at wholesale and retail scale, backed
          by decades of expertise in Lucknow.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-9 flex flex-wrap gap-4"
        >
          <Button as="a" href="/products" variant="live" icon={<ArrowRight size={16} />}>
            Explore Products
          </Button>
          <Button as="a" href="/wholesale" variant="ghost" icon={<FileText size={16} />}>
            Wholesale & Bulk Orders
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
