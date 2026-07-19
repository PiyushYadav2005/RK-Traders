import "dotenv/config";
import mongoose from "mongoose";
import { env } from "../config/env.js";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";

// Curated, verified-loading Unsplash photos, reused across visually-related
// categories. Swap these for real product photography whenever it's ready —
// each category's `image` field below is the one place to change per category.
const IMG = {
  switchgear: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
  wire: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80",
  bulb: "https://images.unsplash.com/photo-1565636192335-8a3d5f65c8b0?auto=format&fit=crop&w=800&q=80",
  chandelier: "https://images.unsplash.com/photo-1524634126442-357e0eac3c14?auto=format&fit=crop&w=800&q=80",
  outdoor: "https://images.unsplash.com/photo-1542367592-8849eb970fd6?auto=format&fit=crop&w=800&q=80",
  breaker: "https://images.unsplash.com/photo-1620825141326-5f7c62d4f7c1?auto=format&fit=crop&w=800&q=80",
  fan: "https://images.unsplash.com/photo-1631048500968-6543c3c30f0d?auto=format&fit=crop&w=800&q=80",
  industrial: "https://images.unsplash.com/photo-1581092160607-ee22731c9c8c?auto=format&fit=crop&w=800&q=80",
};

// The full 30-category taxonomy — must match src/data/productCategories.ts
// on the frontend (slugs are the contract between the two).
const categoryData = [
  { name: "Switches", slug: "switches", image: IMG.switchgear },
  { name: "Sockets", slug: "sockets", image: IMG.switchgear },
  { name: "Modular Switches", slug: "modular-switches", image: IMG.switchgear },
  { name: "Wires", slug: "wires", image: IMG.wire },
  { name: "Cables", slug: "cables", image: IMG.wire },
  { name: "LED Bulbs", slug: "led-bulbs", image: IMG.bulb },
  { name: "Tube Lights", slug: "tube-lights", image: IMG.bulb },
  { name: "Panel Lights", slug: "panel-lights", image: IMG.bulb },
  { name: "COB Lights", slug: "cob-lights", image: IMG.bulb },
  { name: "Flood Lights", slug: "flood-lights", image: IMG.outdoor },
  { name: "Street Lights", slug: "street-lights", image: IMG.outdoor },
  { name: "Decorative Lights", slug: "decorative-lights", image: IMG.chandelier },
  { name: "Chandeliers", slug: "chandeliers", image: IMG.chandelier },
  { name: "Pendant Lights", slug: "pendant-lights", image: IMG.chandelier },
  { name: "Wall Lights", slug: "wall-lights", image: IMG.chandelier },
  { name: "Ceiling Lights", slug: "ceiling-lights", image: IMG.bulb },
  { name: "LED Strip Lights", slug: "led-strip-lights", image: IMG.bulb },
  { name: "Garden Lights", slug: "garden-lights", image: IMG.outdoor },
  { name: "Emergency Lights", slug: "emergency-lights", image: IMG.breaker },
  { name: "Smart Switches", slug: "smart-switches", image: IMG.switchgear },
  { name: "MCB", slug: "mcb", image: IMG.breaker },
  { name: "RCCB", slug: "rccb", image: IMG.breaker },
  { name: "Distribution Boards", slug: "distribution-boards", image: IMG.breaker },
  { name: "Extension Boards", slug: "extension-boards", image: IMG.switchgear },
  { name: "Plug Tops", slug: "plug-tops", image: IMG.switchgear },
  { name: "Fans", slug: "fans", image: IMG.fan },
  { name: "Exhaust Fans", slug: "exhaust-fans", image: IMG.fan },
  { name: "PVC Pipes", slug: "pvc-pipes", image: IMG.industrial },
  { name: "Electrical Tools", slug: "electrical-tools", image: IMG.industrial },
  { name: "Sensors", slug: "sensors", image: IMG.industrial },
].map((c) => ({ ...c, imageAlt: c.name, description: `${c.name} for home, commercial & industrial use` }));

const brands = ["Havells", "Anchor", "Finolex", "Philips", "Bajaj", "Polycab", "Syska", "Osram", "Opple", "Crompton"];

