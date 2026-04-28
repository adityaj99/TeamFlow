import { useState } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "../api/queries/notification.query";
import { useMarkNitficationsRead } from "../api/mutations/notification.mutation";
import NotificationList from "./Lists/NotificationList";
import { useQueryClient } from "@tanstack/react-query";

const NavbarNotification = () => {
  const { data: notifications = [] } = useNotifications();
  const { mutate: markRead } = useMarkNitficationsRead();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleToggle = () => {
    const willOpen = !open;
    setOpen(willOpen);

    if (willOpen && unreadCount > 0) {
      markRead();

      queryClient.setQueryData(["notifications"], (oldData = []) =>
        oldData.map((n) => ({ ...n, isRead: true })),
      );
    }
  };

  return (
    <div className="relative">
      {/* 🔔 Bell */}
      <button
        onClick={handleToggle}
        className="relative p-2 hover:bg-gray-100 rounded cursor-pointer"
      >
        <Bell size={20} />

        {/* 🔥 Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white px-1.5 text-xs rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 🔥 Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <NotificationList notifications={notifications} />
        </div>
      )}
    </div>
  );
};

export default NavbarNotification;
