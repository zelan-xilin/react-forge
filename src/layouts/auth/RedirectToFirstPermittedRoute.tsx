import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

import { permissionRoutes } from '@/router';
import type { RootState } from '@/store';
import NoAccessibleRoutes from './NoAccessibleRoutes';

const RedirectToFirstPermittedRoute = () => {
  const auth = useSelector((state: RootState) => state.auth);

  const firstRouter = useMemo(() => {
    const nonParameterizedPathRegex = /^[^:]+$/;

    return permissionRoutes.find(
      r =>
        nonParameterizedPathRegex.test(r.path) &&
        (auth.hasUnrestrictedPermissions || auth.paths.includes(r.path)),
    );
  }, [auth.hasUnrestrictedPermissions, auth.paths]);

  if (!firstRouter) {
    return <NoAccessibleRoutes />;
  }

  return <Navigate to={firstRouter.path} replace />;
};

export default RedirectToFirstPermittedRoute;
