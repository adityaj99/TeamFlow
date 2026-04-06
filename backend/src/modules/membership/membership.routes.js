import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { getMyOrganizations } from "./membership.controller.js";

const router = express.Router();

router.get("/my-org", protect, getMyOrganizations);

export default router;
