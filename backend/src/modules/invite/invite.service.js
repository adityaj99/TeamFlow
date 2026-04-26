import crypto from "crypto";
import Invite from "./invite.model.js";
import User from "../user/user.model.js";
import Membership from "../membership/membership.model.js";
import Organization from "../organization/org.model.js";
import { sendEmail } from "../../utils/email.js";
import mongoose from "mongoose";
import emailQueue from "../../queues/email.queue.js";

export const createInviteService = async ({ email, role, orgId }) => {
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
    throw error;
  }

  const invite = await Invite.create({
    email,
    role,
    organization: orgId,
    token,
    expiresAt,
  });

  const inviteLink = `${process.env.FRONTEND_URL}/accept-invite?token=${token}`;

  await emailQueue.add("send-invite-email", {
    to: email,
    subject: "You're invited to join an organization on TeamFlow",
    html: `
      <p>You have been invited to join an organization on TeamFlow as a ${role}.</p>
      <p>Click the link below to accept the invite:</p>
      <a href="${inviteLink}">Accept Invite</a>
      <p>This invite will expire in 24 hours.</p>
    `,
  });

  return true;
};

export const validateInvite = async (invite) => {
  if (!invite) {
    const error = new Error("Invalid or expired invite token");
    error.status = 400;
    throw error;
  }

  if (invite.status !== "pending") {
    const error = new Error("Invite has already been accepted or expired");
    error.status = 400;
    throw error;
  }

  if (invite.expiresAt < new Date()) {
    invite.status = "expired";
    await invite.save();
    const error = new Error("Invite token has expired");
    error.status = 400;
    throw error;
  }
};

export const acceptInviteService = async ({ token, userId }) => {
  const invite = await Invite.findOne({ token });

  await validateInvite(invite);

  const user = await User.findById(userId);

  if (user.email !== invite.email) {
    const error = new Error("This invite is not for your email address");
    error.status = 400;
    throw error;
  }

  const existing = await Membership.findOne({
    user: userId,
    organization: invite.organization,
  });

  if (existing) {
    const error = new Error("Already a member of this organization");
    error.status = 400;
    throw error;
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await Membership.create(
      [
        {
          user: userId,
          organization: invite.organization,
          role: invite.role,
          status: "active",
        },
      ],
      { session },
    );

    invite.status = "accepted";
    await invite.save({ session });

    await session.commitTransaction();

    return invite;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const resendInviteService = async (inviteId, orgId) => {
  const invite = await Invite.findOne({
    _id: inviteId,
    organization: orgId,
  });

  if (!invite) {
    const error = new Error("Invite not found or you don't have access");
    error.status = 404;
    throw error;
  }

  if (invite.status === "accepted") {
    const error = new Error("Cannot resend an accepted invite");
    error.status = 400;
    throw error;
  }

  invite.token = crypto.randomBytes(32).toString("hex");
  invite.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  invite.status = "pending";
  await invite.save();

  const inviteLink = `${process.env.FRONTEND_URL}/accept-invite?token=${invite.token}`;

  await emailQueue.add("send-invite-email", {
    to: invite.email,
    subject: "You're invited to join an organization on TeamFlow",
    html: `
      <p>You have been invited to join an organization on TeamFlow as a ${invite.role}.</p>
      <p>Click the link below to accept the invite:</p>
      <a href="${inviteLink}">Accept Invite</a>
      <p>This invite will expire in 24 hours.</p>
    `,
  });

  return true;
};

export const getInviteByTokenService = async (token) => {
  const invite = await Invite.findOne({ token }).populate("organization");

  await validateInvite(invite);

  return {
    email: invite.email,
    role: invite.role,
    orgName: invite.organization.name,
  };
};
