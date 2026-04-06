import { getUserOrganizatoions } from "./membership.service.js";

export const getMyOrganizations = async (req, res) => {
  try {
    const org = await getUserOrganizatoions(req.user._id);
    res.json({
      organization: org,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
