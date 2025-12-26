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
  addOutlet: (key: string, node: ReactNode, title?: string, max?: number) => void;
  removeOutlet: (key: string) => void;
  refreshOutlet: (key: string, currentPath: string) => void;
  setTitle: (key: string, title: string) => void;
  subscribe: (callback: () => void) => () => void;
}
