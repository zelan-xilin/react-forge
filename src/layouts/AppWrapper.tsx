import { Suspense, useMemo, useSyncExternalStore } from 'react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { isExactPathMatch, permissionRoutes } from '@/router';
import { RouteLoadingFallback } from './fallback';
import { KeepAliveOutlet, KeepAliveProvider, useKeepAlive } from './keep-alive';

const Tab = () => {
  const {
    getSnapshot,
    getOutlet,
    addOutlet,
    setTitle,
    refreshOutlet,
    removeOutlet,
    subscribeTabs,
    getTabVersion,
  } = useKeepAlive();

  const tabVersion = useSyncExternalStore(subscribeTabs, getTabVersion, getTabVersion);

  const entries = useMemo(() => {
    void tabVersion;

    const snapshot = getSnapshot();
    return Array.from(snapshot.entries())
      .map(([path, item]) => {
        const permissionRoute = permissionRoutes.find(r => isExactPathMatch(r.path, path));

        return {
          path,
          title: item.title ?? permissionRoute?.title,
          icon: permissionRoute?.icon,
        };
      })
      .filter(e => e.title);
  }, [getSnapshot, tabVersion]);

  return (
    <div className="mt-7 border">
      <div>导航栏</div>
      <div className="flex gap-6">
        {entries.map(t => (
          <Button key={t.path} className="p-2">
            <strong>{t.title}</strong>
            <span>:</span>
            <span>{t.path}</span>
          </Button>
        ))}
      </div>

      <br />
      <div className="flex gap-6">
        <Button onClick={() => refreshOutlet('/home')}>刷新home</Button>
        <Button onClick={() => refreshOutlet('/user')}>刷新user</Button>
      </div>

      <br />
      <div className="flex gap-6">
        <Button onClick={() => removeOutlet('/home', true)}>删除home</Button>
        <Button onClick={() => removeOutlet('/user', false)}>删除user</Button>
      </div>

      <br />
      <div className="flex gap-6">
        <Button onClick={() => addOutlet('/home', getOutlet('/home')?.node)}>新增home</Button>
        <Button onClick={() => addOutlet('/user', getOutlet('/user')?.node)}>新增user</Button>
      </div>

      <br />
      <div className="flex gap-6">
        <Button onClick={() => setTitle('/home', 'replace_home')}>重命名home</Button>
        <Button onClick={() => setTitle('/user', 'replace_user')}>重命名user</Button>
      </div>
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
