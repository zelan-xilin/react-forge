import LoadingFallback from '@/components/LoadingFallback';
import {
  AuthGuard,
  PermissionGuard,
  RedirectToFirstAccessibleRoute,
  Wrapper,
} from '@/layouts';
import Login from '@/pages/login';
import { createBrowserRouter } from 'react-router';
import { lazyRoutes } from './lazy-route';

const routerInstanceChildren = lazyRoutes.map(r => {
  return {
    path: r.path,
    lazy: async () => {
      const mod = await r.lazy();

      return {
        Component: mod.default,
        ErrorBoundary: mod.ErrorBoundary,
        loader: mod.loader,
        action: mod.action,
        shouldRevalidate: mod.shouldRevalidate,
      };
    },
  };
});

export const routerInstance = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <AuthGuard />,
    hydrateFallbackElement: <LoadingFallback />,
    children: [
      {
        element: <Wrapper />,
        children: [
          {
            element: <PermissionGuard />,
            children: [
              {
                index: true,
                element: <RedirectToFirstAccessibleRoute />,
              },
              ...routerInstanceChildren,
              {
                path: '*',
                element: <RedirectToFirstAccessibleRoute />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
