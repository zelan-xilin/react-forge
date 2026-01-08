import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { menuRoutes } from '@/router';
import type { RootState } from '@/store';

const AppHeaderMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);

  return (
    <div className="flex gap-2">
      {menuRoutes
        .filter(r => auth.hasUnrestrictedPermissions || auth.paths.includes(r.path))
        .map(n => {
          const Icon = n.icon;

          return (
            <Button
              key={n.path}
              size="icon-xl"
              variant={location.pathname === n.path ? 'default' : 'outline'}
              onClick={() => navigate(n.path)}
            >
              <Icon className="size-6" />
            </Button>
          );
        })}
    </div>
  );
};

export default AppHeaderMenu;
