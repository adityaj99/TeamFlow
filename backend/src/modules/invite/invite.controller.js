import { createInviteService } from "./invite.service.js";

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
