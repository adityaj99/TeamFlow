import { generateToken } from "../../utils/generateToken.js";
import { comparePassword, hashPassword } from "../../utils/hashPassword.js";
import Membership from "../membership/membership.model.js";
import User from "./user.model.js";

const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = new Error("User already exists");
    error.status = 400;
    throw error;
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return user;
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("Invalid credentials");
    error.status = 400;
    throw error;
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.status = 400;
    throw error;
  }

  const token = generateToken({ userId: user._id });

  return { token };
};

const getProfileService = async (userId, orgId) => {
  const user = await User.findById(userId).select("-password").lean();

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  let membership = null;

  if (orgId) {
    membership = await Membership.findOne({
      user: userId,
      organization: orgId,
      status: "active",
    })
      .select("role organization")
      .lean();
  }

  return { user, membership };
};

const updateUserProfileService = async (userId, data) => {
  const user = await User.findByIdAndUpdate(userId, data, {
    returnDocument: "after",
  }).select("-password");

  console.log("User", user);

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  return user;
};

export { registerUser, loginUser, getProfileService, updateUserProfileService };
