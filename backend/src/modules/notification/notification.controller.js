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
