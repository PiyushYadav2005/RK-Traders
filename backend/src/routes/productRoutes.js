import { Router } from "express";
import {
  listProducts,
  getProduct,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protectAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", listProducts);
router.get("/featured", getFeaturedProducts);
router.get("/:slug", getProduct);
router.post("/", protectAdmin, createProduct);
router.put("/:id", protectAdmin, updateProduct);
router.delete("/:id", protectAdmin, deleteProduct);

export default router;
