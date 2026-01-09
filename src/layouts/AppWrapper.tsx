import { Suspense } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';
import { MenuRouterConfigType } from '@/router/types';
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
        <aside className="flex-none w-90 border-r flex flex-col gap-0.5">
          <div className="flex-none px-6 pt-4 box-border">
            <Logo className="size-10" />
          </div>

          <div className="flex-1 h-full overflow-hidden my-2">
            <ScrollArea className="h-full px-6 box-border">
              <AppMenu type={MenuRouterConfigType.FEATURE} />
            </ScrollArea>
          </div>

          <div className="flex-none px-6 box-border">
            <div className="text-xs text-muted-foreground">系统设置</div>
            <AppMenu type={MenuRouterConfigType.SETTING} />
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
