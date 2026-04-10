import { getNotificationsService } from "./notification.service.js";

export const getNotification = async (req, res) => {
  try {
    const notifications = await getNotificationsService(req.user._id);
    res.json({
      success: true,
      message: "Notifications fetched",
      data: notifications,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch notifications" });
  }
};
