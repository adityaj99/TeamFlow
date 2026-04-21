import Membership from "../membership/membership.model.js";
import Project from "../project/project.model.js";
import Task from "../task/task.model.js";
import Organization from "./org.model.js";

export const createOrganization = async (userId, { name, description }) => {
  const slug = name.toLowerCase().replace(/\s+/g, "-");

  const existingOrg = await Organization.findOne({ slug });
  if (existingOrg) {
    const error = new Error("Organization with this name already exists");
    error.status = 400;
    throw error;
  }

  const org = await Organization.create({
    name,
    description,
    owner: userId,
    slug,
  });

  await Membership.create({
    user: userId,
    organization: org._id,
    role: "owner",
  });

  return org;
};

export const updateOrganizationService = async ({
  userId,
  orgId,
  name,
  description,
}) => {
  if (name.length <= 0) {
    const error = new Error("Name of a organization is required");
    error.status = 400;
    throw error;
  }

  const membership = await Membership.findOne({
    user: userId,
    organization: orgId,
    status: "active",
  });

  if (!membership) {
    const error = new Error("Not part of this organization");
    error.status = 403;
    throw error;
  }

  if (!["owner"].includes(membership.role)) {
    const error = new Error("Not authorized to update workspace");
    error.status = 403;
    throw error;
  }

  const org = await Organization.findById(orgId);

  if (!org) {
    const error = new Error("Organization not found");
    error.status = 404;
    throw error;
  }

  if (name) org.name = name;
  if (description !== undefined) org.description = description;

  await org.save();
  return org;
};

export const deleteOrgnizationService = async ({ userId, orgId }) => {
  const membership = await Membership.findOne({
    user: userId,
    organization: orgId,
  });

  if (!membership || membership.role !== "owner") {
    const error = new Error("Only owner can delete workspace");
    error.status = 403;
    throw error;
  }

  await Promise.all([
    Project.deleteMany({ organization: orgId }),
    Task.deleteMany({ organization: orgId }),
    Membership.deleteMany({ organization: orgId }),
  ]);

  await Organization.findByIdAndDelete(orgId);
};
