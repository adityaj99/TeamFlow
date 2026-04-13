import Membership from "./membership.model.js";
import { getUserOrganizatoions, switchOrg } from "./membership.service.js";

export const getMyOrganizations = async (req, res, next) => {
  try {
    const org = await getUserOrganizatoions(req.user._id);
    res.status(200).json({
      success: true,
      organization: org,
    });
  } catch (error) {
    next(error);
  }
};

export const switchOrganization = async (req, res, next) => {
  try {
    const { orgId } = req.body;

    await switchOrg(req.user._id, orgId);

    res.cookie("activeOrg", orgId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({ success: true, message: "Organization switched successfully" });
  } catch (error) {
    next(error);
  }
};
