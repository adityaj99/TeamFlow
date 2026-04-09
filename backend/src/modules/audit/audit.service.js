import Audit from "./audit.model.js";

export const createAuditLog = async ({
  action,
  userId,
  orgId,
  targetId,
  targetType,
  metadata,
}) => {
  await Audit.create({
    action,
    user: userId,
    organization: orgId,
    targetId,
    targetType,
    metadata,
  });
};
