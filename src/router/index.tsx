import { ChartSpline, Laugh, LayoutDashboard, LayoutTemplate, MonitorCog, SlidersHorizontal, UserRound } from 'lucide-react';
import type { ComponentType } from 'react';
import { matchPath } from 'react-router';
import { MenuRouterConfigType } from './types';

interface MenuRouterConfig {
  path: string;
  title: string | null;
  icon: ComponentType<{ className?: string }>;
  type: MenuRouterConfigType;

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
    title: '概览',
    icon: LayoutDashboard,
    type: MenuRouterConfigType.FEATURE,
  },
  {
    path: '/cashier',
    lazy: () => import('@/pages/cashier'),
    title: '收银台',
    icon: Laugh,
    type: MenuRouterConfigType.FEATURE,
  },
  {
    path: '/seat',
    lazy: () => import('@/pages/seat'),
    title: '座位区域',
    icon: LayoutTemplate,
    type: MenuRouterConfigType.FEATURE,
  },
  {
    path: '/tea',
    lazy: () => import('@/pages/tea'),
    title: '茶水配置',
    icon: SlidersHorizontal,
    type: MenuRouterConfigType.FEATURE,
  },
  {
    path: '/report',
    lazy: () => import('@/pages/report'),
    title: '数据报表',
    icon: ChartSpline,
    type: MenuRouterConfigType.FEATURE,
  },

  {
    path: '/user',
    lazy: () => import('@/pages/user'),
    title: '用户管理',
    icon: UserRound,
    type: MenuRouterConfigType.SETTING,
  },
  {
    path: '/role',
    lazy: () => import('@/pages/role'),
    title: '角色管理',
    icon: MonitorCog,
    type: MenuRouterConfigType.SETTING,
  },
];

export const permissionRoutes: PermissionRouterConfig[] = collectPermissionRoutes(menuRoutes);

export const isExactPathMatch = (pattern: string, pathname: string) => {
  return matchPath({ path: pattern, end: true }, pathname) !== null;
};
