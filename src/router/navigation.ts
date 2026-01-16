import { joinPaths } from '@/lib/router';
import type { ComponentType } from 'react';
import { baseRoutes } from './config';

export interface NavigationRoute {
  fullPath: string;
  title: string;
  icon?: ComponentType<{ className?: string }>;
  children?: Omit<NavigationRoute, 'children'>[];
}

const buildNavigationRoutes = () => {
  const result: NavigationRoute[] = [];

  baseRoutes.forEach(r => {
    const parentPath = joinPaths('', r.path);

    result.push({
      fullPath: parentPath,
      title: r.title,
      icon: r.icon,
      children: r.children?.map(child => ({
        fullPath: joinPaths(parentPath, child.path),
        title: child.title,
        icon: child.icon,
      })),
    });
  });

  return result;
};

export const navigationRoutes = buildNavigationRoutes();
