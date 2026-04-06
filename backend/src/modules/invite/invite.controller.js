import { acceptInviteService, createInviteService } from "./invite.service.js";

export const createInvite = async (req, res) => {
  try {
    const { email, role } = req.body;

    const invite = await createInviteService({
      email,
      role,
      orgId: req.orgId,
    });

    res.status(201).json({
      success: true,
      message: "Invite created successfully",
      data: {
        token: invite.token,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const acceptInvite = async (req, res) => {
  try {
    const { token } = req.body;

    await acceptInviteService({
      token,
      userId: req.user._id,
    });

    res.json({
      success: true,
      message: "Successfully joined the organization",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
