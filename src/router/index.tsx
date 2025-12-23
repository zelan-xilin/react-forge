import Login from '@/pages/Login';
import type { ComponentType, ReactNode } from 'react';

interface RouterConfig {
  path: string;
  title: string | null;
  icon: string | null;
}

interface WhiteListRouteConfig extends RouterConfig {
  element: ReactNode;
}
export const whiteListRoutes: WhiteListRouteConfig[] = [
  {
    path: '/login',
    element: <Login />,
    title: '登录',
    icon: 'login',
  },
];

interface PermissionRouteConfig extends RouterConfig {
  lazy: () => Promise<{ default: ComponentType<unknown> }>;
}
export const permissionRoutes: PermissionRouteConfig[] = [
  {
    path: '/home',
    lazy: () => import('@/pages/Home'),
    title: '首页',
    icon: 'home',
  },
  {
    path: '/user',
    lazy: () => import('@/pages/User'),
    title: '用户管理',
    icon: 'user',
  },
];
