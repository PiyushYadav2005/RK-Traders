import type { Category } from "@/types";

// Curated top-8 subset shown on the homepage marketing grid. Slugs must match
// entries in the full 30-category taxonomy (src/data/productCategories.ts and
// the backend seed) so these links land on a populated filter.
export const categories: Category[] = [
  {
    slug: "led-bulbs",
    name: "LED Lighting",
    description: "Bulbs, panels & downlights for every space",
    image:
      "https://images.unsplash.com/photo-1565636192335-8a3d5f65c8b0?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Modern LED panel lights installed in a ceiling grid",
  },
  {
    slug: "chandeliers",
    name: "Decorative & Chandeliers",
    description: "Statement lighting for homes & hotels",
    image:
      "https://images.unsplash.com/photo-1524634126442-357e0eac3c14?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Elegant crystal chandelier hanging in a well-lit interior",
  },
  {
    slug: "fans",
    name: "Fans",
    description: "Ceiling, exhaust & pedestal fans",
    image:
      "https://images.unsplash.com/photo-1631048500968-6543c3c30f0d?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Modern ceiling fan in a bright living room",
  },
  {
    slug: "switches",
    name: "Switches & Sockets",
    description: "Modular switches for every wall",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Modern white modular electrical switch panel on a wall",
  },
  {
    slug: "wires",
    name: "Wires & Cables",
    description: "Copper wiring for safe installations",
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Coils of electrical copper wire and cable",
  },
  {
    slug: "mcb",
    name: "MCBs & Distribution",
    description: "Safety & load distribution systems",
    image:
      "https://images.unsplash.com/photo-1620825141326-5f7c62d4f7c1?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Electrical distribution board with circuit breakers",
  },
  {
    slug: "electrical-tools",
    name: "Industrial & Tools",
    description: "Heavy-duty supply for factories & sites",
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22731c9c8c?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Industrial electrical control panel and wiring",
  },
  {
    slug: "street-lights",
    name: "Outdoor & Street Lighting",
    description: "Flood lights, street lights & solar",
    image:
      "https://images.unsplash.com/photo-1542367592-8849eb970fd6?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Street light illuminating a road at dusk",
  },
] as const;
