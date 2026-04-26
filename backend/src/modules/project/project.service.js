import Project from "./project.model.js";
import Task from "../task/task.model.js";
import { createAuditLog } from "../audit/audit.service.js";
import mongoose from "mongoose";

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
    filter.$text = { $search: query.q };
  }

  const [projects, total] = await Promise.all([
    Project.find(filter)
      .populate("createdBy", "name avatar")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean(),
    Project.countDocuments(filter),
  ]);

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

export const deleteProjectService = async (projectId, orgId, userId) => {
  const project = await Project.findOne({
    _id: projectId,
    organization: orgId,
  });

  if (!project) {
    const error = new Error("Project not found");
    error.status = 404;
    throw error;
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    await Task.deleteMany({ project: projectId }, { session });
    await project.deleteOne({ session });

    await createAuditLog({
      action: "DELETE_PROJECT",
      userId: user._id,
      orgId: project.organization,
      targetId: project._id,
      targetType: "Project",
    });

    await session.commitTransaction();

    return true;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
