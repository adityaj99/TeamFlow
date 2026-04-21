import Membership from "./membership.model.js";

export const getUserOrganizatoions = async (userId) => {
  const memberships = await Membership.find({
    user: userId,
    status: "active",
  }).populate("organization");
  return memberships;
};

export const switchOrg = async (userId, orgId) => {
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

export const updateRoleService = async ({
  userId,
  role,
  orgId,
  requesterId,
}) => {
  const allowedRoles = ["admin", "manager", "member"];

  if (!allowedRoles.includes(role)) {
    const error = new Error("Invalid role");
    error.status = 400;
    throw error;
  }

  console.log(requesterId, orgId);

  const requester = await Membership.findOne({
    user: requesterId,
    organization: orgId,
  });

  console.log("Requester", requester);

  if (!requester || requester.role !== "owner") {
    const error = new Error("Only owner can update roles");
    error.status = 403;
    throw error;
  }

  const member = await Membership.findOne({
    user: userId,
    organization: orgId,
  });

  if (!member) {
    const error = new Error("Member not found");
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
