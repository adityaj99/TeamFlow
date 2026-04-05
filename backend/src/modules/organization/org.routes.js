import express from "express";
import { createOrg } from "./org.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createOrg);

export default router;
