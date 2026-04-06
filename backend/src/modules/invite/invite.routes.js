import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { requireActiveOrg } from "../../middlewares/org.middleware.js";
import { allowRoles } from "../../middlewares/rbac.middleware.js";
import { acceptInvite, createInvite } from "./invite.controller.js";

const router = express.Router();

router.post(
  "/",
  protect,
  requireActiveOrg,
  allowRoles("owner", "admin"),
  createInvite,
);

router.post("/accept", protect, acceptInvite);

export default router;
