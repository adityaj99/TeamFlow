import Membership from "../modules/membership/membership.model.js";

export const requireActiveOrg = async (req, res, next) => {
  try {
    const orgId = req.cookies.activeOrg;

    if (!orgId) {
      return res
        .status(400)
        .json({ success: false, message: "Active organization not set" });
    }

    const membership = await Membership.findOne({
      user: req.user._id,
      organization: orgId,
      status: "active",
    });

    if (!membership) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Access denied for this organization",
        });
    }

    req.orgId = orgId;
    req.role = membership.role;

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
