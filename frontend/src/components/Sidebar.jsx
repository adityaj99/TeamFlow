import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <aside className="w-64 hidden md:flex flex-col bg-white border-r p-4">
      <h2 className="text-xl font-bold mb-6">TeamFlow</h2>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-3 py-2 rounded-md ${
              location.pathname === item.path
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
