import mongoose from "mongoose";

const wholesaleRequestSchema = new mongoose.Schema(
  {
    requestNumber: { type: String, required: true, unique: true },

    customerName: { type: String, required: true, trim: true },
    companyName: { type: String, trim: true },
    gstNumber: { type: String, trim: true, uppercase: true },
    phone: { type: String, required: true, trim: true },
    whatsapp: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },

    address: {
      line1: String,
      city: String,
      state: String,
      pincode: String,
    },

    customerType: {
      type: String,
      enum: ["dealer", "contractor", "retail", "builder", "architect", "electrician"],
      required: true,
    },

    businessDescription: { type: String },
    requiredProducts: { type: String, required: true },
    bulkQuantity: { type: String },
    expectedBudget: { type: String },

    deliveryAddress: { type: String },
    preferredDeliveryDate: { type: Date },
    additionalRequirements: { type: String },

    status: {
      type: String,
      enum: ["pending", "processing", "quoted", "completed", "rejected"],
      default: "pending",
    },
    statusHistory: [
      {
        status: String,
        at: { type: Date, default: Date.now },
        note: String,
      },
    ],
  },
  { timestamps: true }
);

export const WholesaleRequest = mongoose.model("WholesaleRequest", wholesaleRequestSchema);
