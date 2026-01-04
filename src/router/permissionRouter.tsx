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
    icon: 'dashboard',
  },
  {
    path: '/system',
    title: '系统管理',
    icon: 'system',
    children: [
      {
        path: '/system/user',
        lazy: () => import('@/pages/system/user'),
        title: '用户管理',
        icon: 'user',
      },
      {
        path: '/system/role',
        lazy: () => import('@/pages/system/role'),
        title: '角色管理',
        icon: 'role',
      },
    ],
  },
];

export const permissionRoutes: PermissionRouterConfig[] = collectPermissionRoutes(menuRoutes);
