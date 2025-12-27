import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!user) return <Navigate to="/login" />;

  return <Outlet />; // render child routes inside layout
};

export default ProtectedRoute;
// Inside ProtectedRoute
// if (user.role === "admin") return <Navigate to="/admin" />;
