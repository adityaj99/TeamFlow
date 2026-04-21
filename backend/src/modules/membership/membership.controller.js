import Membership from "./membership.model.js";
import {
  getUserOrganizatoions,
  switchOrg,
  updateRoleService,
} from "./membership.service.js";

export const getMyOrganizations = async (req, res, next) => {
  try {
    const org = await getUserOrganizatoions(req.user._id);
    res.status(200).json({
      success: true,
      data: org,
    });
  } catch (error) {
    next(error);
  }
};

export const switchOrganization = async (req, res, next) => {
  try {
    const { orgId } = req.body;

    console.log(req.body);

    await switchOrg(req.user._id, orgId);

    res.cookie("activeOrg", orgId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.json({ success: true, message: "Organization switched successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateMemberRole = async (req, res, next) => {
  try {
    const { userId, role } = req.body;

    const updated = await updateRoleService({
      userId,
      role,
      orgId: req.orgId,
      requesterId: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "role updated",
      data: updated,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
