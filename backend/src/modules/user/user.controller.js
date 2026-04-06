import { loginUser, registerUser } from "./user.service.js";

const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res
      .status(201)
      .json({
        success: true,
        message: "User registered successfully",
        userId: user._id,
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { userId, token } = await loginUser({ email, password });

    res.cookie("tf_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, message: "Login successful" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export { register, login };
