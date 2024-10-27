import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = () => {
  return <>{localStorage.getItem("isAuthenticated") ? <Outlet /> : <Navigate to={"/login"} />}</>;
};
