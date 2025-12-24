import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

import { permissionRoutes } from '@/router';
import type { RootState } from '@/store';
import NoAccessible from './NoAccessible';

const RedirectToFirstAllowedRoute = () => {
  const auth = useSelector((state: RootState) => state.auth);

  const firstRouter = useMemo(() => {
    const nonParameterizedPathRegex = /^[^:]+$/;

    return permissionRoutes.find(
      r =>
        nonParameterizedPathRegex.test(r.path) &&
        (auth.hasUnrestrictedPermissions || auth.menus.includes(r.path)),
    );
  }, [auth.hasUnrestrictedPermissions, auth.menus]);

  if (!firstRouter) {
    return <NoAccessible />;
  }

  return <Navigate to={firstRouter.path} replace />;
};

export default RedirectToFirstAllowedRoute;
