import { BadgeJapaneseYen } from 'lucide-react';
import { Suspense } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MenuRouterConfigType } from '@/router/types';
import AppMenu from './AppMenu';
import AppUser from './AppUser';
import RouteLoadingFallback from './fallback/RouteLoadingFallback';
import { KeepAliveOutlet, KeepAliveProvider, useKeepAliveActiveKey } from './keep-alive';

const AppWrapper = () => {
  const activeKey = useKeepAliveActiveKey();

  return (
    <KeepAliveProvider>
      <div className="h-full flex">
        <aside className='flex-none w-100 border-r flex flex-col gap-0.5'>
          <div className='flex-none px-6 py-4 box-border'>
            <Button size="icon-xl" className="rounded-full cursor-default size-16">
              <BadgeJapaneseYen className="size-9" />
            </Button>
          </div>

          <ScrollArea className='h-full flex-1 px-6 box-border'>
            <AppMenu type={MenuRouterConfigType.FEATURE} />
          </ScrollArea>

          <div className='flex-none px-6 box-border'>
            <AppMenu type={MenuRouterConfigType.SETTING} />
          </div>

          <div className='flex-none px-6 pb-4 box-border'>
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
