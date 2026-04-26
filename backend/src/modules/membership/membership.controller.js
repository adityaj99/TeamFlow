import Membership from "./membership.model.js";
import {
  getUserOrganizatoions,
  removeMemberService,
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

    await switchOrg(req.user._id, orgId);

    res.cookie("activeOrg", orgId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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

export const removeMember = async (req, res, next) => {
  try {
    const { userId } = req.params;

    await removeMemberService({
      userIdToRemove: userId,
      orgId: req.orgId,
      requesterRole: req.role,
      requesterId: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Member has been removed from the organization",
    });
  } catch (error) {
    next(error);
  }
};
