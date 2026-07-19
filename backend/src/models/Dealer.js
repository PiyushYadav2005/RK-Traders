import mongoose from "mongoose";

const dealerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    businessName: { type: String, required: true, trim: true },
    gstNumber: { type: String, trim: true, uppercase: true },
    businessType: {
      type: String,
      enum: ["contractor", "electrician", "retailer", "builder", "architect", "other"],
      required: true,
    },
    businessAddress: {
      line1: String,
      city: String,
      state: String,
      pincode: String,
    },
    yearsInBusiness: { type: Number },
    monthlyVolumeEstimate: { type: String }, // free text band, e.g. "₹50k–₹2L"
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    discountTier: { type: String, enum: ["standard", "silver", "gold"], default: "standard" },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Dealer = mongoose.model("Dealer", dealerSchema);
