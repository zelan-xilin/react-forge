import { matchPath } from 'react-router';

export { menuRoutes, permissionRoutes } from './permissionRouter';

export type { MenuRouterConfig, PermissionRouterConfig } from './types';

export const isExactPathMatch = (pattern: string, pathname: string) => {
  return matchPath({ path: pattern, end: true }, pathname) !== null;
};
