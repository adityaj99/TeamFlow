import express from "express";

import { protect } from "../../middlewares/auth.middleware.js";
import { requireActiveOrg } from "../../middlewares/org.middleware.js";
import { allowRoles } from "../../middlewares/rbac.middleware.js";
import { createTask, getTasks, updateTaskStatus } from "./task.controller.js";

const router = express.Router();

router.post(
  "/",
  protect,
  requireActiveOrg,
  allowRoles("owner", "admin", "manager"),
  createTask,
);

router.get("/", protect, requireActiveOrg, getTasks);

router.patch("/:id", protect, requireActiveOrg, updateTaskStatus);

export default router;
