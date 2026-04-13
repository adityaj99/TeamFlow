import {
  loginSchema,
  registerSchema,
} from "../../validations/auth.validation.js";
import { loginUser, registerUser } from "./user.service.js";

const register = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const user = await registerUser(validatedData, next);
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

    const { token } = await loginUser(validatedData, next);

    res.cookie("tf_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, message: "Login successful" });
  } catch (error) {
    next(error);
  }
};

export { register, login };
