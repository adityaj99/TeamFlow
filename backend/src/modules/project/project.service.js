import Project from "./project.model.js";
import { createAuditLog } from "../audit/audit.service.js";

export const createProjectService = async (
  userId,
  orgId,
  { name, description },
) => {
  const project = await Project.create({
    name,
    description,
    organization: orgId,
    createdBy: userId,
  });

  await createAuditLog({
    action: "CREATE_PROJECT",
    userId,
    orgId,
    targetId: project._id,
    targetType: "Project",
  });

  return project;
};

export const getProjectsService = async (orgId) => {
  const projects = await Project.find({
    organization: orgId,
    status: "active",
  }).sort({ createdAt: -1 });
  return projects;
};
