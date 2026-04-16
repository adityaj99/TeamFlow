import express from "express";
import { createOrg, getMembersOfOrg } from "./org.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { requireActiveOrg } from "../../middlewares/org.middleware.js";

const router = express.Router();

router.post("/", protect, createOrg);
router.get("/members", protect, requireActiveOrg, getMembersOfOrg);

export default router;
