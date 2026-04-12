import Membership from "../modules/membership/membership.model.js";

export const requireActiveOrg = async (req, res, next) => {
  try {
    const orgId = req.cookies.activeOrg;

    if (!orgId) {
      const error = new Error("No active organization selected");
      error.statusCode = 400;
      return next(error);
    }

    const membership = await Membership.findOne({
      user: req.user._id,
      organization: orgId,
      status: "active",
    });

    if (!membership) {
      const error = new Error(
        "User is not a member of the active organization",
      );
      error.statusCode = 403;
      return next(error);
    }

    req.orgId = orgId;
    req.role = membership.role;

    next();
  } catch (error) {
    next(error);
  }
};
