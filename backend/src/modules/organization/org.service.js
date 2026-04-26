import mongoose from "mongoose";
import Audit from "../audit/audit.model.js";
import Comment from "../comment/comment.model.js";
import Invite from "../invite/invite.model.js";
import Membership from "../membership/membership.model.js";
import Notification from "../notification/notification.model.js";
import Project from "../project/project.model.js";
import Task from "../task/task.model.js";
import Organization from "./org.model.js";

import slugify from "slugify";

export const createOrganization = async (userId, { name, description }) => {
  const baseSlug = slugify(name, { lower: true, strict: true, trim: true });
  const slug = `${baseSlug}-${Date.now()}`;

  const existingOrg = await Organization.findOne({ slug });
  if (existingOrg) {
    const error = new Error("Organization with this name already exists");
    error.status = 400;
    throw error;
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const org = new Organization({
      name,
      description,
      owner: userId,
      slug,
    });

    await org.save({ session });

    const membership = new Membership({
      user: userId,
      organization: org._id,
      role: "owner",
    });

    await membership.save({ session });

    await session.commitTransaction();

    return org;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const updateOrganizationService = async ({
  orgId,
  name,
  description,
  role,
}) => {
  if (role !== "owner") {
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

export const deleteOrgnizationService = async ({ orgId, role }) => {
  if (role !== "owner") {
    const error = new Error("Only owner can delete workspace");
    error.status = 403;
    throw error;
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    await Project.deleteMany({ organization: orgId }, { session });
    await Task.deleteMany({ organization: orgId }, { session });
    await Membership.deleteMany({ organization: orgId }, { session });
    await Comment.deleteMany({ organization: orgId }, { session });
    await Notification.deleteMany({ organization: orgId }, { session });
    await Invite.deleteMany({ organization: orgId }, { session });
    await Audit.deleteMany({ organization: orgId }, { session });

    await Organization.findByIdAndDelete(orgId, { session });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
