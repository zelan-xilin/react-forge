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
    let minWeight = Infinity;
    let minItem: KeepAliveCache | null = null;

    for (const [key, value] of cache.current) {
      if (value.node === null || activeKey === key) {
        continue;
      }

      if (value.weight < minWeight) {
        minWeight = value.weight;
        minItem = value;
      }
    }

    if (minItem === null) {
      return;
    }

    minItem.node = null;
    minItem.version += 1;
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
    (key, node, title, max = Infinity) => {
      const prev = cache.current.get(key);

      const prevNode = prev?.node ?? null;
      const nextNode = node ?? null;

      const prevHadNode = prevNode != null;
      const nextHadNode = nextNode != null;

      const prevTitle = prev?.title;
      const nextTitle = title ?? cacheTitle.current.get(key) ?? prevTitle;

      if (!prevHadNode && nextHadNode) {
        cacheAliveCount.current += 1;
      }
      if (prevHadNode && !nextHadNode) {
        cacheAliveCount.current -= 1;
      }

      cache.current.set(key, {
        node: nextNode,
        title: nextTitle,
        weight: Date.now(),
        version: prev?.version ?? 0,
      });
      cacheTitle.current.delete(key);

      let removeCacheNode = false;
      if (cacheAliveCount.current > max) {
        removeCacheNode = true;
        removeLowestWeight(key);
      }

      const isAdd = !prev;
      const nodeChanged = prev?.node !== nextNode;
      const titleChanged = prev?.title !== nextTitle;
      if (isAdd || titleChanged) {
        notifyTabs();
      }
      if (isAdd || nodeChanged || removeCacheNode) {
        notifyOutlets();
      }
    },
    [notifyTabs, notifyOutlets],
  );
  const removeOutlet: KeepAliveContextType['removeOutlet'] = useCallback(
    (key, completely) => {
      const item = cache.current.get(key);

      if (!item) {
        return;
      }

      if (item.node !== null) {
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
      item.version += 1;
      notifyOutlets();
    },
    [notifyOutlets, notifyTabs],
  );
  const refreshOutlet: KeepAliveContextType['refreshOutlet'] = useCallback(
    key => {
      const item = cache.current.get(key)!;

      if (!item) {
        return;
      }

      item.version += 1;
      item.weight = Date.now();

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

      cacheTitle.current.set(key, title);
    },
    [notifyTabs],
  );

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
      subscribeTabs,
      getTabVersion,
      subscribeOutlets,
      getOutletVersion,
    ],
  );

  return <KeepAliveContext.Provider value={contextValue}>{children}</KeepAliveContext.Provider>;
}

export default KeepAliveProvider;
