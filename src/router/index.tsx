import { House, ShieldUser, UserRound } from 'lucide-react';
import type { ComponentType } from 'react';
import { matchPath } from 'react-router';

interface BaseRouterConfig {
  path: string;
  title: string | null;
}
interface MenuRouterConfig extends BaseRouterConfig {
  icon: ComponentType<{ className?: string }>;
  children?: MenuRouterConfig[];
  lazy?: () => Promise<{
    default: ComponentType<unknown>;
    ErrorBoundary?: ComponentType<unknown>;
    loader?: () => Promise<unknown>;
    action?: () => Promise<unknown>;
    shouldRevalidate?: () => boolean;
  }>;
}
interface PermissionRouterConfig extends Omit<MenuRouterConfig, 'children' | 'lazy'> {
  lazy: NonNullable<MenuRouterConfig['lazy']>;
}

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

export const isExactPathMatch = (pattern: string, pathname: string) => {
  return matchPath({ path: pattern, end: true }, pathname) !== null;
};
