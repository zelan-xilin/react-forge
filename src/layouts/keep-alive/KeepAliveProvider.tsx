import { type ReactNode, useCallback, useRef, useState } from 'react';

import type { KeepAliveCache, KeepAliveContextType } from './types';
import { KeepAliveContext } from './useKeepAlive';

function KeepAliveProvider({ children }: { children: ReactNode }) {
  const cache = useRef<Map<string, KeepAliveCache>>(new Map());
  const subscribers = useRef<Set<() => void>>(new Set());
  const [, forceUpdate] = useState(0);

  const removeLowestWeight = () => {
    let minKey: string | null = null;
    let minWeight = Infinity;

    cache.current.forEach((value, key) => {
      if (value.weight < minWeight) {
        minWeight = value.weight;
        minKey = key;
      }
    });

    if (minKey !== null) {
      cache.current.delete(minKey);
    }
  };

  const notify = useCallback(() => {
    Promise.resolve().then(() => {
      subscribers.current.forEach(fn => fn());
    });
  }, []);
  const getKeys: KeepAliveContextType['getKeys'] = useCallback(() => {
    return Array.from(cache.current.keys());
  }, []);
  const getOutlet: KeepAliveContextType['getOutlet'] = useCallback(key => {
    return cache.current.get(key);
  }, []);
  const addOutlet: KeepAliveContextType['addOutlet'] = useCallback(
    (key, node, title, max = Infinity) => {
      const version = cache.current.get(key)?.version ?? 0;
      cache.current.set(key, { node, title, weight: Date.now(), version });

      if (cache.current.size > max) {
        removeLowestWeight();
      }

      notify();
    },
    [notify],
  );
  const removeOutlet: KeepAliveContextType['removeOutlet'] = useCallback(
    key => {
      cache.current.delete(key);
      notify();
    },
    [notify],
  );
  const refreshOutlet: KeepAliveContextType['refreshOutlet'] = useCallback((key, currentPath) => {
    const item = cache.current.get(key);
    if (!item) {
      return;
    }

    item.version += 1;
    item.weight = Date.now();

    if (key === currentPath) {
      forceUpdate(c => c + 1);
    }
  }, []);

  const setTitle: KeepAliveContextType['setTitle'] = useCallback(
    (key, title) => {
      const cacheItem = cache.current.get(key);
      if (cacheItem && cacheItem.title !== title) {
        cacheItem.title = title;
        notify();
      }
    },
    [notify],
  );
  const subscribe: KeepAliveContextType['subscribe'] = useCallback(callback => {
    subscribers.current.add(callback);
    return () => subscribers.current.delete(callback);
  }, []);

  return (
    <KeepAliveContext.Provider
      value={{
        getKeys,
        getOutlet,
        addOutlet,
        removeOutlet,
        refreshOutlet,
        setTitle,
        subscribe,
      }}
    >
      {children}
    </KeepAliveContext.Provider>
  );
}

export default KeepAliveProvider;
