import express from "express";
import { getNotification } from "./notification.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getNotification);

export default router;
