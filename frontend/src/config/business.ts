// Single source of truth for business info (NAP consistency matters for local SEO —
// this same object should feed the header, footer, contact page, and JSON-LD).
// Sourced from the R.K. Traders business card (owner: Ritesh Agarwal).

export const business = {
  name: "RK Traders",
  legalName: "R. K. Traders",
  owner: "Ritesh Agarwal",
  tagline: "Your Trusted Electrical Partner",
  category: "Electrical Wholesale & Retail Store",
  description:
    "A complete range of electrical goods including fancy, industrial, commercial & LED lighting.",
  address: {
    line1: "Shop No. 1, Raj Rani Complex, 102/67 (UGF)",
    line2: "Opposite Dr. Yuchin's, Gautam Budh Marg",
    city: "Lucknow",
    state: "Uttar Pradesh",
    pincode: "226018",
  },
  phone: "+91-93359-12637",
  phoneSecondary: "+91-88878-91796",
  whatsapp: "919335912637", // digits only, for wa.me links — primary number
  email: "contact@rktraders.example.com", // placeholder — replace with real inbox
  hours: "Mon–Sat, 9:30 AM – 8:30 PM",
  mapsUrl: "https://maps.google.com/?q=RK+Traders+Gautam+Budh+Marg+Lucknow",
  social: {
    instagram: "",
    facebook: "",
  },
} as const;

export const fullAddress = `${business.address.line1}, ${business.address.line2}, ${business.address.city}, ${business.address.state} – ${business.address.pincode}`;

// Brands stocked — sourced from the physical business card back panel.
export const brands = [
  "Havells",
  "Anchor",
  "Finolex",
  "Philips",
  "Bajaj",
  "Wipro",
  "Eglo",
  "Corvi LED",
  "Jaquar Lighting",
  "Philips Hue",
  "Hybec",
  "Opple Lighting",
  "Cema",
  "Glowmac",
  "CG Power Solutions",
  "Simon",
  "Syska",
  "Osram",
  "Polycab",
  "Crompton Greaves",
] as const;
