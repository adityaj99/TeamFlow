import express from "express";
import { createComment, getComments } from "./comment.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { requireActiveOrg } from "../../middlewares/org.middleware.js";

const router = express.Router();

router.post("/", protect, requireActiveOrg, createComment);
router.get("/:taskId", protect, requireActiveOrg, getComments);

export default router;
