import { ImagePlus } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { usePageMeta } from "@/hooks/usePageMeta";

interface Slot {
  label: string;
  src?: string;
}

const slots: Slot[] = [
  {
    label: "Owner",
    src: "/gallery/Owner.png",
  },
  {
    label: "Showroom Floor",
    src: "/gallery/Showroom.png",
  },
  {
    label: "Warehouse",
    src: "/gallery/Shop.png",
  },
  {
    label: "Our Brands",
    src: "/gallery/Brands.png",
  },
  {
    label: "Decoratives",
    src: "/gallery/Decoratives.png",
  },
  {
    label: "Installs",
    src: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1200&auto=format&fit=crop&q=80",
  },
];

function Card({
  image,
  height,
  contain = false,
}: {
  image: Slot;
  height: string;
  contain?: boolean;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[28px] bg-white shadow-lg hover:shadow-2xl transition-all duration-500 ${height}`}
    >
      {image.src ? (
        <img
          src={image.src}
          alt={image.label}
          loading="lazy"
          className={`w-full h-full transition duration-700 group-hover:scale-105 ${
            contain
              ? "object-contain bg-white p-3"
              : "object-cover"
          }`}
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <ImagePlus />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"></div>

      <span className="absolute left-5 bottom-5 rounded-full bg-white/95 px-5 py-2 text-sm font-semibold backdrop-blur">
        {image.label}
      </span>
    </div>
  );
}

export function Gallery() {
  usePageMeta({
    title: "Gallery | RK Traders — Showroom & Warehouse Photos",
    description: "See inside RK Traders — our premium electrical showroom, warehouse, and professional team in Aminabad, Lucknow.",
  });

  return (
    <Section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <Eyebrow>Inside RK Traders</Eyebrow>

        <h1 className="mb-12 text-3xl md:text-5xl font-bold max-w-3xl">
          Explore Our Premium Electrical Showroom,
          Warehouse & Professional Team
        </h1>

        {/* TOP */}

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Owner */}

          <div className="lg:col-span-2">
            <Card
              image={slots[0]}
              height="h-[300px] sm:h-[550px] lg:h-[760px]"
              contain
            />
          </div>

          {/* Right */}

          <div className="flex flex-col gap-6">

            <Card
              image={slots[1]}
              height="h-[260px] lg:h-[367px]"
            />

            <Card
              image={slots[2]}
              height="h-[260px] lg:h-[367px]"
            />

          </div>

        </div>

        {/* Bottom */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

          <Card
            image={slots[3]}
            height="h-[260px] lg:h-[320px]"
          />

          <Card
            image={slots[4]}
            height="h-[260px] lg:h-[320px]"
          />

          <Card
            image={slots[5]}
            height="h-[260px] lg:h-[320px]"
          />

        </div>

      </div>
    </Section>
  );
}