import { Router } from "express";
import {
  registerDealer,
  getMyDealerProfile,
  listDealers,
  updateDealerStatus,
} from "../controllers/dealerController.js";
import { protect, protectAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/", protect, registerDealer);
router.get("/me", protect, getMyDealerProfile);
router.get("/", protectAdmin, listDealers);
router.patch("/:id/status", protectAdmin, updateDealerStatus);

export default router;
