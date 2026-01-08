import { Suspense } from 'react';

import RouteLoadingFallback from './fallback/RouteLoadingFallback';
import { KeepAliveOutlet, useKeepAliveActiveKey } from './keep-alive';

const AppMain = () => {
  const activeKey = useKeepAliveActiveKey();

  return (
    <main className="flex-1 overflow-hidden">
      <Suspense fallback={<RouteLoadingFallback />}>
        <KeepAliveOutlet activeKey={activeKey} />
      </Suspense>
    </main>
  );
};

export default AppMain;
