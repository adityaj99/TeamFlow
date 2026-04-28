import { createAuditLog } from "../audit/audit.service.js";
import Membership from "../membership/membership.model.js";
import { createNotifcationService } from "../notification/notification.service.js";
import User from "../user/user.model.js";
import Task from "./task.model.js";

const transitions = {
  todo: ["in_progress"],
  in_progress: ["submitted"],
  submitted: ["approved", "rejected", "in_progress"], // admin only
  approved: [],
  rejected: ["in_progress"], // optional
};

export const createTaskService = async (userId, orgId, data) => {
  const task = await Task.create({
    ...data,
    organization: orgId,
    createdBy: userId,
  });

  const membership = await Membership.findOne({
    user: data.assignedTo,
    organization: orgId,
  }).lean();

  if (!membership) {
    const error = new Error("User not found in this organization");
    error.status = 404;
    throw error;
  }

  if (data.assignedTo) {
    await createNotifcationService({
      userId: data.assignedTo,
      orgId,
      type: "TASK_ASSIGNED",
      message: `You have been assigned a new task: ${task.title}`,
      relatedId: task._id,
    });
  }

  return task;
};

export const getTasksService = async (orgId, query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = { organization: orgId };

  if (query.projectId) {
    filter.project = query.projectId;
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.priority) {
    filter.priority = query.priority;
  }

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  let tasks;

  if (query.projectId) {
    tasks = await Task.find(filter)
      .populate("assignedTo", "name email avatar")
      .populate("createdBy", "name avatar")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();
  } else {
    tasks = await Task.find(filter)
      .populate("assignedTo", "name email avatar")
      .populate("project", "name")
      .populate("createdBy", "name avatar")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();
  }

  const total = await Task.countDocuments(filter);

  return {
    tasks,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const updateTaskStatusService = async (
  taskId,
  orgId,
  user,
  updateData,
) => {
  const task = await Task.findOne({ _id: taskId, organization: orgId });

  if (!task) {
    const error = new Error("Task not found");
    error.status = 404;
    throw error;
  }

  const { status, submission } = updateData;

  const currentStatus = task.status;
  const nextStatus = status;

  const isAdmin = ["admin", "owner", "manager"].includes(user.role);
  const isAssigned = task.assignedTo?.toString() === user._id.toString();

  if (!isAdmin && !isAssigned) {
    const error = new Error("Not allowed to update task");
    error.status = 403;
    throw error;
  }

  if (status === currentStatus) {
    return task;
  }

  const allowedTransitions = transitions[currentStatus] || [];

  if (!allowedTransitions.includes(nextStatus)) {
    const error = new Error(
      `Invalid status transition from ${currentStatus} to ${nextStatus}`,
    );
    error.status = 400;
    throw error;
  }

  if (!isAdmin && currentStatus === "submitted") {
    const error = new Error("Task already submitted. Cannot modify.");
    error.status = 400;
    throw error;
  }

  if (nextStatus === "submitted") {
    if (
      !submission?.note &&
      (!submission?.attachments || submission.attachments.length === 0)
    ) {
      const error = new Error("Submission must include a note or attachments");
      error.status = 400;
      throw error;
    }

    task.submission = {
      note: submission.note || "",
      attachments: submission.attachments || [],
      submittedAt: new Date(),
    };
  }

  if (["approved", "rejected"].includes(nextStatus)) {
    if (!isAdmin) {
      const error = new Error("Not allowed to approve/reject");
      error.status = 403;
      throw error;
    }

    if (currentStatus !== "submitted") {
      const error = new Error("Task must be submitted before approval");
      error.status = 400;
      throw error;
    }
  }

  task.status = nextStatus;

  await task.save();

  if (status === "submitted") {
    await createNotifcationService({
      userId: task.createdBy,
      orgId: task.organization,
      type: "TASK_SUBMITTED",
      message: `${user.name} submitted task ${task.title}`,
      relatedId: task._id,
    });
  }

  if (status === "approved") {
    await createNotifcationService({
      userId: task.assignedTo,
      orgId: task.organization,
      type: "TASK_APPROVED",
      message: `Your task ${task.title} was approved`,
      relatedId: task._id,
    });
  }

  if (status === "rejected") {
    await createNotifcationService({
      userId: task.assignedTo,
      orgId: task.organization,
      type: "TASK_REJECTED",
      message: `Your task ${task.title} was rejected`,
      relatedId: task._id,
    });
  }

  await createAuditLog({
    action: "UPDATE_STATUS",
    userId: user._id,
    orgId: task.organization,
    targetId: task._id,
    targetType: "Task",
    metadata: {
      from: currentStatus,
      to: nextStatus,
    },
  });

  return task;
};

export const updateTaskService = async (taskId, orgId, user, data) => {
  const task = await Task.findOne({ _id: taskId, organization: orgId });

  if (!task) {
    const error = new Error("Task not found");
    error.status = 404;
    throw error;
  }

  if (data.status && data.status !== task.status) {
    const error = new Error("Status cannot be updated via this endpoint");
    error.status = 400;
    throw error;
  }

  Object.assign(task, data);
  await task.save();

  if (data.title || data.dueDate || data.priority) {
    if (task.assignedTo) {
      await createNotifcationService({
        userId: task.assignedTo,
        orgId: task.organization,
        type: "TASK_ASSIGNED",
        message: `Task ${task.title} has been updated`,
        relatedId: task._id,
      });
    }
  }

  await createAuditLog({
    action: "UPDATE_TASK",
    userId: user._id,
    orgId: task.organization,
    targetId: task._id,
    targetType: "Task",
    metadata: {
      updatedFields: Object.keys(data),
    },
  });

  return task;
};

export const deleteTaskService = async (taskId, orgId, user) => {
  const task = await Task.findOne({ _id: taskId, organization: orgId });

  if (!task) {
    const error = new Error("Task not found");
    error.status = 404;
    throw error;
  }

  await task.deleteOne();

  await createAuditLog({
    action: "Delete_Task",
    userId: user._id,
    orgId: task.organization,
    targetId: task._id,
    targetType: "Task",
  });

  return true;
};
