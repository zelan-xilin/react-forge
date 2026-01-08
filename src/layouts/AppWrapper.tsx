import { Suspense } from 'react';

import AppHeaderLogo from './app-header/AppHeaderLogo';
import AppHeaderMenu from './app-header/AppHeaderMenu';
import AppHeaderUser from './app-header/AppHeaderUser';
import { RouteLoadingFallback } from './fallback';
import { KeepAliveOutlet, KeepAliveProvider, useKeepAliveActiveKey } from './keep-alive';

const AppWrapper = () => {
  const activeKey = useKeepAliveActiveKey();

  return (
    <KeepAliveProvider>
      <div className="h-full flex flex-col box-border py-4 pl-4 gap-4">
        <header className="flex-none pr-4 box-border flex justify-between items-center">
          <AppHeaderLogo />
          <AppHeaderMenu />
          <AppHeaderUser />
        </header>

        <main className="flex-1 overflow-hidden">
          <Suspense fallback={<RouteLoadingFallback />}>
            <KeepAliveOutlet activeKey={activeKey} />
          </Suspense>
        </main>
      </div>
    </KeepAliveProvider>
  );
};

export default AppWrapper;
