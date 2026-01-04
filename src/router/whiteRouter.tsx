import Login from '@/pages/Login';
import type { WhiteListRouterConfig } from './types';

export const whiteRoutes: WhiteListRouterConfig[] = [
  {
    path: '/login',
    element: <Login />,
    title: '登录',
    icon: 'login',
  },
];
