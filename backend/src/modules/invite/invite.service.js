import crypto from "crypto";
import Invite from "./invite.model.js";
import User from "../user/user.model.js";
import Membership from "../membership/membership.model.js";
import { sendEmail } from "../../utils/email.js";

export const createInviteService = async ({ email, role, orgId }, next) => {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const existingInvite = await Invite.findOne({
    email,
    organization: orgId,
    status: "pending",
  });

  if (existingInvite) {
    const error = new Error("An active invite already exists for this email");
    error.status = 400;
    next(error);
  }

  const invite = await Invite.create({
    email,
    role,
    organization: orgId,
    token,
    expiresAt,
  });

  const inviteLink = `${process.env.FRONTEND_URL}/accept-invite?token=${token}`;

  await sendEmail({
    to: email,
    subject: "You're invited to join an organization on TeamFlow",
    html: `
      <p>You have been invited to join an organization on TeamFlow as a ${role}.</p>
      <p>Click the link below to accept the invite:</p>
      <a href="${inviteLink}">Accept Invite</a>
      <p>This invite will expire in 24 hours.</p>
    `,
  });

  return invite;
};

export const validateInvite = async (invite, next) => {
  if (!invite) {
    const error = new Error("Invalid or expired invite token");
    error.status = 400;
    next(error);
  }

  if (invite.status !== "pending") {
    const error = new Error("Invite has already been accepted or expired");
    error.status = 400;
    next(error);
  }

  if (invite.expiresAt < new Date()) {
    invite.status = "expired";
    await invite.save();
    const error = new Error("Invite token has expired");
    error.status = 400;
    next(error);
  }
};

export const acceptInviteService = async ({ token, userId }, next) => {
  const invite = await Invite.findOne({ token });

  await validateInvite(invite, next);

  const user = await User.findById(userId);

  if (user.email !== invite.email) {
    const error = new Error("This invite is not for your email address");
    error.status = 400;
    next(error);
  }

  const existing = await Membership.findOne({
    user: userId,
    organization: invite.organization,
  });

  if (existing) {
    const error = new Error("Already a member of this organization");
    error.status = 400;
    next(error);
  }

  await Membership.create({
    user: userId,
    organization: invite.organization,
    role: invite.role,
  });

  invite.status = "accepted";
  await invite.save();

  return invite;
};

export const resendInviteService = async (inviteId, next) => {
  const invite = await Invite.findById(inviteId);

  if (!invite) {
    const error = new Error("Invite not found");
    error.status = 404;
    next(error);
  }

  if (invite.status === "accepted") {
    const error = new Error("Cannot resend an accepted invite");
    error.status = 400;
    next(error);
  }

  invite.token = crypto.randomBytes(32).toString("hex");
  invite.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  invite.status = "pending";
  await invite.save();
  return invite;
};
