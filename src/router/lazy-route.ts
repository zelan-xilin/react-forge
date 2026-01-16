import { joinPaths } from '@/lib/router';
import { baseRoutes, type Lazy } from './config';

interface LazyRoute {
  path: string;
  lazy: Lazy;
}

const buildLazyRoutes = () => {
  const result: LazyRoute[] = [];

  baseRoutes.forEach(r => {
    const parentPath = joinPaths('', r.path);

    if (r.lazy) {
      result.push({
        path: parentPath,
        lazy: r.lazy,
      });
    }

    r.children?.forEach(child => {
      const childPath = joinPaths(parentPath, child.path);

      if (child.lazy) {
        result.push({
          path: childPath,
          lazy: child.lazy,
        });
      }
    });
  });

  return result;
};

export const lazyRoutes = buildLazyRoutes();
