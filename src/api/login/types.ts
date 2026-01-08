export const IS_ADMIN = {
  NO: 0,
  YES: 1,
} as const;
export type IS_ADMIN = (typeof IS_ADMIN)[keyof typeof IS_ADMIN];

export const USER_STATUS = {
  DISABLE: 0,
  ENABLE: 1,
} as const;
export type USER_STATUS = (typeof USER_STATUS)[keyof typeof USER_STATUS];

/**
 * 登录接口参数
 */
export interface LoginParams {
  username: string;
  password: string;
}

/**
 * 登录接口返回数据
 */
export interface LoginDto {
  token: string;
  user: {
    id: number;
    username: string;
    roleId: number | null;
    description: string;
    createdBy: number | null;
    createdAt: string | null;
    updatedBy: number | null;
    updatedAt: string | null;
    status: USER_STATUS;
    isAdmin: IS_ADMIN;
  };
  permissions: {
    actions: { module: string; action: string }[];
    paths: string[];
  };
}
