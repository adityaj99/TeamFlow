import { PanelLeft } from "lucide-react";
import { useLocation } from "react-router-dom";
import NavbarNotification from "./NavbarNotification";

const routeNames = {
  "/": "Dashboard",
  tasks: "Tasks",
  members: "Members",
  profile: "Profile",
  project: "Project",
  settings: "Settings",
};

const Navbar = () => {
  const location = useLocation();

  let filterLocation;

  if (location.pathname === "/") {
    filterLocation = "/";
  } else {
    filterLocation = location.pathname.split("/")[1];
  }

  return (
    <header className="flex sticky top-0 items-center justify-between py-4 px-8 shadow-sm border-b border-gray-200 bg-white">
      <div className="flex items-center gap-4">
        <div className="w-10 border-r border-gray-200">
          <PanelLeft size={20} />
        </div>
        <p className="font-semibold">{routeNames[filterLocation] || "Page"}</p>
      </div>

      <div className="relative z-100">
        <NavbarNotification />
      </div>
    </header>
  );
};

export default Navbar;
