import type { RootState } from '@/store';
import type { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

interface PermissionRouteProps {
  path: string;
  children: ReactNode;
}
function PermissionRoute({ path, children }: PermissionRouteProps) {
  const auth = useSelector((state: RootState) => state.auth);

  const allowed = auth.hasUnrestrictedPermissions || auth.menus.includes(path);
  if (!allowed) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default PermissionRoute;
