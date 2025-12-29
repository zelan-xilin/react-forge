import type { ReactNode } from 'react';

export interface KeepAliveCache {
  node: ReactNode;
  title?: string;
  weight: number;
  version: number;
}
export interface KeepAliveContextType {
  getKeys: () => string[];
  getOutlet: (key: string) => KeepAliveCache | undefined;
  getSnapshot: () => Map<string, KeepAliveCache>;

  addOutlet: (key: string, node: ReactNode, title?: string, max?: number) => void;
  removeOutlet: (key: string, completely?: boolean) => void;
  refreshOutlet: (key: string) => void;
  setTitle: (key: string, title: string) => void;

  /** Tab 订阅 */
  subscribeTabs: (callback: () => void) => () => void;
  getTabVersion: () => number;

  /** Outlet 订阅 */
  subscribeOutlets: (callback: () => void) => () => void;
  getOutletVersion: () => number;
}
