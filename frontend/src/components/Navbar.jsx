import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <header className="flex justify-between items-center p-3 border-b border-gray-200 bg-white">
      <h1 className="font-semibold">Welcome, {user?.name}</h1>

      <button
        onClick={handleLogout}
        className="px-3 py-1 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </header>
  );
};

export default Navbar;
