
import { useSelector } from "react-redux";
import { matchPath, Navigate, Outlet, useLocation } from "react-router";

import type { RootState } from "@/store";

const PermissionGuard = () => {
  const location = useLocation();
  const auth = useSelector((state: RootState) => state.auth);

  const allowed =
    auth.hasUnrestrictedPermissions ||
    auth.menus.some(
      menuPath => matchPath({ path: menuPath, end: true }, location.pathname) !== null,
    );

  if (!allowed) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default PermissionGuard;