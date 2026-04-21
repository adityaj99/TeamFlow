import { PanelLeft } from "lucide-react";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  return (
    <header className="flex gap-4 items-center p-4 shadow-sm border-b border-gray-200 bg-white">
      <div className="w-10 border-r border-gray-200">
        <PanelLeft size={20} />
      </div>
      <p className="font-semibold">
        {location.pathname === "/"
          ? "Dashboard"
          : location.pathname === "/tasks"
            ? "Task"
            : location.pathname === "/members"
              ? "Member"
              : "Settings"}
      </p>
    </header>
  );
};

export default Navbar;
