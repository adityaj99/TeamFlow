import Project from "./project.model.js";
import Task from "../task/task.model.js";
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

  if (query.q) {
    filter.$or = [
      { name: { $regex: query.q, $options: "i" } },
      { description: { $regex: query.q, $options: "i" } },
    ];
  }

  const projects = await Project.find(filter)
    .populate("createdBy", "name avatar")
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

export const getProjectByIdService = async (orgId, projectId) => {
  const project = await Project.findOne({
    _id: projectId,
    organization: orgId,
    status: "active",
  }).populate("createdBy", "name avatar");

  if (!project) {
    const error = new Error("Project not found");
    error.status = 404;
    throw error;
  }

  return project;
};

export const deleteProjectService = async (projectId, user) => {
  const project = await Project.findById(projectId);

  if (!project) {
    const error = new Error("Project not found");
    error.status = 404;
    throw error;
  }

  const isAdmin = ["owner", "admin"].includes(user.role);

  if (!isAdmin) {
    const error = new Error("Not allowed to delete project");
    error.status = 403;
    throw error;
  }

  await Task.deleteMany({ project: projectId });

  await project.deleteOne();

  await createAuditLog({
    action: "DELETE_PROJECT",
    userId: user._id,
    orgId: project.organization,
    targetId: project._id,
    targetType: "Project",
  });

  return true;
};
