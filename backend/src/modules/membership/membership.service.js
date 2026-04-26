import Membership from "./membership.model.js";
import Task from "../task/task.model.js";
import { createAuditLog } from "../audit/audit.service.js";

export const getUserOrganizatoions = async (userId) => {
  const memberships = await Membership.find({
    user: userId,
    status: "active",
  })
    .populate("organization", "name description slug avatar")
    .lean();
  return memberships;
};

export const switchOrg = async (userId, orgId) => {
  const isOrgExists = await Organization.findById(orgId);

  if (!isOrgExists) {
    const error = new Error("Organization not found");
    error.status = 404;
    throw error;
  }

  const membership = await Membership.findOne({
    user: userId,
    organization: orgId,
    status: "active",
  });

  if (!membership) {
    const error = new Error("Access denied to this organization");
    error.status = 403;
    throw error;
  }

  return membership;
};

export const updateRoleService = async ({ userId, role, orgId }) => {
  const allowedRoles = ["admin", "manager", "member"];

  if (!allowedRoles.includes(role)) {
    const error = new Error("Invalid role");
    error.status = 400;
    throw error;
  }

  const member = await Membership.findOne({
    user: userId,
    organization: orgId,
    status: "active",
  });

  if (!member) {
    const error = new Error("Member not found in this organization");
    error.status = 404;
    throw error;
  }

  if (member.role === "owner") {
    const error = new Error("Cannot change owner role");
    error.status = 400;
    throw error;
  }

  member.role = role;
  await member.save();

  return member;
};

export const removeMemberService = async ({
  userIdToRemove,
  orgId,
  requesterRole,
  requesterId,
}) => {
  const membership = await Membership.findOne({
    user: userIdToRemove,
    organization: orgId,
  });

  if (!membership || membership.status === "removed") {
    const error = new Error(
      "Member not found or already removed from this organization",
    );
    error.status = 404;
    throw error;
  }

  if (membership.role === "owner") {
    const error = new Error(
      "Cannot remove the workspace owner. Ownership must be transferred first.",
    );
    error.status = 400;
    throw error;
  }

  if (membership.role === "admin" && requesterRole !== "owner") {
    const error = new Error(
      "Admins do not have permission to remove other Admins. Please ask the Owner.",
    );
    error.status = 403;
    throw error;
  }

  membership.status = "removed";
  await membership.save();

  await Task.updateMany(
    {
      assignedTo: userIdToRemove,
      organization: orgId,
    },
    {
      $set: { assignedTo: null },
    },
  );

  await createAuditLog({
    action: "REMOVE_MEMBER",
    userId: requesterId,
    orgId: orgId,
    targetId: userIdToRemove,
    targetType: "User",
    metadata: { previousRole: membership.role },
  });

  return true;
};
