import jwt from "jsonwebtoken";
import User from "../modules/user/user.model.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.tf_token;

    if (!token) {
      const error = new Error("Not authorized, token missing");
      error.status = 401;
      return next(error);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      const error = new Error("Not authorized, user not found");
      error.status = 401;
      return next(error);
    }

    req.user = user;

    next();
  } catch (error) {
    error.status = 401;
    error.message = "Invalid or expired token";
    next(error);
  }
};
