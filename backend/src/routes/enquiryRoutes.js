import { Router } from "express";
import { createEnquiry, listEnquiries } from "../controllers/enquiryController.js";
import { protectAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/", createEnquiry);
router.get("/", protectAdmin, listEnquiries);

export default router;
