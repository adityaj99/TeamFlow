import Project from "./project.model.js";

export const createProjectService = async (
  userId,
  orgId,
  { name, description },
) => {
  const project = await Project.create({
    name,
    description,
    organization: orgId,
    createdBy: userId,
  });

  return project;
};

export const getProjectsService = async (orgId) => {
  const projects = await Project.find({
    organization: orgId,
    status: "active",
  }).sort({ createdAt: -1 });
  return projects;
};
