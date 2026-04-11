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

export const getProjectsService = async (orgId, query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {
    organization: orgId,
    status: "active",
  };

  const projects = await Project.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Project.countDocuments(filter);

  return {
    projects,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
