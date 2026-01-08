import type { ReactNode } from 'react';

export interface KeepAliveCache {
  node: ReactNode;
  title?: string;
  weight: number;
  instanceId: number;
  refreshId: number;
}
export interface KeepAliveContextType {
  getKeys: () => string[];
  getOutlet: (key: string) => KeepAliveCache | undefined;
  getSnapshot: () => Map<string, KeepAliveCache>;

  addOutlet: (key: string, node: ReactNode, max?: number) => void;
  removeOutlet: (key: string, completely?: boolean) => void;
  refreshOutlet: (key: string, reset?: boolean) => void;
  setTitle: (key: string, title: string) => void;

  /** 清除所有缓存 */
  clearAll: () => void;

  /** Tab 订阅 */
  subscribeTabs: (callback: () => void) => () => void;
  getTabVersion: () => number;

  /** Outlet 订阅 */
  subscribeOutlets: (callback: () => void) => () => void;
  getOutletVersion: () => number;
}
