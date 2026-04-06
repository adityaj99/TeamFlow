import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import {
  getMyOrganizations,
  switchOrganization,
} from "./membership.controller.js";

const router = express.Router();

router.get("/my-org", protect, getMyOrganizations);
router.post("/switch-org", protect, switchOrganization);

export default router;
