import { useRef, useState, useEffect, useCallback } from "react";
import { motion, animate } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { categories as staticCategories } from "@/data/categories";
import { useCategories } from "@/hooks/useProducts";

const AUTOPLAY_MS = 3000;

export function CategoryGrid() {
  // Prefer live categories from the API; fall back to the static list so the
  // homepage still looks complete if the backend isn't running.
  const { data: apiCategories, isError } = useCategories();
  const categories = !isError && apiCategories?.length ? apiCategories : staticCategories;

  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });

  const cardStep = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const firstCard = track.children[0] as HTMLElement | undefined;
    if (!firstCard) return 0;
    const gap = parseFloat(getComputedStyle(track).columnGap || "16");
    return firstCard.offsetWidth + gap;
  }, []);

  const scrollToIndex = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;
      const clamped = (index + categories.length) % categories.length;
      const target = clamped * cardStep();
      animate(track.scrollLeft, target, {
        type: "spring",
        stiffness: 300,
        damping: 40,
        onUpdate: (v) => {
          track.scrollLeft = v;
        },
      });
      setActiveIndex(clamped);
    },
    [cardStep, categories.length]
  );

  // Autoplay — advances one card every 3s, pauses on hover/drag/focus.
  useEffect(() => {
    if (isPaused || categories.length <= 1) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % categories.length;
        const track = trackRef.current;
        if (track) {
          animate(track.scrollLeft, next * cardStep(), {
            type: "spring",
            stiffness: 300,
            damping: 40,
            onUpdate: (v) => {
              track.scrollLeft = v;
            },
          });
        }
        return next;
      });
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [isPaused, categories.length, cardStep]);

  // Mouse drag-to-scroll on desktop (touch works natively via CSS scroll-snap).
  function onMouseDown(e: React.MouseEvent) {
    const track = trackRef.current;
    if (!track) return;
    isDragging.current = true;
    setIsPaused(true);
    dragStart.current = { x: e.pageX, scrollLeft: track.scrollLeft };
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging.current || !trackRef.current) return;
    e.preventDefault();
    const dx = e.pageX - dragStart.current.x;
    trackRef.current.scrollLeft = dragStart.current.scrollLeft - dx;
  }
  function endDrag() {
    if (!isDragging.current) return;
    isDragging.current = false;
    const track = trackRef.current;
    if (track) {
      const nearest = Math.round(track.scrollLeft / cardStep());
      scrollToIndex(nearest);
    }
    setIsPaused(false);
  }

  return (
    <Section>
      <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <Eyebrow>What We Supply</Eyebrow>
          <h2 className="max-w-xl font-display text-3xl font-bold tracking-tight md:text-4xl">
            Everything electrical, under one roof
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <p className="max-w-sm text-sm text-slate">
            Retail quantities for homeowners, bulk quantities for contractors —
            the same trusted brands, either way.
          </p>
          <div className="hidden shrink-0 gap-2 sm:flex">
            <button
              onClick={() => scrollToIndex(activeIndex - 1)}
              aria-label="Previous category"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-slate hover:border-volt hover:text-volt"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scrollToIndex(activeIndex + 1)}
              aria-label="Next category"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-slate hover:border-volt hover:text-volt"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          endDrag();
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
        style={{ cursor: "grab" }}
      >
        {categories.map((cat, i) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
            className="w-[46%] shrink-0 snap-start sm:w-[31%] md:w-[23%]"
          >
            <Link
              to={`/products?category=${cat.slug}`}
              draggable={false}
              className="group relative block overflow-hidden rounded-2xl bg-navy"
            >
              <div className="aspect-[4/5] w-full overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.imageAlt}
                  loading="lazy"
                  draggable={false}
                  className="h-full w-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-90"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-sm font-semibold text-white md:text-base">
                      {cat.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-white/60">{cat.description}</p>
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="shrink-0 text-live opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Pagination dots */}
      <div className="mt-6 flex justify-center gap-2">
        {categories.map((cat, i) => (
          <button
            key={cat.slug}
            onClick={() => scrollToIndex(i)}
            aria-label={`Go to ${cat.name}`}
            className={`h-1.5 rounded-full transition-all ${
              i === activeIndex ? "w-6 bg-volt" : "w-1.5 bg-line"
            }`}
          />
        ))}
      </div>
    </Section>
  );
}
