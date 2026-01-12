import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router';

import { permissionRoutes } from '@/router';
import type { RootState } from '@/store';

const AppMenu = () => {
  const location = useLocation();
  const auth = useSelector((state: RootState) => state.auth);

  return (
    <div className="flex flex-col gap-0.5">
      {permissionRoutes
        .filter(
          r => (auth.hasUnrestrictedPermissions || auth.paths.includes(r.path)),
        )
        .map(n => {
          const Icon = n.icon;
          const isActiveClass = location.pathname === n.path ? 'bg-sidebar-primary! text-sidebar-primary-foreground!' : '';

          return (
            <Link
              key={n.path}
              to={n.path}
              className={`transition text-sidebar-foreground flex gap-4 p-5 box-border rounded-lg items-center hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${isActiveClass}`}
            >
              <Icon className="size-6" />
              <span>{n.title}</span>
            </Link>
          );
        })}
    </div>
  );
};

export default AppMenu;
