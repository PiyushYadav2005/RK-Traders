import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    brand: { type: String, trim: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    description: { type: String, required: true },
    shortDescription: { type: String },

    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, required: true },
      },
    ],

    // Retail = single-unit consumer price. Wholesale = price per unit when
    // ordering at or above minWholesaleQty. Both in INR, GST-exclusive.
    pricing: {
      retailPrice: { type: Number, required: true, min: 0 },
      wholesalePrice: { type: Number, min: 0 },
      minWholesaleQty: { type: Number, default: 50 },
      gstPercent: { type: Number, default: 18 },
      mrp: { type: Number }, // for showing a strikethrough discount
    },

    specs: [{ key: String, value: String }],

    stock: {
      quantity: { type: Number, default: 0, min: 0 },
      unit: { type: String, default: "pcs" }, // pcs, box, meter, roll...
      lowStockThreshold: { type: Number, default: 10 },
    },

    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },

    tags: [{ type: String, trim: true, lowercase: true }],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", tags: "text", brand: "text" });
productSchema.index({ category: 1, isActive: 1 });

productSchema.virtual("inStock").get(function () {
  return this.stock.quantity > 0;
});

productSchema.set("toJSON", { virtuals: true });

export const Product = mongoose.model("Product", productSchema);
