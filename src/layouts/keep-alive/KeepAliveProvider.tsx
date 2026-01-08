import { type ReactNode, useCallback, useMemo, useRef } from 'react';

import type { KeepAliveCache, KeepAliveContextType } from './types';
import { KeepAliveContext } from './useKeepAlive';

function KeepAliveProvider({ children }: { children: ReactNode }) {
  const cache = useRef<Map<string, KeepAliveCache>>(new Map());
  const cacheTitle = useRef<Map<string, string>>(new Map());
  const cacheAliveCount = useRef<number>(0);

  const tabVersion = useRef<number>(0);
  const tabSubscribers = useRef<Set<() => void>>(new Set());
  const notifyTabs = useCallback(() => {
    tabVersion.current += 1;

    Promise.resolve().then(() => {
      tabSubscribers.current.forEach(fn => fn());
    });
  }, []);

  const outletVersion = useRef<number>(0);
  const outletSubscribers = useRef<Set<() => void>>(new Set());
  const notifyOutlets = useCallback(() => {
    outletVersion.current += 1;

    Promise.resolve().then(() => {
      outletSubscribers.current.forEach(fn => fn());
    });
  }, []);

  const removeLowestWeight = (activeKey: string) => {
    let min: KeepAliveCache | null = null;

    for (const [k, v] of cache.current) {
      if (k === activeKey) {
        continue;
      }
      if (!v.node) {
        continue;
      }

      if (!min || v.weight < min.weight) {
        min = v;
      }
    }

    if (!min) {
      return;
    }

    min.node = null;
    min.instanceId += 1;
    cacheAliveCount.current -= 1;
  };

  const getKeys: KeepAliveContextType['getKeys'] = useCallback(() => {
    return Array.from(cache.current.keys());
  }, []);
  const getOutlet: KeepAliveContextType['getOutlet'] = useCallback(key => {
    return cache.current.get(key);
  }, []);
  const getSnapshot: KeepAliveContextType['getSnapshot'] = useCallback(() => {
    return cache.current;
  }, []);

  const addOutlet: KeepAliveContextType['addOutlet'] = useCallback(
    (key, node, max = Infinity) => {
      const prev = cache.current.get(key);

      const prevNode = prev?.node ?? null;
      const nextNode = node ?? null;

      const prevHad = prevNode !== null;
      const nextHad = nextNode !== null;

      if (!prevHad && nextHad) {
        cacheAliveCount.current += 1;
      }
      if (prevHad && !nextHad) {
        cacheAliveCount.current -= 1;
      }

      if (!prev) {
        cache.current.set(key, {
          node: nextNode,
          title: cacheTitle.current.get(key),
          weight: Date.now(),
          instanceId: 0,
          refreshId: 0,
        });
      } else {
        prev.node = nextNode;
        prev.weight = Date.now();
      }

      cacheTitle.current.delete(key);

      if (cacheAliveCount.current > max) {
        removeLowestWeight(key);
      }

      notifyTabs();
      notifyOutlets();
    },
    [notifyTabs, notifyOutlets],
  );
  const removeOutlet: KeepAliveContextType['removeOutlet'] = useCallback(
    (key, completely) => {
      const item = cache.current.get(key);

      if (!item) {
        return;
      }

      if (item.node) {
        cacheAliveCount.current -= 1;
      }

      if (completely) {
        cache.current.delete(key);
        cacheTitle.current.delete(key);

        notifyTabs();
        notifyOutlets();
        return;
      }

      item.node = null;
      item.instanceId += 1;
      notifyOutlets();
    },
    [notifyOutlets, notifyTabs],
  );
  const refreshOutlet: KeepAliveContextType['refreshOutlet'] = useCallback(
    (key, reset) => {
      const item = cache.current.get(key)!;

      if (!item) {
        return;
      }

      item.refreshId += 1;
      item.weight = Date.now();

      if (reset) {
        item.instanceId += 1;
      }

      notifyOutlets();
    },
    [notifyOutlets],
  );
  const setTitle: KeepAliveContextType['setTitle'] = useCallback(
    (key, title) => {
      cacheTitle.current.delete(key);
      const cacheItem = cache.current.get(key);

      if (cacheItem && cacheItem.title !== title) {
        cacheItem.title = title;
        notifyTabs();
        return;
      }

      if (!cacheItem) {
        cacheTitle.current.set(key, title);
      }
    },
    [notifyTabs],
  );

  const clearAll: KeepAliveContextType['clearAll'] = useCallback(() => {
    cache.current.clear();
    cacheTitle.current.clear();
    cacheAliveCount.current = 0;

    notifyTabs();
    notifyOutlets();
  }, [notifyOutlets, notifyTabs]);

  const subscribeTabs: KeepAliveContextType['subscribeTabs'] = useCallback(callback => {
    tabSubscribers.current.add(callback);
    return () => tabSubscribers.current.delete(callback);
  }, []);
  const getTabVersion: KeepAliveContextType['getTabVersion'] = useCallback(() => {
    return tabVersion.current;
  }, []);

  const subscribeOutlets: KeepAliveContextType['subscribeOutlets'] = useCallback(callback => {
    outletSubscribers.current.add(callback);
    return () => outletSubscribers.current.delete(callback);
  }, []);
  const getOutletVersion: KeepAliveContextType['getOutletVersion'] = useCallback(() => {
    return outletVersion.current;
  }, []);

  const contextValue = useMemo<KeepAliveContextType>(
    () => ({
      getKeys,
      getOutlet,
      getSnapshot,

      addOutlet,
      removeOutlet,
      refreshOutlet,
      setTitle,

      clearAll,

      subscribeTabs,
      getTabVersion,
      subscribeOutlets,
      getOutletVersion,
    }),
    [
      getKeys,
      getOutlet,
      getSnapshot,
      addOutlet,
      removeOutlet,
      refreshOutlet,
      setTitle,
      clearAll,
      subscribeTabs,
      getTabVersion,
      subscribeOutlets,
      getOutletVersion,
    ],
  );

  return <KeepAliveContext.Provider value={contextValue}>{children}</KeepAliveContext.Provider>;
}

export default KeepAliveProvider;
