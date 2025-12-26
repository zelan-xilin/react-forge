import { Suspense, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router';

import { findRouteByPath } from '@/router';
import RouteLoadingFallback from './RouteLoadingFallback';
import { KeepAliveOutlet, KeepAliveProvider, useKeepAlive } from './keep-alive';

const Tab = () => {
  const location = useLocation();
  const { getKeys, getOutlet, refreshOutlet, subscribe } = useKeepAlive();
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      forceUpdate(c => c + 1);
    });
    return unsubscribe;
  }, [subscribe]);

  const entries = useMemo(() => {
    let paths = getKeys();
    paths = paths.includes(location.pathname) ? paths : [...paths, location.pathname];

    return paths.map(path => ({
      path,
      title: getOutlet(path)?.title ?? findRouteByPath(path)?.title ?? 'No Title',
    }));
  }, [location.pathname, getKeys, getOutlet]);

  return (
    <div className="mt-7 border">
      {entries.map(t => (
        <div key={t.path} className="p-2">
          <strong>{t.title}</strong>
          <span>:</span>
          <span>{t.path}</span>
        </div>
      ))}

      <div onClick={() => refreshOutlet('/home', location.pathname)}>home</div>
      <div onClick={() => refreshOutlet('/user', location.pathname)}>user</div>
    </div>
  );
};

const AppWrapper = () => {
  return (
    <KeepAliveProvider>
      <div className="h-full flex flex-col">
        <header className="border-b px-4 py-3">
          <div className="mx-auto w-full max-w-7xl">Header</div>
          <Link to="/home" className="border">
            Home
          </Link>
          <Link to="/user" className="ml-4 border">
            User
          </Link>

          <Tab />
        </header>

        <main className="flex-1">
          <Suspense fallback={<RouteLoadingFallback />}>
            <KeepAliveOutlet />
          </Suspense>
        </main>
      </div>
    </KeepAliveProvider>
  );
};

export default AppWrapper;
