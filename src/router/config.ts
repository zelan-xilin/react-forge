import {
  BadgeJapaneseYen,
  ChartCandlestick,
  CircleStar,
  Package,
  Settings,
} from 'lucide-react';
import type { ComponentType } from 'react';

export type Lazy = () => Promise<{
  default: ComponentType<unknown>;
  ErrorBoundary?: ComponentType<unknown>;
  loader?: () => Promise<unknown>;
  action?: () => Promise<unknown>;
  shouldRevalidate?: () => boolean;
}>;
interface BaseRoute {
  path: string;
  title: string;
  icon?: ComponentType<{ className?: string }>;
  lazy?: Lazy;
  children?: (Omit<BaseRoute, 'children' | 'lazy'> & { lazy: Lazy })[];
}

export const baseRoutes: BaseRoute[] = [
  {
    path: 'cashier',
    title: '收银台',
    icon: CircleStar,
    lazy: () => import('../pages/cashier'),
  },
  {
    path: '/sales',
    title: '收银与销售',
    icon: BadgeJapaneseYen,
    children: [
      {
        path: 'areas',
        title: '区域管理',
        lazy: () => import('../pages/sales/areas'),
      },
      {
        path: 'pricing',
        title: '收费规则',
        lazy: () => import('../pages/sales/pricing'),
      },
      {
        path: 'order',
        title: '销售订单',
        lazy: () => import('../pages/sales/order'),
      },
    ],
  },
  {
    path: '/material',
    title: '物料与库存',
    icon: Package,
    children: [
      {
        path: 'material',
        title: '物料管理',
        lazy: () => import('../pages/material/material'),
      },
      {
        path: 'recipe',
        title: '配方管理',
        lazy: () => import('../pages/material/recipe'),
      },
      {
        path: 'inventory',
        title: '库存管理',
        lazy: () => import('../pages/material/inventory'),
      },
      {
        path: 'purchase',
        title: '入库记录',
        lazy: () => import('../pages/material/purchase'),
      },
      {
        path: 'stock-out',
        title: '出库记录',
        lazy: () => import('../pages/material/stock-out'),
      },
    ],
  },
  {
    path: '/statistics',
    title: '报表与分析',
    icon: ChartCandlestick,
    children: [
      {
        path: 'report',
        title: '报表分析',
        lazy: () => import('../pages/statistics/report'),
      },
    ],
  },
  {
    path: '/setting',
    title: '系统设置',
    icon: Settings,
    children: [
      {
        path: 'user',
        title: '用户管理',
        lazy: () => import('../pages/setting/user'),
      },
      {
        path: 'role',
        title: '角色管理',
        lazy: () => import('../pages/setting/role'),
      },
      {
        path: 'dict',
        title: '字典管理',
        lazy: () => import('../pages/setting/dict'),
      },
    ],
  },
];
