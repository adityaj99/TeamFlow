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
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const token = generateToken({ userId: user._id });

  return { token };
};

const getProfileService = async (userId, orgId) => {
  const userPromise = await User.findById(userId).select("-password").lean();

  const membershipPromise = orgId
    ? await Membership.findOne({
        user: userId,
        organization: orgId,
        status: "active",
      })
        .select("role organization")
        .lean()
    : Promise.resolve(null);

  const [user, membership] = await Promise.all([
    userPromise,
    membershipPromise,
  ]);

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  return { user, membership };
};

const updateUserProfileService = async (userId, data) => {
  const user = await User.findByIdAndUpdate(userId, data, {
    returnDocument: "after",
    runValidators: true,
  }).select("-password");

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  return user;
};

const updatePasswordService = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  if (!user.password) {
    const error = new Error(
      "You signed up with a third-party provider and do not have a password.",
    );
    error.status = 400;
    throw error;
  }

  const isMatch = await comparePassword(currentPassword, user.password);

  if (!isMatch) {
    const error = new Error("Incorrect current password");
    error.status = 400;
    throw error;
  }

  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword;

  await user.save();

  return;
};

export {
  registerUser,
  loginUser,
  getProfileService,
  updateUserProfileService,
  updatePasswordService,
};
