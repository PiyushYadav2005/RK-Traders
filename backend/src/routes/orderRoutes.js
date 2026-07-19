import { Router } from "express";
import {
  createGuestOrder,
  getOrder,
  getOrderById,
  listOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";
import { protectAdmin } from "../middleware/auth.js";

const router = Router();

// IMPORTANT: Static routes must come BEFORE dynamic /:param routes.
// GET / was previously matched by GET /:orderNumber with orderNumber="",
// causing "next is not a function" on the admin orders page.
router.get("/", protectAdmin, listOrders);           // ✅ admin list — must be first
router.post("/guest", createGuestOrder);              // ✅ public guest checkout
router.get("/:orderNumber", getOrder);               // ✅ public order lookup by order number
router.get("/id/:id", protectAdmin, getOrderById);   // ✅ admin fetch by MongoDB _id
router.patch("/:id/status", protectAdmin, updateOrderStatus);
router.delete("/:id", protectAdmin, deleteOrder);

export default router;
