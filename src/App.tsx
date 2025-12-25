import { useEffect, useMemo } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';

import { AppWrapper, AuthGuard, PermissionGuard, RedirectToFirstPermittedRoute, RouteLoadingFallback } from './layouts';
import { permissionRoutes, whiteListRoutes } from './router';
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
          return { Component: mod.default };
        },
      };
    });

    return createBrowserRouter([
      ...whiteListRoutes,
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
                ]
              },

            ]
          },
        ],
      },
    ]);
  }, []);

  return <RouterProvider router={routerInstance} />;
}

export default App;
