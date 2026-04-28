import {
  AudioWaveform,
  ChevronDown,
  CircleCheckBig,
  CirclePlus,
  LayoutDashboard,
  Plus,
  Settings,
  Users,
  EllipsisIcon,
  Check,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import SidebarProjectsList from "./Lists/SidebarProjectList";
import { useOrgs, useCurrentOrg } from "../api/queries/org.query";
import { useSelectOrg } from "../api/mutations/org.mutation";
import { useModal } from "../context/ModalContext";
import CreateWorkspaceForm from "./CreateWorkspaceForm";
import { useAuth } from "../api/queries/auth.query";
import SidebarUserMenu from "./SiderbarUserMenu";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [workspacePop, setWorkspacePop] = useState(false);

  const popupRef = useRef();

  const { data: orgs = [] } = useOrgs();
  const { data: currentOrg = {} } = useCurrentOrg();
  const { mutate: selectOrg } = useSelectOrg();
  const { openModal } = useModal();
  const { data: userData } = useAuth();

  const currentUser = userData.user;

  const role = userData?.membership?.role;
  const isOwner = role === "owner";

  const navItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={16} /> },
    { name: "Tasks", path: "/tasks", icon: <CircleCheckBig size={16} /> },
    { name: "Members", path: "/members", icon: <Users size={16} /> },
    ...(isOwner
      ? [{ name: "Settings", path: "/settings", icon: <Settings size={16} /> }]
      : []),
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setWorkspacePop(false);
      }
    };

    if (workspacePop) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [workspacePop]);

  return (
    <aside className="w-68 flex flex-col bg-[#FAFBFB] border-r border-gray-200 p-4 fixed h-screen shadow">
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        className="flex gap-2 items-center h-9 cursor-pointer"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-black text-white">
          <AudioWaveform className="size-4" />
        </div>
        <p className="text-[16px] font-semibold">Team Flow.</p>
      </div>

      {/* Workspace Section */}
      <div className="space-y-2 border-b border-gray-200 py-2">
        <div className="flex items-center justify-between text-gray-400">
          <p className="text-xs">Workspaces</p>
          {isOwner && (
            <CirclePlus
              className="cursor-pointer"
              size={16}
              onClick={() => {
                openModal(<CreateWorkspaceForm />);
                setWorkspacePop(false);
              }}
            />
          )}
        </div>

        <div ref={popupRef} className="relative">
          {/* Trigger */}
          <div
            onClick={() => setWorkspacePop((prev) => !prev)}
            className="flex items-center justify-between cursor-pointer rounded-xl hover:bg-gray-100 transition p-1"
          >
            <div className="flex items-center gap-2 w-full">
              <span className="flex items-center justify-center h-8 w-8 rounded-md bg-black text-white">
                {currentOrg?.name?.charAt(0)}
              </span>
              <span className="flex flex-col w-[80%]">
                <span className="font-semibold truncate">
                  {currentOrg?.name || "Select Workspace"}
                </span>
                <span className="text-gray-400 text-xs">
                  {currentOrg?.isActive ? "Active" : "Inactive"}
                </span>
              </span>
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform ${
                workspacePop ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Dropdown */}
          <div
            className={`absolute left-0 top-full mt-2 z-50 w-65 rounded-xl shadow-lg bg-white p-3 space-y-1 border border-gray-200
            transition-all duration-200 origin-top
            ${
              workspacePop
                ? "scale-100 opacity-100"
                : "scale-95 opacity-0 pointer-events-none"
            }`}
          >
            {/* Arrow */}
            <div className="absolute -top-2 left-6 w-3 h-3 bg-white rotate-45 border-l border-t border-gray-200"></div>

            <p className="text-xs text-gray-400 px-1">Workspaces</p>

            {/* Org List */}
            <div className="text-gray-700">
              {orgs.length > 0 ? (
                orgs.map((org) => {
                  const isActive = currentOrg?._id === org.organization._id;

                  return (
                    <div
                      key={org._id}
                      onClick={() => {
                        selectOrg(org.organization._id);
                        setWorkspacePop(false);
                      }}
                      className={`w-full flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-colors
            ${isActive ? "bg-gray-100 font-medium" : "hover:bg-gray-100"}`}
                    >
                      <div className="flex items-center justify-center h-6 w-6 border border-gray-200 rounded text-xs">
                        {org.organization.name.charAt(0)}
                      </div>
                      <div className="w-[80%] flex items-center justify-between">
                        <p className="w-[95%] truncate">
                          {org.organization.name}
                        </p>
                        {isActive && <Check size={16} />}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-gray-400 p-2">No workspace</p>
              )}
            </div>

            {/* Add Workspace */}
            {isOwner && (
              <div
                onClick={() => {
                  openModal(<CreateWorkspaceForm />);
                  setWorkspacePop(false);
                }}
                className="flex items-center gap-2 hover:bg-gray-100 rounded-xl cursor-pointer p-2 transition"
              >
                <div className="w-fit p-1 border rounded border-gray-200">
                  <Plus size={12} />
                </div>
                <p className="text-gray-600 text-sm">Add workspace</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 border-b border-gray-200 py-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex w-full items-center gap-2 p-2 rounded-xl transition
              ${
                location.pathname === item.path
                  ? "bg-gray-100 text-black"
                  : "hover:bg-gray-100"
              }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Projects */}
      <SidebarProjectsList />

      {/* Profile */}
      <SidebarUserMenu currentUser={currentUser} />
    </aside>
  );
};

export default Sidebar;
