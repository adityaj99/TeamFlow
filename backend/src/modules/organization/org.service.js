import Membership from "../membership/membership.model.js";
import Organization from "./org.model.js";

export const createOrganization = async (userId, { name, description }) => {
  const slug = name.toLowerCase().replace(/\s+/g, "-");

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
