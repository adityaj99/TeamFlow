import Task from "../task/task.model.js";

export const getStatsService = async ({ scope, projectId, orgId }) => {
  let filter = {};

  if (scope === "org") {
    if (!orgId) {
      const error = new Error("Organization not selected");
      error.status = 400;
      throw error;
    }
    filter.organization = orgId;
  }

  if (scope === "project") {
    if (!projectId) {
      const error = new Error("Project ID required");
      error.status = 400;
      throw error;
    }
    filter.prohect = projectId;
  }

  const totalTasks = await Task.countDocuments(filter);

  const completedTasks = await Task.countDocuments({
    ...filter,
    status: "completed",
  });

  const pendingTasks = await Task.countDocuments({
    ...filter,
    status: "pending",
  });

  const overdueTasks = await Task.countDocuments({
    ...filter,
    dueDate: { $lt: new Date() },
    status: { $ne: "completed" },
  });

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
  };
};
