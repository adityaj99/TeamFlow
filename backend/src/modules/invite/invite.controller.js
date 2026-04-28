import {
  acceptInviteService,
  createInviteService,
  getInviteByTokenService,
  resendInviteService,
} from "./invite.service.js";

export const createInvite = async (req, res, next) => {
  try {
    const { email, role } = req.body;

    const invite = await createInviteService({
      email,
      role,
      orgId: req.orgId,
    });

    res.status(201).json({
      success: true,
      message: "Invite created",
    });
  } catch (error) {
    next(error);
  }
};

export const acceptInvite = async (req, res, next) => {
  try {
    const { token } = req.body;

    const invite = await acceptInviteService({
      token,
      userId: req.user._id,
    });

    res.json({
      success: true,
      message: "Successfully joined the organization",
      data: {
        orgId: invite.organization,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const resendInvite = async (req, res, next) => {
  try {
    const { inviteId } = req.body;
    const invite = await resendInviteService(inviteId, req.orgId);
    res.json({
      success: true,
      message: "Invite resent",
    });
  } catch (error) {
    next(error);
  }
};

export const getInviteByToken = async (req, res, next) => {
  try {
    const data = await getInviteByTokenService(req.params.token);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
