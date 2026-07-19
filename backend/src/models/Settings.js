import mongoose from "mongoose";

/** Singleton settings document — there is only ever one, fetched/updated
 * via a fixed key rather than an _id lookup. The public frontend still
 * reads from src/config/business.ts for now — this collection makes the
 * values admin-editable and persisted, but wiring the public site to read
 * from here dynamically is a follow-up task (see CHANGELOG). */
const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "shop", unique: true },
    shopName: { type: String, default: "RK Traders" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    address: { type: String, default: "" },
    gstNumber: { type: String, default: "" },
    logo: { type: String, default: "" },
    social: {
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export const Settings = mongoose.model("Settings", settingsSchema);
