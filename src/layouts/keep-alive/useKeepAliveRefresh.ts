import { useSyncExternalStore } from 'react';
import { useLocation } from 'react-router';

import { useKeepAlive } from './useKeepAlive';

export const useKeepAliveRefresh = () => {
  const location = useLocation();
  const { getOutlet, subscribeOutlets, getOutletVersion } = useKeepAlive();

  const v = useSyncExternalStore(subscribeOutlets, getOutletVersion);
  void v;

  return getOutlet(location.pathname)?.refreshId;
};
