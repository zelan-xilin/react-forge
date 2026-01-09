import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router';

import { menuRoutes } from '@/router';
import type { MenuRouterConfigType } from '@/router/types';
import type { RootState } from '@/store';

interface AppMenuProps {
  type: MenuRouterConfigType;
}
const AppMenu = ({ type }: AppMenuProps) => {
  const location = useLocation();
  const auth = useSelector((state: RootState) => state.auth);

  return (
    <div className="flex flex-col gap-0.5">
      {menuRoutes
        .filter(
          r => (auth.hasUnrestrictedPermissions || auth.paths.includes(r.path)) && r.type === type,
        )
        .map(n => {
          const Icon = n.icon;
          const isActiveClass = location.pathname === n.path ? 'bg-muted text-primary' : '';

          return (
            <Link
              key={n.path}
              to={n.path}
              className={`transition text-foreground/85 flex gap-4 p-5 box-border rounded-lg items-center hover:bg-muted/80 ${isActiveClass}`}
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
