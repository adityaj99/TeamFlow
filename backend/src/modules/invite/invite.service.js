import crypto from "crypto";
import Invite from "./invite.model.js";

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
