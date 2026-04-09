import Task from "./task.model.js";

export const createTaskService = async (userId, orgId, data) => {
  const task = await Task.create({
    ...data,
    organization: orgId,
    createdBy: userId,
  });

  return task;
};

export const getTasksService = async (orgId, projectId) => {
  const filter = { organization: orgId };

  if (projectId) {
    filter.project = projectId;
  }

  const tasks = await Task.find(filter);

  return tasks;
};

export const updateTaskStatusService = async (taskId, user, updateData) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new Error("Task not found");
  }

  if (user.role === "member") {
    if (task.assignedTo?.toString() !== user._id.toString()) {
      throw new Error("You can only update your own task");
    }
  }

  const { status, submission } = updateData;

  if (status === "sumbitted") {
    if (!submission || !submission.note) {
      throw new Error("submission note required");
    }
  }

  task.submission = {
    ...submission,
    submittedAt: new Date(),
  };

  if (["approved", "rejected"].includes(status)) {
    if (!["admin", "owner", "manager"].includes(user.role)) {
      throw new Error("Not allowed to approve/reject");
    }
  }

  task.status = status;

  await task.save();

  return task;
};
