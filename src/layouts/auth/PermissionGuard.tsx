import { isExactPathMatch } from '@/lib/router';
import type { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router';
import RedirectToFirstAccessibleRoute from './RedirectToFirstAccessibleRoute';

const PermissionGuard = () => {
  const location = useLocation();
  const auth = useSelector((state: RootState) => state.auth);

  const allowed =
    auth.hasUnrestrictedPermissions ||
    auth.paths.some(menuPath => isExactPathMatch(menuPath, location.pathname));

  if (!allowed) {
    return <RedirectToFirstAccessibleRoute />;
  }

  return <Outlet />;
};

export default PermissionGuard;
