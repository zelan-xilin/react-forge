import {
  ChartSpline,
  Laugh,
  LayoutDashboard,
  LayoutTemplate,
  MonitorCog,
  SlidersHorizontal,
  UserRound,
} from 'lucide-react';
import type { ComponentType } from 'react';
import { matchPath } from 'react-router';

interface PermissionRouterConfig {
  path: string;
  title: string | null;
  icon: ComponentType<{ className?: string }>;

  lazy: () => Promise<{
    default: ComponentType<unknown>;
    ErrorBoundary?: ComponentType<unknown>;
    loader?: () => Promise<unknown>;
    action?: () => Promise<unknown>;
    shouldRevalidate?: () => boolean;
  }>;
}

export const permissionRoutes: PermissionRouterConfig[] = [
  {
    path: '/dashboard',
    lazy: () => import('@/pages/dashboard'),
    title: '概览',
    icon: LayoutDashboard,
  },
  {
    path: '/cashier',
    lazy: () => import('@/pages/cashier'),
    title: '收银台',
    icon: Laugh,
  },
  {
    path: '/area',
    lazy: () => import('@/pages/area'),
    title: '区域管理',
    icon: LayoutTemplate,
  },
  {
    path: '/tea',
    lazy: () => import('@/pages/tea'),
    title: '茶水配置',
    icon: SlidersHorizontal,
  },
  {
    path: '/report',
    lazy: () => import('@/pages/report'),
    title: '数据报表',
    icon: ChartSpline,
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
    icon: MonitorCog,
  },
];

export const isExactPathMatch = (pattern: string, pathname: string) => {
  return matchPath({ path: pattern, end: true }, pathname) !== null;
};
