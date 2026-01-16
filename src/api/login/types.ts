import type { IS_ADMIN, STATUS } from '@/assets/enum';

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
    status: STATUS;
    isAdmin: IS_ADMIN;
    roleId: number | null;
    description: string | null;
    createdBy: number | null;
    createdAt: string | null;
    updatedBy: number | null;
    updatedAt: string | null;
  };
  permissions: {
    actions: { module: string; action: string }[];
    paths: string[];
  };
}
