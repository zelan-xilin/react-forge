import { lazyRoutes } from '@/router/lazy-route';
import type { RootState } from '@/store';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';
import NoAccessibleRoutes from './NoAccessibleRoutes';

const RedirectToFirstAccessibleRoute = () => {
  const auth = useSelector((state: RootState) => state.auth);

  const firstRouter = useMemo(() => {
    return lazyRoutes.find(
      r =>
        !r.path.includes(':') &&
        (auth.hasUnrestrictedPermissions || auth.paths.includes(r.path)),
    );
  }, [auth.hasUnrestrictedPermissions, auth.paths]);

  if (!firstRouter) {
    return <NoAccessibleRoutes />;
  }

  return <Navigate to={firstRouter.path} replace />;
};

export default RedirectToFirstAccessibleRoute;
