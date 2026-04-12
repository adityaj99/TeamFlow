export const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.role;

      if (!userRole || !allowedRoles.includes(userRole)) {
        const error = new Error("Access denied: insufficient permissions");
        error.statusCode = 403;
        return next(error);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
