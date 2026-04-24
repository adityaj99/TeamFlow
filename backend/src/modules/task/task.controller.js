import {
  createTaskSchema,
  updateTaskStatusSchema,
} from "../../validations/task.validation.js";
import {
  createTaskService,
  deleteTaskService,
  getTasksService,
  updateTaskService,
  updateTaskStatusService,
} from "./task.service.js";

export const createTask = async (req, res, next) => {
  try {
    const validatedData = createTaskSchema.parse(req.body);

    const task = await createTaskService(
      req.user._id,
      req.orgId,
      validatedData,
    );

    res.status(201).json({
      success: true,
      message: "Task created",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    console.log("Get Tasks Query:", req.query);

    const result = await getTasksService(req.orgId, req.query);
    res.json({
      success: true,
      data: result.tasks,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    next(error);
  }
};

export const updateTaskStatus = async (req, res, next) => {
  try {
    const validatedData = updateTaskStatusSchema.parse(req.body);

    const task = await updateTaskStatusService(
      req.params.id,
      {
        _id: req.user._id,
        role: req.role,
      },
      validatedData,
    );
    res
      .status(200)
      .json({ success: true, message: "Task updated", data: task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const validatedData = createTaskSchema.parse(req.body);

    const task = await updateTaskService(
      req.params.id,
      {
        _id: req.user._id,
        role: req.role,
      },
      validatedData,
    );
    res
      .status(200)
      .json({ success: true, message: "Task updated", data: task });
  } catch (error) {
    console.error("Error updating task:", error);
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    await deleteTaskService(req.params.id, {
      _id: req.user._id,
      role: req.role,
    });

    res.status(200).json({
      success: true,
      message: "Task deleted",
    });
  } catch (error) {
    next(error);
  }
};
