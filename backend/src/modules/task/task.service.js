import { createAuditLog } from "../audit/audit.service.js";
import { createNotifcationService } from "../notification/notification.service.js";
import Task from "./task.model.js";

export const createTaskService = async (userId, orgId, data) => {
  const task = await Task.create({
    ...data,
    organization: orgId,
    createdBy: userId,
  });

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

  if (query.q) {
    filter.$or = [
      { title: { $regex: query.q, $options: "i" } },
      { description: { $regex: query.q, $options: "i" } },
    ];
  }

  const tasks = await Task.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

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
  user,
  updateData,
  next,
) => {
  const task = await Task.findById(taskId);

  if (!task) {
    const error = new Error("Task not found");
    error.status = 404;
    next(error);
  }

  const { status, submission } = updateData;

  if (!["approved", "rejected"].includes(status)) {
    if (task.assignedTo?.toString() !== user._id.toString()) {
      const error = new Error("Not allowed to update status");
      error.status = 403;
      next(error);
    }
  }

  if (status === "submitted") {
    if (
      !submission?.note &&
      (!submission?.attachments || submission.attachments.length === 0)
    ) {
      const error = new Error("Submission must include a note or attachments");
      error.status = 400;
      next(error);
    }

    task.submission = {
      note: submission.note || "",
      attachments: submission.attachments || [],
      submittedAt: new Date(),
    };
  }

  if (["approved", "rejected"].includes(status)) {
    if (!["admin", "owner", "manager"].includes(user.role)) {
      const error = new Error("Not allowed to approve/reject");
      error.status = 403;
      next(error);
    }

    if (task.status !== "submitted") {
      const error = new Error("Task must be submitted before approval");
      error.status = 400;
      next(error);
    }
  }

  task.status = status;

  await task.save();

  await createAuditLog({
    action: "UPDATE_TASK",
    userId: user._id,
    orgId: task.organization,
    targetId: task._id,
    targetType: "Task",
    metadata: {
      newStatus: task.status,
    },
  });

  return task;
};
