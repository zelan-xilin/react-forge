import { Loader } from 'lucide-react';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';
import PermissionRoute from './layouts/PermissionRoute';
import ProtectedRoute from './layouts/ProtectedRoute';
import { permissionRoutes, whiteListRoutes } from './router';
import type { RootState } from './store';

function RouteFallback() {
  return (
    <div className="text-primary flex h-full items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  );
}

function RedirectToFirstAllowed() {
  const auth = useSelector((state: RootState) => state.auth);

  const firstRouter = useMemo(() => {
    const nonParameterizedPathRegex = /^[^:]+$/;

    return permissionRoutes.find(
      r =>
        nonParameterizedPathRegex.test(r.path) &&
        (auth.hasUnrestrictedPermissions || auth.menus.includes(r.path)),
    );
  }, [auth.hasUnrestrictedPermissions, auth.menus]);

  if (!firstRouter) {
    return <div>您没有可访问的页面。</div>;
  }

  return <Navigate to={firstRouter.path} replace />;
}

function App() {
  const routerInstance = useMemo(() => {
    const rootChildren = permissionRoutes.map(r => {
      return {
        path: r.path.replace(/^\//, ''),
        lazy: async () => {
          const mod = await r.lazy();

          return {
            element: <PermissionRoute path={r.path}>{<mod.default />}</PermissionRoute>,
          };
        },
      };
    });

    return createBrowserRouter([
      ...whiteListRoutes,
      {
        path: '/',
        element: <ProtectedRoute />,
        hydrateFallbackElement: <RouteFallback />,
        children: [
          {
            index: true,
            element: <RedirectToFirstAllowed />,
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
