import Notification from "./notification.model.js";

export const createNotifcationService = async ({
  userId,
  orgId,
  type,
  message,
  relatedId,
}) => {
  await Notification.create({
    user: userId,
    organization: orgId,
    type,
    message,
    relatedId,
  });
};

export const getNotificationsService = async (userId) => {
  const notifications = await Notification.find({ user: userId }).sort({
    createdAt: -1,
  });
  return notifications;
};
