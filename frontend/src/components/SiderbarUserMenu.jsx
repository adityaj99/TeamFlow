import { useState, useRef, useEffect } from "react";
import { EllipsisIcon, User, LogOut, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAvatar } from "../utils/getAvatar";
import { useLogout } from "../api/mutations/user.mutation";

const SidebarUserMenu = ({ currentUser }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  const { mutate: logout, isPending } = useLogout();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!menuRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        navigate("/login");
      },
    });
  };

  return (
    <div
      ref={menuRef}
      className="relative flex items-center justify-between mt-auto pt-4 z-50 bg-[#FAFBFB]"
    >
      {/* LEFT */}
      <div className="flex gap-2 items-start min-w-0">
        <img
          className="h-10 w-10 rounded-full object-cover"
          src={getAvatar(currentUser)}
          onError={(e) => {
            e.target.src =
              "https://ui-avatars.com/api/?name=User&background=random";
          }}
          alt="avatar"
        />

        <div className="flex flex-col min-w-0">
          <p className="text-sm font-medium">{currentUser?.name}</p>
          <p className="text-xs text-gray-400 truncate">{currentUser?.email}</p>
        </div>
      </div>

      {/* RIGHT (3 dots) */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer p-1 hover:bg-gray-100 rounded"
      >
        <EllipsisIcon size={16} />
      </div>

      {/* 🔥 DROPDOWN */}
      {open && (
        <div className="absolute bottom-12 right-0 w-44 bg-white border border-gray-200 rounded-xl shadow-md p-1 z-50">
          {/* Profile */}
          <button
            onClick={() => {
              navigate("/profile");
              setOpen(false);
            }}
            className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 rounded-xl"
          >
            <User size={14} />
            Profile
          </button>

          <button className="flex items-center gap-2 w-full px-3 py-2 text-gray-400 cursor-not-allowed rounded-xl">
            <Moon size={14} />
            Change Theme
          </button>

          {/* Logout */}
          <button
            disabled={isPending}
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 rounded-xl"
          >
            <LogOut size={14} />
            {isPending ? "Logging out..." : "Logout"}
          </button>
        </div>
      )}
    </div>
  );
};

export default SidebarUserMenu;
