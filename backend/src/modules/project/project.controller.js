import { createProjectSchema } from "../../validations/project.validation.js";
import {
  createProjectService,
  deleteProjectService,
  getProjectByIdService,
  getProjectsService,
} from "./project.service.js";

export const createProject = async (req, res, next) => {
  try {
    const validatedData = createProjectSchema.parse(req.body);

    const userId = req.user._id;
    const orgId = req.orgId;

    const project = await createProjectService(userId, orgId, validatedData);
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const result = await getProjectsService(req.orgId, req.query);
    res.status(200).json({
      success: true,
      data: result.projects,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await getProjectByIdService(req.orgId, req.params.id);
    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    await deleteProjectService(req.params.id, {
      _id: req.user._id,
      role: req.role,
    });

    res.status(200).json({
      success: true,
      message: "Project deleted",
    });
  } catch (error) {
    next(error);
  }
};
