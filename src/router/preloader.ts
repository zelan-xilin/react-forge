import { permissionRoutes } from '.';

const registry = new Map(permissionRoutes.map(r => [r.path, r.lazy]));
const loaded = new Set<string>();
const loading = new Set<string>();

/**
 * 加载指定路径的路由组件
 */
const preload = (path: string) => {
  if (loaded.has(path) || loading.has(path)) {
    return;
  }

  const lazy = registry.get(path);
  if (!lazy) {
    return;
  }

  loading.add(path);
  lazy()
    .then(() => loaded.add(path))
    .catch(err => console.error(`preloader -> preload: `, err))
    .finally(() => loading.delete(path));
};

/**
 * 分批次预加载路由组件
 */
const scheduleIdleCallback = (
  callback: (deadline?: IdleDeadline) => void,
  timeout = 2000,
  fallbackDelay = 200,
) => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, { timeout });
  } else {
    setTimeout(() => callback(), fallbackDelay);
  }
};
const preloadBatchIdle = async (batchSize = 2) => {
  const queue = [...permissionRoutes];

  const loadNextChunk = (deadline?: IdleDeadline) => {
    if (!queue.length) {
      return;
    }

    let count = 0;
    const remaining = deadline ? deadline.timeRemaining() : Infinity;
    while (queue.length && count < batchSize && remaining > 1) {
      const r = queue.shift();

      if (r && !loaded.has(r.path) && !loading.has(r.path)) {
        preload(r.path);
      }

      count++;
    }

    if (queue.length) {
      scheduleIdleCallback(loadNextChunk);
    }
  };

  scheduleIdleCallback(loadNextChunk);
};

/**
 * 空闲时间预加载路由组件
 */
let idlePreloadScheduled = false;
const preloadIdle = () => {
  if (idlePreloadScheduled) {
    return;
  }
  idlePreloadScheduled = true;

  window.requestAnimationFrame(() => {
    preloadBatchIdle();
  });
};

export { preload, preloadIdle };
