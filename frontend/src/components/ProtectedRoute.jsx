import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../api/queries/auth.query";

const ProtectedRoute = ({ children }) => {
  const { data, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-4 border-white border-t-4 border-t-black border-l-4 border-l-black animate-spin"></div>
      </div>
    );

  if (!data?.user) {
    const redirectPath = location.pathname + location.search;

    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(redirectPath)}`}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
