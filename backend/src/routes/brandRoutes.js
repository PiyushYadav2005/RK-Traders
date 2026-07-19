import { Router } from "express";
import { listBrands, createBrand, updateBrand, deleteBrand } from "../controllers/brandController.js";
import { protectAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", listBrands); // public — product filters/brand marquee use this too
router.post("/", protectAdmin, createBrand);
router.put("/:id", protectAdmin, updateBrand);
router.delete("/:id", protectAdmin, deleteBrand);

export default router;
