import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-4 border-white border-t-4 border-t-black border-l-4 border-l-black animate-spin"></div>
      </div>
    );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
