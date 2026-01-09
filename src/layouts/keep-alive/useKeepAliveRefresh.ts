import { useSyncExternalStore } from 'react';

import { useKeepAlive } from './useKeepAlive';

export const useKeepAliveRefresh = (pagePath: string) => {
  const { getOutlet, subscribeOutlets, getOutletVersion, refreshOutlet } = useKeepAlive();

  const v = useSyncExternalStore(subscribeOutlets, getOutletVersion, getOutletVersion);
  void v;

  return {
    refreshId: getOutlet(pagePath)?.refreshId,
    refresh: () => refreshOutlet(pagePath),
  };
};
