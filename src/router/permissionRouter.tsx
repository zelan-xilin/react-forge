import { House, ShieldUser, UserRound } from 'lucide-react';
import type { MenuRouterConfig, PermissionRouterConfig } from './types';

const collectPermissionRoutes = (routes: MenuRouterConfig[]) => {
  const result: PermissionRouterConfig[] = [];

  const walk = (items: MenuRouterConfig[]) => {
    items.forEach(r => {
      if (r.lazy) {
        result.push({
          ...r,
          lazy: r.lazy,
        });
      }

      if (r.children?.length) {
        walk(r.children);
      }
    });
  };

  walk(routes);
  return result;
};

export const menuRoutes: MenuRouterConfig[] = [
  {
    path: '/dashboard',
    lazy: () => import('@/pages/dashboard'),
    title: '首页',
    icon: House,
  },
  {
    path: '/user',
    lazy: () => import('@/pages/user'),
    title: '用户管理',
    icon: UserRound,
  },
  {
    path: '/role',
    lazy: () => import('@/pages/role'),
    title: '角色管理',
    icon: ShieldUser,
  },
];

export const permissionRoutes: PermissionRouterConfig[] = collectPermissionRoutes(menuRoutes);
