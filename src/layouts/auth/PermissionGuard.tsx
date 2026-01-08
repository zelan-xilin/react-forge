import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router';

import { isExactPathMatch, permissionRoutes } from '@/router';
import type { RootState } from '@/store';
import { useMemo } from 'react';
import NoAccessibleRoutes from './NoAccessibleRoutes';

const PermissionGuard = () => {
  const location = useLocation();
  const auth = useSelector((state: RootState) => state.auth);

  const firstRouter = useMemo(() => {
    const nonParameterizedPathRegex = /^[^:]+$/;

    return permissionRoutes.find(
      r =>
        nonParameterizedPathRegex.test(r.path) &&
        (auth.hasUnrestrictedPermissions || auth.paths.includes(r.path)),
    );
  }, [auth.hasUnrestrictedPermissions, auth.paths]);

  const allowed =
    auth.hasUnrestrictedPermissions ||
    auth.paths.some(menuPath => isExactPathMatch(menuPath, location.pathname));

  if (!allowed && !firstRouter) {
    return <NoAccessibleRoutes />;
  }

  if (!allowed && firstRouter) {
    return <Navigate to={firstRouter.path} replace />;
  }

  return <Outlet />;
};

export default PermissionGuard;
