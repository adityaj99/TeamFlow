import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

import userRoutes from "./modules/user/user.routes.js";
import orgRoutes from "./modules/organization/org.routes.js";
import membershipRoutes from "./modules/membership/membership.routes.js";
import inviteRoutes from "./modules/invite/invite.routes.js";
import projectRoutes from "./modules/project/project.routes.js";
import taskRoutes from "./modules/task/task.routes.js";

import { protect } from "./middlewares/auth.middleware.js";
import { requireActiveOrg } from "./middlewares/org.middleware.js";
import { allowRoles } from "./middlewares/rbac.middleware.js";

app.use(cors());
app.use(express.json());
app.use(cookieParser());

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

export default app;
