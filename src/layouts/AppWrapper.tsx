import { Suspense } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';
import AppMenu from './AppMenu';
import AppUser from './AppUser';
import RouteLoadingFallback from './fallback/RouteLoadingFallback';
import { KeepAliveOutlet, KeepAliveProvider, useKeepAliveActiveKey } from './keep-alive';
import Logo from './Logo';

const AppWrapper = () => {
  const activeKey = useKeepAliveActiveKey();

  return (
    <KeepAliveProvider>
      <div className="h-full flex">
        <aside className="flex-none w-80 flex flex-col gap-0.5 bg-sidebar">
          <div className="flex-none px-11 pt-4 box-border">
            <Logo className="size-10" />
          </div>

          <div className="flex-1 h-full overflow-hidden my-2">
            <ScrollArea className="h-full px-6 box-border">
              <AppMenu />
            </ScrollArea>
          </div>

          <div className="flex-none px-6 pb-4 box-border">
            <AppUser />
          </div>
        </aside>

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
