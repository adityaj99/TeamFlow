import Membership from "../membership/membership.model.js";
import Organization from "./org.model.js";

export const createOrganization = async (userId, { name, description }) => {
  const slug = name.toLowerCase().replace(/\s+/g, "-");

  const existingOrg = await Organization.findOne({ slug });
  if (existingOrg) {
    throw new Error("Organization with this name already exists");
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
