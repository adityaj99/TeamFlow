import { createOrganization } from "./org.service.js";

export const createOrg = async (req, res, next) => {
  try {
    const org = await createOrganization(req.user._id, req.body);
    res
      .status(201)
      .json({ success: true, message: "Organization created", org });
  } catch (error) {
    next(error);
  }
};
