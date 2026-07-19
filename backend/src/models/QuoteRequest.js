import mongoose from "mongoose";

const quoteRequestSchema = new mongoose.Schema(
  {
    quoteNumber: { type: String, required: true, unique: true },

    fullName: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    gstNumber: { type: String, trim: true, uppercase: true },
    address: { type: String },

    projectType: { type: String },
    productCategory: { type: String },
    brand: { type: String },
    requiredProducts: { type: String, required: true },
    quantity: { type: String },
    budget: { type: String },
    preferredDelivery: { type: Date },
    message: { type: String },

    status: {
      type: String,
      enum: ["new", "reviewing", "quoted", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

export const QuoteRequest = mongoose.model("QuoteRequest", quoteRequestSchema);
