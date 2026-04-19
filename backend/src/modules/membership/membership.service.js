import Membership from "./membership.model.js";

export const getUserOrganizatoions = async (userId) => {
  const memberships = await Membership.find({
    user: userId,
    status: "active",
  }).populate("organization");
  return memberships;
};

export const switchOrg = async (userId, orgId) => {
  console.log("User:", userId);
  console.log("OrgId:", orgId);

  const membership = await Membership.findOne({
    user: userId,
    organization: orgId,
    status: "active",
  });

  console.log("membership", membership);

  if (!membership) {
    const error = new Error("Access denied to this organization");
    error.status = 403;
    throw error;
  }

  return membership;
};
