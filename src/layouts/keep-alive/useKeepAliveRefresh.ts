import { useSyncExternalStore } from 'react';

import { useKeepAlive } from './useKeepAlive';

export const useKeepAliveRefresh = (pagePath: string) => {
  const { getOutlet, subscribeOutlets, getOutletVersion } = useKeepAlive();

  const v = useSyncExternalStore(subscribeOutlets, getOutletVersion, getOutletVersion);
  void v;

  return getOutlet(pagePath)?.refreshId;
};
