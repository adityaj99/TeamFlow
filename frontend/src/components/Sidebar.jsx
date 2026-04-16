import {
  AudioWaveform,
  ChevronDown,
  CircleCheckBig,
  CirclePlus,
  Ellipsis,
  EllipsisIcon,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import SidebarProjectsList from "./Lists/sidebarProjectList";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={16} /> },
    { name: "Tasks", path: "/tasks", icon: <CircleCheckBig size={16} /> },
    { name: "Members", path: "/members", icon: <Users size={16} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={16} /> },
  ];

  return (
    <aside className="w-68 hidden md:flex flex-col bg-[#FAFBFB] border-r border-gray-200 p-4">
      <div className="flex gap-2 items-center h-9">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-black text-white">
          <AudioWaveform className="size-4" />
        </div>
        <p className="text-[16px] font-semibold">Team Flow.</p>
      </div>

      <div className="space-y-2 border-b border-gray-200 py-2">
        <div className="flex items-center justify-between text-gray-400">
          <p className="text-xs">Workspaces</p>
          <CirclePlus size={16} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-md bg-black"></span>
            <span className="flex flex-col">
              <span className="font-semibold">Engineer Core</span>
              <span className="text-gray-400 text-xs">Organization</span>
            </span>
          </div>
          <ChevronDown size={16} />
        </div>
      </div>

      <nav className="space-y-1 border-b border-gray-200 py-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex w-full items-center gap-2 p-2 rounded-md ${
              location.pathname === item.path
                ? "bg-gray-100 text-black"
                : "hover:bg-gray-100"
            }`}
          >
            <p>{item.icon}</p>
            {item.name}
          </Link>
        ))}
      </nav>

      <SidebarProjectsList />

      <div className="flex items-center justify-between mt-6">
        <div className="flex gap-2 items-start min-w-0">
          <div className="h-8 w-8 rounded-full bg-black shrink-0"></div>

          <div className="flex flex-col h-12 min-w-0">
            <p>Aditya Jadhav</p>
            <p className="text-xs text-gray-400 truncate">
              jadhavaditya102@gmail.com
            </p>
          </div>
        </div>

        <EllipsisIcon size={16} />
      </div>
    </aside>
  );
};

export default Sidebar;
