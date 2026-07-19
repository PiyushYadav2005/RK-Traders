import {
  ToggleLeft, Plug, Plug2, LayoutGrid, Cable, Lightbulb, RectangleHorizontal,
  CircleDot, Flashlight, Lamp, Sparkles, Gem, LampCeiling, LampWallUp, Waves,
  Sprout, BatteryCharging, Wifi, Zap, ShieldCheck, PackageOpen, Link2, Fan,
  Wind, Wrench, Radar, CircleDashed,
  type LucideIcon,
} from "lucide-react";

export interface ProductCategoryDef {
  slug: string;
  name: string;
  icon: LucideIcon;
}

// The full 30-category taxonomy stocked by RK Traders. Slugs match the
// backend Category collection 1:1 — keep this list and the backend seed
// (rk-traders-backend/src/seed/seed.js) in sync when adding categories.
export const productCategories: ProductCategoryDef[] = [
  { slug: "switches", name: "Switches", icon: ToggleLeft },
  { slug: "sockets", name: "Sockets", icon: Plug },
  { slug: "modular-switches", name: "Modular Switches", icon: LayoutGrid },
  { slug: "wires", name: "Wires", icon: Waves },
  { slug: "cables", name: "Cables", icon: Cable },
  { slug: "led-bulbs", name: "LED Bulbs", icon: Lightbulb },
  { slug: "tube-lights", name: "Tube Lights", icon: RectangleHorizontal },
  { slug: "panel-lights", name: "Panel Lights", icon: RectangleHorizontal },
  { slug: "cob-lights", name: "COB Lights", icon: CircleDot },
  { slug: "flood-lights", name: "Flood Lights", icon: Flashlight },
  { slug: "street-lights", name: "Street Lights", icon: Lamp },
  { slug: "decorative-lights", name: "Decorative Lights", icon: Sparkles },
  { slug: "chandeliers", name: "Chandeliers", icon: Gem },
  { slug: "pendant-lights", name: "Pendant Lights", icon: LampCeiling },
  { slug: "wall-lights", name: "Wall Lights", icon: LampWallUp },
  { slug: "ceiling-lights", name: "Ceiling Lights", icon: LampCeiling },
  { slug: "led-strip-lights", name: "LED Strip Lights", icon: Waves },
  { slug: "garden-lights", name: "Garden Lights", icon: Sprout },
  { slug: "emergency-lights", name: "Emergency Lights", icon: BatteryCharging },
  { slug: "smart-switches", name: "Smart Switches", icon: Wifi },
  { slug: "mcb", name: "MCB", icon: Zap },
  { slug: "rccb", name: "RCCB", icon: ShieldCheck },
  { slug: "distribution-boards", name: "Distribution Boards", icon: PackageOpen },
  { slug: "extension-boards", name: "Extension Boards", icon: Link2 },
  { slug: "plug-tops", name: "Plug Tops", icon: Plug2 },
  { slug: "fans", name: "Fans", icon: Fan },
  { slug: "exhaust-fans", name: "Exhaust Fans", icon: Wind },
  { slug: "pvc-pipes", name: "PVC Pipes", icon: CircleDashed },
  { slug: "electrical-tools", name: "Electrical Tools", icon: Wrench },
  { slug: "sensors", name: "Sensors", icon: Radar },
];
