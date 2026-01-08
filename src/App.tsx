import { useEffect, useMemo } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';

import { Toaster } from './components/ui/sonner';
import {
  AppWrapper,
  AuthGuard,
  PermissionGuard,
  RedirectToFirstPermittedRoute,
  RouteLoadingFallback,
} from './layouts';
import { permissionRoutes, whiteRoutes } from './router';
import { preloadIdle } from './router/preloader';

function App() {
  useEffect(() => {
    preloadIdle();
  }, []);

  const routerInstance = useMemo(() => {
    const rootChildren = permissionRoutes.map(r => {
      return {
        path: r.path.replace(/^\//, ''),
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

    return createBrowserRouter([
      ...whiteRoutes,
      {
        path: '/',
        element: <AuthGuard />,
        hydrateFallbackElement: <RouteLoadingFallback />,
        children: [
          {
            element: <AppWrapper />,
            children: [
              {
                element: <PermissionGuard />,
                children: [
                  {
                    index: true,
                    element: <RedirectToFirstPermittedRoute />,
                  },
                  ...rootChildren,
                  {
                    path: '*',
                    element: <Navigate to="/" replace />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ]);
  }, []);

  return (
    <>
      <RouterProvider router={routerInstance} />
      <Toaster position='top-center' richColors />
    </>
  );
}

export default App;
