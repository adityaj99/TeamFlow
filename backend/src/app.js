import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
const app = express();

app.set("trust proxy", 1);

import userRoutes from "./modules/user/user.routes.js";
import orgRoutes from "./modules/organization/org.routes.js";
import membershipRoutes from "./modules/membership/membership.routes.js";
import inviteRoutes from "./modules/invite/invite.routes.js";
import projectRoutes from "./modules/project/project.routes.js";
import taskRoutes from "./modules/task/task.routes.js";
import commentRoutes from "./modules/comment/comment.routes.js";
import notificationRoutes from "./modules/notification/notification.routes.js";
import uploadRoutes from "./modules/upload/upload.routes.js";
import statsRoutes from "./modules/stats/stats.routes.js";
import auditRoutes from "./modules/audit/audit.routes.js";

import { protect } from "./middlewares/auth.middleware.js";
import { requireActiveOrg } from "./middlewares/org.middleware.js";
import { allowRoles } from "./middlewares/rbac.middleware.js";
import rateLimit from "express-rate-limit";
import errorHandler from "./middlewares/error.middleware.js";
import { limiter } from "./middlewares/rateLimiter.js";

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(limiter);

app.get("/", (req, res) => {
  res.send("Teamflow is running!");
});

//test routes
app.get("/api/protected", protect, (req, res) => {
  res.send("This is a protected route. User ID: " + req.user._id);
});

app.get("/api/org-data", protect, requireActiveOrg, (req, res) => {
  res.json({
    success: true,
    message: "Org context working",
    data: {
      orgId: req.orgId,
      role: req.role,
    },
  });
});

app.get(
  "/api/admin-only",
  protect,
  requireActiveOrg,
  allowRoles("owner", "admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "Admin access granted",
    });
  },
);

app.use("/api/auth", userRoutes);
app.use("/api/org", orgRoutes);
app.use("/api/membership", membershipRoutes);
app.use("/api/invite", inviteRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/audit", auditRoutes);
app.use(errorHandler);

export default app;
