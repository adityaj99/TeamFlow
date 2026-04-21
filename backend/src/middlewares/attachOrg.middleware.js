export const attachOrg = (req, res, next) => {
  try {
    const orgId = req.cookies?.activeOrg;

    if (orgId) {
      req.orgId = orgId;
    }

    next();
  } catch (error) {
    next(error);
  }
};
