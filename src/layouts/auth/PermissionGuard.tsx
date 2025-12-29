import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router';

import { isExactPathMatch } from '@/router';
import type { RootState } from '@/store';

const PermissionGuard = () => {
  const location = useLocation();
  const auth = useSelector((state: RootState) => state.auth);

  const allowed =
    auth.hasUnrestrictedPermissions ||
    auth.menus.some(menuPath => isExactPathMatch(menuPath, location.pathname));

  if (!allowed) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PermissionGuard;
