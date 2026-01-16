import { useState, useSyncExternalStore } from 'react';
import { useKeepAlive } from './useKeepAlive';

export const useKeepAliveRefresh = (pagePath: string) => {
  const { getOutlet, subscribeOutlets, getOutletVersion, refreshOutlet } =
    useKeepAlive();

  const v = useSyncExternalStore(
    subscribeOutlets,
    getOutletVersion,
    getOutletVersion,
  );
  void v;

  const refreshId = getOutlet(pagePath)?.refreshId;
  const [refreshLoading, setRefreshLoading] = useState(false);
  const onRefresh = () => {
    refreshOutlet(pagePath);
    setRefreshLoading(true);

    setTimeout(() => {
      setRefreshLoading(false);
    }, 300);
  };

  return {
    refreshId,
    refreshLoading,
    onRefresh,
  };
};
