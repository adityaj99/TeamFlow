import { createProjectService, getProjectsService } from "./project.service.js";

export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user._id;
    const orgId = req.orgId;

    if (!name || name.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Project name is required" });
    }

    const project = await createProjectService(userId, orgId, {
      name,
      description,
    });
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await getProjectsService(req.orgId);
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
