import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { requireActiveOrg } from "../../middlewares/org.middleware.js";
import { createProject, getProjects } from "./project.controller.js";
import { allowRoles } from "../../middlewares/rbac.middleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  requireActiveOrg,
  allowRoles("owner", "admin"),
  createProject,
);

router.get("/", protect, requireActiveOrg, getProjects);

export default router;
