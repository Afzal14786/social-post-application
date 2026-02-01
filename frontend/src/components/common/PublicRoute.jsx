import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loading from "./Loading";

const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;

  // If user is already logged in, send them to Home immediately
  if (user) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, show the Login/Signup page
  return <Outlet />;
};

export default PublicRoute;