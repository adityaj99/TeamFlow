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
    throw new Error("Access denied to this organization");
  }

  return membership;
};
