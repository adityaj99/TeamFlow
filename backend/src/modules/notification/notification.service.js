import notificationQueue from "../../queues/notification.queue.js";
import Notification from "./notification.model.js";

export const createNotifcationService = async (data) => {
  await notificationQueue.add("send_notification", data);
};

export const getNotificationsService = async (userId) => {
  const notifications = await Notification.find({ user: userId }).sort({
    createdAt: -1,
  });
  return notifications;
};
