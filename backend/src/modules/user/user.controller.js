import {
  loginSchema,
  registerSchema,
} from "../../validations/auth.validation.js";
import {
  getProfileService,
  loginUser,
  registerUser,
  updatePasswordService,
  updateUserProfileService,
} from "./user.service.js";
import { updateProfileSchema } from "../../validations/user.validation.js";
import User from "./user.model.js";

const register = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const user = await registerUser(validatedData);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: user._id,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const { token } = await loginUser(validatedData);

    res.cookie("tf_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  res.cookie("tf_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    expires: new Date(0),
  });

  res.cookie("activeOrg", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    expires: new Date(0),
  });

  res.status(200).json({ success: true, message: "Logout successful" });
};

const getProfile = async (req, res, next) => {
  try {
    const { user, membership } = await getProfileService(
      req.user._id,
      req.orgId,
    );

    res.status(200).json({
      success: true,
      data: {
        user,
        membership,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const validatedData = updateProfileSchema.parse(req.body);

    const user = await updateUserProfileService(req.user._id, validatedData);

    res.status(200).json({
      success: true,
      message: "Profile updated",
      data: user,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    await updatePasswordService(req.user._id, currentPassword, newPassword);

    res.status(200).json({ success: true, message: "Password updated" });
  } catch (error) {
    next(error);
  }
};

export { register, login, logout, getProfile, updateProfile, updatePassword };
