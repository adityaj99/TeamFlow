import {
  AudioWaveform,
  ChevronDown,
  CircleCheckBig,
  CirclePlus,
  Ellipsis,
  EllipsisIcon,
  LayoutDashboard,
  Plus,
  Settings,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import SidebarProjectsList from "./Lists/sidebarProjectList";
import { useState } from "react";
import { useOrgs } from "../api/queries/org.query";
import { useSelectOrg } from "../api/mutations/org.mutation";
import { useModal } from "../context/ModalContext";
import CreateWorkspaceForm from "./CreateWorkspaceForm";

const Sidebar = () => {
  const location = useLocation();

  const [workspacePop, setWorkspacePop] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={16} /> },
    { name: "Tasks", path: "/tasks", icon: <CircleCheckBig size={16} /> },
    { name: "Members", path: "/members", icon: <Users size={16} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={16} /> },
  ];

  const { data: orgs = [] } = useOrgs();
  const { mutate: selectOrg } = useSelectOrg();
  const { openModal } = useModal();

  return (
    <aside className="w-68 hidden md:flex flex-col bg-[#FAFBFB] border-r border-gray-200 p-4">
      <div className="flex gap-2 items-center h-9">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-black text-white">
          <AudioWaveform className="size-4" />
        </div>
        <p className="text-[16px] font-semibold">Team Flow.</p>
      </div>

      <div className="relative space-y-2 border-b border-gray-200 py-2">
        <div className="flex items-center justify-between text-gray-400">
          <p className="text-xs">Workspaces</p>
          {/* shortcut add workspace */}
          <CirclePlus size={16} />
        </div>

        <div
          onClick={() => setWorkspacePop(!workspacePop)}
          className="flex items-center justify-between cursor-pointer rounded hover:bg-gray-100"
        >
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-md bg-black"></span>
            <span className="flex flex-col">
              <span className="font-semibold">Engineer Core</span>
              <span className="text-gray-400 text-xs">Organization</span>
            </span>
          </div>
          <ChevronDown size={16} />
        </div>

        {/* workspace popup */}
        {workspacePop && (
          <div className="absolute -right-58 top-10 z-20 w-55 min-h-35 rounded shadow bg-white p-3 space-y-2">
            <p className="text-xs text-gray-400">Workspaces</p>

            <div className=" text-gray-600">
              {orgs?.length > 0 ? (
                orgs?.map((org) => (
                  <div
                    onClick={() => {
                      selectOrg(org.organization._id);
                      setWorkspacePop(false);
                    }}
                    className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded cursor-pointer"
                    key={org._id}
                  >
                    <div className="flex items-center justify-center h-6 w-6 border border-gray-200 rounded">
                      {org.organization.name.charAt(0)}
                    </div>
                    <p>{org.organization.name}</p>
                  </div>
                ))
              ) : (
                <p>No workspace</p>
              )}
            </div>

            {/* add workspace */}
            <div
              onClick={() => openModal(<CreateWorkspaceForm />)}
              className="flex items-center gap-2 hover:bg-gray-100 rounded cursor-pointer p-2"
            >
              <div className="w-fit p-1 border rounded border-gray-200">
                <Plus size={12} />
              </div>
              <p className="text-gray-600">Add workspace</p>
            </div>
          </div>
        )}
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
