import { Product } from "../models/Product.js";
import { Category } from "../models/Category.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * GET /api/products
 * Query params: category (slug), search, minPrice, maxPrice, brand,
 * inStock, sort (price_asc|price_low..|newest|rating), page, limit
 */
export const listProducts = asyncHandler(async (req, res) => {
  const {
    category,
    search,
    minPrice,
    maxPrice,
    brand,
    inStock,
    sort = "newest",
    page = 1,
    limit = 12,
  } = req.query;

  const filter = { isActive: true };

  if (category) {
    const cat = await Category.findOne({ slug: category });
    if (!cat) {
      return res.json({ success: true, count: 0, total: 0, page: 1, pages: 0, products: [] });
    }
    filter.category = cat._id;
  }

  if (search) {
    filter.$text = { $search: search };
  }

  if (brand) {
    filter.brand = new RegExp(`^${brand}$`, "i");
  }

  if (minPrice || maxPrice) {
    filter["pricing.retailPrice"] = {};
    if (minPrice) filter["pricing.retailPrice"].$gte = Number(minPrice);
    if (maxPrice) filter["pricing.retailPrice"].$lte = Number(maxPrice);
  }

  if (inStock === "true") {
    filter["stock.quantity"] = { $gt: 0 };
  }

  const sortMap = {
    newest: { createdAt: -1 },
    price_asc: { "pricing.retailPrice": 1 },
    price_desc: { "pricing.retailPrice": -1 },
    rating: { "ratings.average": -1 },
    name_asc: { name: 1 },
  };

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(48, Math.max(1, Number(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .sort(sortMap[sort] || sortMap.newest)
      .skip(skip)
      .limit(limitNum),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    count: products.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    products,
  });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true }).populate(
    "category",
    "name slug"
  );
  if (!product) throw new ApiError(404, "Product not found");
  res.json({ success: true, product });
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true, isActive: true })
    .populate("category", "name slug")
    .limit(8);
  res.json({ success: true, count: products.length, products });
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new ApiError(404, "Product not found");
  res.json({ success: true, product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");
  res.json({ success: true, message: "Product deleted" });
});
