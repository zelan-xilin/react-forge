import type { ComponentType } from 'react';

interface BaseRouterConfig {
  path: string;
  title: string | null;
}

export interface MenuRouterConfig extends BaseRouterConfig {
  icon: ComponentType<{ className?: string }>;
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
