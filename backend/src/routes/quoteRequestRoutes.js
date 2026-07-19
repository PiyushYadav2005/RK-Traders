import { Router } from "express";
import {
  createQuoteRequest,
  listQuoteRequests,
  updateQuoteStatus,
} from "../controllers/quoteRequestController.js";
import { protectAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/", createQuoteRequest);
router.get("/", protectAdmin, listQuoteRequests);
router.patch("/:id/status", protectAdmin, updateQuoteStatus);

export default router;
