import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router';

import type { RootState } from '@/store';

interface PermissionRouteProps {
  path: string;
}
const PermissionRoute = ({ path }: PermissionRouteProps) => {
  const auth = useSelector((state: RootState) => state.auth);
  const allowed = auth.hasUnrestrictedPermissions || auth.menus.includes(path);

  if (allowed) {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
};

export default PermissionRoute;
