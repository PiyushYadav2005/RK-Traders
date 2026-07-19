import { Router } from "express";
import {
  createWholesaleRequest,
  listWholesaleRequests,
  updateWholesaleRequestStatus,
} from "../controllers/wholesaleRequestController.js";
import { protectAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/", createWholesaleRequest);
router.get("/", protectAdmin, listWholesaleRequests);
router.patch("/:id/status", protectAdmin, updateWholesaleRequestStatus);

export default router;
