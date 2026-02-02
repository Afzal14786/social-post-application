import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loading from "./Loading";

/**
 * @description If the user is already login and try to access public routes, then navigate them '/'
 * @returns '/login', '/signup' are public routes
 */
const PublicRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;