import { useRef, useState } from "react";
import { motion, useAnimationControls, type PanInfo } from "framer-motion";
import { IndianRupee, BadgeCheck, ShieldCheck, PackagePlus, HandHeart, Truck, Headphones, FileText } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/Section";

const features = [
  { icon: IndianRupee, title: "Competitive Pricing", description: "Direct-from-distributor rates passed on to every customer, retail or bulk." },
  { icon: BadgeCheck, title: "100% Original Products", description: "Zero counterfeits. Every product is sourced directly from authorised distributors." },
  { icon: ShieldCheck, title: "20+ Trusted Brands", description: "Havells, Polycab, Anchor, Philips and more — all under one roof." },
  { icon: PackagePlus, title: "Bulk Order Facility", description: "Dedicated pricing and logistics for contractors, builders & institutions." },
  { icon: HandHeart, title: "Retail Customers Welcome", description: "Need just one switch or one bulb? You're served with the same care." },
  { icon: Truck, title: "Fast Delivery", description: "Same-day dispatch across Lucknow on stocked items." },
  { icon: Headphones, title: "Expert Support", description: "Our team helps you spec the right product — not just sell you one." },
  { icon: FileText, title: "GST Billing", description: "Proper invoicing for every order, retail or wholesale." },
];

const CARD_WIDTH = 288; // px, including gap — keep in sync with card className width
const SET_WIDTH = CARD_WIDTH * features.length;

/** Auto-scrolling horizontal carousel: loops infinitely, pauses on hover,
 * and supports drag (mouse) / swipe (touch) to browse manually. The track
 * is the feature list duplicated 3x so a drag in either direction never
 * runs out of content before the loop position resets. */
export function WhyChooseUs() {
  const controls = useAnimationControls();
  const [isPaused, setIsPaused] = useState(false);
  const dragOffset = useRef(0);

  function startLoop(fromX = 0) {
    controls.start({
      x: [fromX, fromX - SET_WIDTH],
      transition: { duration: 26, ease: "linear", repeat: Infinity },
    });
  }

  function handleDragEnd(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    dragOffset.current += info.offset.x;
    // Normalize so we never drift outside the duplicated-content safe zone
    const normalized = dragOffset.current % SET_WIDTH;
    if (!isPaused) startLoop(normalized);
  }

  return (
    <Section>
      <Eyebrow>Why RK Traders</Eyebrow>
      <h2 className="mb-10 max-w-xl font-display text-3xl font-bold tracking-tight md:text-4xl">
        Built on trust, stocked for scale
      </h2>

      <div
        className="overflow-hidden"
        onMouseEnter={() => {
          setIsPaused(true);
          controls.stop();
        }}
        onMouseLeave={() => {
          setIsPaused(false);
          startLoop(dragOffset.current % SET_WIDTH);
        }}
      >
        <motion.div
          className="flex gap-6"
          style={{ width: SET_WIDTH * 3 }}
          drag="x"
          dragConstraints={{ left: -SET_WIDTH * 2, right: 0 }}
          dragElastic={0.05}
          onDragStart={() => controls.stop()}
          onDragEnd={handleDragEnd}
          animate={controls}
          onViewportEnter={() => startLoop()}
          viewport={{ once: true }}
        >
          {[...features, ...features, ...features].map((f, i) => (
            <div
              key={`${f.title}-${i}`}
              className="w-64 shrink-0 select-none rounded-2xl border border-line bg-white p-6"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-volt/10 text-volt">
                <f.icon size={18} />
              </span>
              <h3 className="mt-4 font-display text-sm font-semibold text-navy">{f.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate">{f.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}
