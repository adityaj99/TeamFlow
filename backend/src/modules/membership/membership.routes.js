import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { requireActiveOrg } from "../../middlewares/org.middleware.js";
import {
  getMyOrganizations,
  switchOrganization,
  updateMemberRole,
} from "./membership.controller.js";

const router = express.Router();

router.get("/my-org", protect, getMyOrganizations);
router.post("/switch-org", protect, switchOrganization);
router.patch("/role", protect, requireActiveOrg, updateMemberRole);

export default router;
