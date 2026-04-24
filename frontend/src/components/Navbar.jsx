import { PanelLeft } from "lucide-react";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  let filterLocation;

  if (location.pathname === "/") {
    filterLocation = "/";
  } else {
    filterLocation = location.pathname.split("/")[1];
  }

  return (
    <header className="flex sticky top-0 gap-4 items-center p-4 shadow-sm border-b border-gray-200 bg-white">
      <div className="w-10 border-r border-gray-200">
        <PanelLeft size={20} />
      </div>
      <p className="font-semibold">
        {filterLocation === "/"
          ? "Dashboard"
          : filterLocation === "tasks"
            ? "Task"
            : filterLocation === "members"
              ? "Member"
              : filterLocation === "profile"
                ? "Profile"
                : filterLocation === "project"
                  ? "Project"
                  : "Settings"}
      </p>
    </header>
  );
};

export default Navbar;
