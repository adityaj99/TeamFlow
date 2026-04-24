import express from "express";
import { getAuditLogs } from "./audit.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { requireActiveOrg } from "../../middlewares/org.middleware.js";

const router = express.Router();

router.get("/", protect, requireActiveOrg, getAuditLogs);

export default router;
