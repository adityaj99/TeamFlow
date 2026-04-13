import {
  acceptInviteService,
  createInviteService,
  resendInviteService,
} from "./invite.service.js";

export const createInvite = async (req, res, next) => {
  try {
    const { email, role } = req.body;

    const invite = await createInviteService(
      {
        email,
        role,
        orgId: req.orgId,
      },
      next,
    );

    res.status(201).json({
      success: true,
      message: "Invite created",
      data: {
        token: invite.token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const acceptInvite = async (req, res, next) => {
  try {
    const { token } = req.body;

    await acceptInviteService(
      {
        token,
        userId: req.user._id,
      },
      next,
    );

    res.json({
      success: true,
      message: "Successfully joined the organization",
    });
  } catch (error) {
    next(error);
  }
};

export const resendInvite = async (req, res, next) => {
  try {
    const { inviteId } = req.body;
    const invite = await resendInviteService(inviteId, next);
    res.json({
      success: true,
      message: "Invite resent",
      data: {
        token: invite.token,
      },
    });
  } catch (error) {
    next(error);
  }
};
