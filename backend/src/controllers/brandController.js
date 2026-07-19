import { Brand } from "../models/Brand.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const listBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find().sort({ name: 1 });
  res.json({ success: true, count: brands.length, brands });
});

export const createBrand = asyncHandler(async (req, res) => {
  const { name, logo, description } = req.body;
  if (!name) throw new ApiError(400, "Brand name is required");

  const brand = await Brand.create({ name, slug: slugify(name), logo, description });
  res.status(201).json({ success: true, brand });
});

export const updateBrand = asyncHandler(async (req, res) => {
  const update = { ...req.body };
  if (update.name) update.slug = slugify(update.name);

  const brand = await Brand.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  });
  if (!brand) throw new ApiError(404, "Brand not found");
  res.json({ success: true, brand });
});

export const deleteBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findByIdAndDelete(req.params.id);
  if (!brand) throw new ApiError(404, "Brand not found");
  res.json({ success: true, message: "Brand deleted" });
});
