import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router';

import type { RootState } from '@/store';

const AuthGuard = () => {
  const location = useLocation();
  const user = useSelector((state: RootState) => state.user);

  if (!user.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
