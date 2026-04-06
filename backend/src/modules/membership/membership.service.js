import Membership from "./membership.model.js";

export const getUserOrganizatoions = async (userId) => {
  const memberships = await Membership.find({
    user: userId,
    status: "active",
  }).populate("organization");
  return memberships;
};
