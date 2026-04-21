import express from "express";
import {
  createOrg,
  getMembersOfOrg,
  getActiveOrg,
  updateOrganization,
  deleteOrgnization,
} from "./org.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { requireActiveOrg } from "../../middlewares/org.middleware.js";

const router = express.Router();

router.post("/", protect, createOrg);
router.get("/members", protect, requireActiveOrg, getMembersOfOrg);
router.get("/current", protect, requireActiveOrg, getActiveOrg);
router.patch("/", protect, requireActiveOrg, updateOrganization);
router.delete("/", protect, requireActiveOrg, deleteOrgnization);

export default router;
