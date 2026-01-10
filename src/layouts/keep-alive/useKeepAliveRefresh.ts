import { useState, useSyncExternalStore } from 'react';

import { useKeepAlive } from './useKeepAlive';

export const useKeepAliveRefresh = (pagePath: string) => {
  const { getOutlet, subscribeOutlets, getOutletVersion, refreshOutlet } = useKeepAlive();

  const v = useSyncExternalStore(subscribeOutlets, getOutletVersion, getOutletVersion);
  void v;

  const [refreshLoading, setRefreshLoading] = useState(false);

  return {
    refreshId: getOutlet(pagePath)?.refreshId,
    refreshLoading,
    onRefresh: () => {
      refreshOutlet(pagePath);
      setRefreshLoading(true);
      setTimeout(() => {
        setRefreshLoading(false);
      }, 300);
    },
  };
};
