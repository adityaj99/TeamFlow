import { createOrganization } from "./org.service.js";

export const createOrg = async (req, res) => {
  try {
    const org = await createOrganization(req.user._id, req.body);
    res.status(201).json({ message: "Organization created", org });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
