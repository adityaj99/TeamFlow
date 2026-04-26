import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { requireActiveOrg } from "../../middlewares/org.middleware.js";
import {
  getMyOrganizations,
  removeMember,
  switchOrganization,
  updateMemberRole,
} from "./membership.controller.js";
import { allowRoles } from "../../middlewares/rbac.middleware.js";

const router = express.Router();

router.get("/my-org", protect, getMyOrganizations);
router.post("/switch-org", protect, switchOrganization);
router.patch(
  "/role",
  protect,
  requireActiveOrg,
  allowRoles("owner"),
  updateMemberRole,
);

router.delete(
  "/:userId",
  protect,
  requireActiveOrg,
  allowRoles("owner", "admin"),
  removeMember,
);

export default router;
