
export const MenuRouterConfigType = {
  FEATURE: 'feature',
  SETTING: 'setting',
} as const;
export type MenuRouterConfigType = (typeof MenuRouterConfigType)[keyof typeof MenuRouterConfigType];