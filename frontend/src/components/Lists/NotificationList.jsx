import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Bell, Info } from "lucide-react";

const NotificationList = ({ notifications = [] }) => {
  return (
    <div className="w-full max-w-sm bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
      {/* Sticky Header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between sticky top-0">
        <h2 className="text-sm font-semibold text-gray-800">Notifications</h2>
        {/* Optional: Add a "Mark all as read" button here later */}
        {notifications.length > 0 && (
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {notifications.filter((n) => !n.isRead).length} New
          </span>
        )}
      </div>

      {/* Scrollable Container */}
      <div className="max-h-100 overflow-y-auto divide-y divide-gray-200">
        {/* Empty State */}
        {!notifications.length ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3 text-gray-400">
              <Bell size={20} />
            </div>
            <p className="text-sm font-medium">All caught up!</p>
            <p className="text-xs text-gray-400 mt-1">
              You don't have any new notifications.
            </p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              className={`flex gap-3 p-4 transition-colors cursor-pointer group hover:bg-gray-50 ${
                !n.isRead ? "bg-blue-50/30" : "bg-white"
              }`}
            >
              <div className="mt-0.5 shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    !n.isRead
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <Info size={16} />
                </div>
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm leading-tight text-gray-800 ${!n.isRead ? "font-medium" : "font-normal"}`}
                >
                  {n.message}
                </p>
                <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                  {formatDistanceToNow(new Date(n.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>

              {/* Unread Blue Dot */}
              {!n.isRead && (
                <div className="shrink-0 flex items-start pt-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationList;
