import Notification from "./notification.model.js";
import { getNotificationsService } from "./notification.service.js";

export const getNotification = async (req, res, next) => {
  try {
    const notifications = await getNotificationsService(req.user._id);
    res.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const userId = req.user._id;

    await Notification.updateMany(
      { user: userId, isRead: false },
      { isRead: true },
    );

    res
      .status(200)
      .json({ success: true, message: "Notifications marked as read" });
  } catch (error) {
    next(error);
  }
};
