import { useEffect, useMemo } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';

import { PermissionRoute, ProtectedRoute, RedirectToFirstAllowedRoute } from './layouts/auth';
import SuspenseFallback from './layouts/SuspenseFallback';
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
        element: <PermissionRoute path={r.path} />,
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
        element: <ProtectedRoute />,
        hydrateFallbackElement: <SuspenseFallback />,
        children: [
          {
            index: true,
            element: <RedirectToFirstAllowedRoute />,
          },
          ...rootChildren,
          {
            path: '*',
            element: <Navigate to="/" replace />,
          },
        ],
      },
    ]);
  }, []);

  return <RouterProvider router={routerInstance} />;
}

export default App;
