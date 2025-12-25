import { Suspense } from 'react';
import { Link, Outlet } from 'react-router';
import RouteLoadingFallback from './RouteLoadingFallback';

const AppWrapper = () => {
  return (
    <div className="h-full overflow-hidden flex flex-col">
      <header className="border-b px-4 py-3">
        <div className="mx-auto w-full max-w-7xl">Header</div>
        <Link to="/home">Home</Link>
        <Link to="/user" className="ml-4">User</Link>
      </header>

      <main className="flex-1 p-4">
        <Suspense fallback={<RouteLoadingFallback />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};

export default AppWrapper;