import {
  loginSchema,
  registerSchema,
} from "../../validations/auth.validation.js";
import {
  getProfileService,
  loginUser,
  registerUser,
  updateUserProfileService,
} from "./user.service.js";
import { updateProfileSchema } from "../../validations/user.validation.js";

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
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await getProfileService(req.user._id);

    res.status(200).json({
      success: true,
      data: user,
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

export { register, login, getProfile, updateProfile };
