import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { requireActiveOrg } from "../../middlewares/org.middleware.js";
import { getStats } from "./stats.controller.js";

const router = express.Router();

router.get("/", protect, requireActiveOrg, getStats);

export default router;
