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
    filter.project = projectId;
  }

  const [totalTasks, completedTasks, pendingTasks, overdueTasks] =
    await Promise.all([
      await Task.countDocuments(filter),
      await Task.countDocuments({
        ...filter,
        status: { $in: ["approved", "submitted"] },
      }),
      await Task.countDocuments({
        ...filter,
        status: { $in: ["todo", "in_progress", "rejected"] },
      }),
      await Task.countDocuments({
        ...filter,
        dueDate: { $lt: new Date() },
        status: { $ne: "submitted" },
      }),
    ]);

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
  };
};
