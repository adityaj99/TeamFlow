import {
  createTaskService,
  getTasksService,
  updateTaskStatusService,
} from "./task.service.js";

export const createTask = async (req, res) => {
  try {
    const task = await createTaskService(req.user._id, req.orgId, req.body);

    res.status(201).json({
      success: true,
      message: "Task created",
      data: task,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;
    const tasks = await getTasksService(req.orgId, projectId);
    res.json({ success: true, message: "Tasks retrieved", data: tasks });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const task = await updateTaskStatusService(
      req.params.id,
      {
        _id: req.user._id,
        role: req.role,
      },
      req.body,
    );
    res.json({ success: true, message: "Task updated", data: task });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
