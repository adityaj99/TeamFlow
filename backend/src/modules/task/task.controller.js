import {
  createTaskSchema,
  updateTaskStatusSchema,
} from "../../validations/task.validation.js";
import {
  createTaskService,
  getTasksService,
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
    const result = await getTasksService(req.orgId, req.query);
    res.json({
      success: true,
      data: result.tasks,
      pagination: result.pagination,
    });
  } catch (error) {
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
      next,
    );
    res
      .status(200)
      .json({ success: true, message: "Task updated", data: task });
  } catch (error) {
    next(error);
  }
};