// Two products per category, priced sensibly for that product type.
const productTemplates = {
  switches: [["6A 1-Way Modular Switch", 45], ["16A 2-Way Modular Switch", 65]],
  sockets: [["6A Power Socket", 55], ["16A Universal Socket", 89]],
  "modular-switches": [["Modular Switch Plate 3M", 120], ["Modular Switch Plate 6M", 220]],
  wires: [["1.5 Sq mm Copper Wire (90m)", 1299], ["2.5 Sq mm Copper Wire (90m)", 1899]],
  cables: [["3-Core Flexible Cable (30m)", 2199], ["Armoured Cable (30m)", 3499]],
  "led-bulbs": [["9W LED Bulb Cool Daylight", 99], ["12W LED Bulb Warm White", 129]],
  "tube-lights": [["20W LED Tube Light 2ft", 219], ["36W LED Batten 4ft", 289]],
  "panel-lights": [["12W LED Panel Round", 249], ["18W LED Panel Square", 349]],
  "cob-lights": [["5W COB Spotlight", 179], ["10W COB Downlight", 299]],
  "flood-lights": [["30W LED Flood Light", 599], ["50W LED Flood Light", 899]],
  "street-lights": [["60W LED Street Light", 1299], ["100W LED Street Light", 1799]],
  "decorative-lights": [["LED Fairy String Lights 10m", 299], ["Festive LED Curtain Lights", 449]],
  chandeliers: [["3-Light Crystal Chandelier", 3999], ["5-Light Crystal Chandelier", 6499]],
  "pendant-lights": [["Modern Pendant Hanging Light", 1899], ["Cluster Pendant Light Set", 2799]],
  "wall-lights": [["Antique Brass Wall Sconce", 1249], ["Modern LED Wall Light", 999]],
  "ceiling-lights": [["Round LED Ceiling Light", 899], ["Square LED Ceiling Light", 1099]],
  "led-strip-lights": [["5m RGB LED Strip", 599], ["5m Warm White LED Strip", 449]],
  "garden-lights": [["Solar Garden Light", 399], ["LED Pathway Light", 349]],
  "emergency-lights": [["Rechargeable Emergency Light", 449], ["LED Emergency Bulb 2hr Backup", 349]],
  "smart-switches": [["Smart WiFi Touch Switch", 649], ["Smart 2-Gang Switch", 999]],
  mcb: [["16A Single Pole MCB", 149], ["32A Single Pole MCB", 179]],
  rccb: [["25A Double Pole RCCB", 649], ["40A Double Pole RCCB", 899]],
  "distribution-boards": [["4-Way Distribution Board", 549], ["8-Way Distribution Board", 899]],
  "extension-boards": [["4-Socket Extension Board", 299], ["6-Socket Extension Board with Surge", 499]],
  "plug-tops": [["6A Plug Top", 25], ["16A Plug Top", 45]],
  fans: [["48-Inch Ceiling Fan High Speed", 1699], ["BLDC Energy Saving Ceiling Fan", 2999]],
  "exhaust-fans": [["6-Inch Exhaust Fan", 599], ["8-Inch Exhaust Fan", 749]],
  "pvc-pipes": [["20mm PVC Conduit Pipe (3m)", 89], ["25mm PVC Conduit Pipe (3m)", 119]],
  "electrical-tools": [["Insulated Screwdriver Set", 399], ["Digital Multimeter", 799]],
  sensors: [["PIR Motion Sensor Switch", 449], ["Smart Door Bell Sensor", 1299]],
};

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function seed() {
  await mongoose.connect(env.mongoUri);
  console.log("[seed] connected");

  await Product.deleteMany({});
  await Category.deleteMany({});
  console.log("[seed] cleared existing categories/products");

  const categories = await Category.insertMany(categoryData);
  console.log(`[seed] inserted ${categories.length} categories`);

  const bySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

  const products = [];
  for (const [categorySlug, items] of Object.entries(productTemplates)) {
    const category = bySlug[categorySlug];
    if (!category) continue;

    items.forEach(([name, retailPrice], i) => {
      const slug = slugify(name);
      products.push({
        name,
        slug,
        sku: `RKT-${slugify(categorySlug).slice(0, 4).toUpperCase()}-${100 + i}`,
        brand: brands[Math.floor(Math.random() * brands.length)],
        category: category._id,
        description: `${name} — genuine, warranty-backed stock available in retail and wholesale quantities at RK Traders, Lucknow.`,
        shortDescription: `Reliable ${name.toLowerCase()}.`,
        images: [{ url: category.image, alt: name }],
        pricing: {
          retailPrice,
          wholesalePrice: Math.round(retailPrice * 0.78),
          minWholesaleQty: retailPrice > 1000 ? 10 : 50,
          mrp: Math.round(retailPrice * 1.15),
          gstPercent: 18,
        },
        specs: [],
        stock: { quantity: Math.floor(Math.random() * 200 + 20), unit: "pcs" },
        ratings: { average: +(3.8 + Math.random() * 1.2).toFixed(1), count: Math.floor(Math.random() * 300 + 5) },
        tags: [],
        isFeatured: i === 0 && Math.random() > 0.5,
      });
    });
  }

  await Product.insertMany(products);
  console.log(`[seed] inserted ${products.length} products across ${Object.keys(productTemplates).length} categories`);

  await mongoose.disconnect();
  console.log("[seed] done");
}

seed().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
