import crypto from "crypto";
import Invite from "./invite.model.js";
import User from "../user/user.model.js";
import Membership from "../membership/membership.model.js";

export const createInviteService = async ({ email, role, orgId }) => {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const invite = await Invite.create({
    email,
    role,
    organization: orgId,
    token,
    expiresAt,
  });

  return invite;
};

export const acceptInviteService = async ({ token, userId }) => {
  const invite = await Invite.findOne({ token });

  if (!invite) {
    throw new Error("Invalid or expired invite token");
  }

  if (invite.status !== "pending") {
    throw new Error("Invite has already been accepted or expired");
  }

  if (invite.expiresAt < new Date()) {
    invite.status = "expired";
    await invite.save();
    throw new Error("Invite token has expired");
  }

  const user = await User.findById(userId);

  if (user.email !== invite.email) {
    throw new Error("This invite is not for your email address");
  }

  const existing = await Membership.findOne({
    user: userId,
    organization: invite.organization,
  });

  if (existing) {
    throw new Error("Already a member of this organization");
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
