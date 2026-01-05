import type { ComponentType, ReactNode } from 'react';

interface BaseRouterConfig {
  path: string;
  title: string | null;
}

export interface WhiteListRouterConfig extends BaseRouterConfig {
  element: ReactNode;
}

export interface MenuRouterConfig extends BaseRouterConfig {
  children?: MenuRouterConfig[];
  lazy?: () => Promise<{
    default: ComponentType<unknown>;
    ErrorBoundary?: ComponentType<unknown>;
    loader?: () => Promise<unknown>;
    action?: () => Promise<unknown>;
    shouldRevalidate?: () => boolean;
  }>;
}

export interface PermissionRouterConfig extends Omit<MenuRouterConfig, 'children' | 'lazy'> {
  lazy: NonNullable<MenuRouterConfig['lazy']>;
}
