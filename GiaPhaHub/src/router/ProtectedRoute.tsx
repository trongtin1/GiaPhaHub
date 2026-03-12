import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { paths } from "./paths";

const ProtectedRoute: React.FC = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to={paths.login} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
