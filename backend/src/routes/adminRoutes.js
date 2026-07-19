import { Router } from "express";
import { getDashboardSummary, listCustomers } from "../controllers/adminController.js";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import { protectAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/dashboard", protectAdmin, getDashboardSummary);
router.get("/customers", protectAdmin, listCustomers);
router.get("/settings", protectAdmin, getSettings);
router.put("/settings", protectAdmin, updateSettings);

export default router;
