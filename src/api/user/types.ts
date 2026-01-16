import type { IS_ADMIN, STATUS } from '@/assets/enum';

/**
 * 用户 page list 接口返回数据
 */
export interface UserDto {
  id: number;
  username: string;
  roleId: number | null;
  roleName: string | null;
  status: STATUS;
  description: string | null;
  createdBy: number;
  createdByName: string;
  createdAt: string;
  updatedBy: number | null;
  updatedByName: string | null;
  updatedAt: string | null;
  isAdmin: IS_ADMIN;
  phone: string | null;
}

/**
 * 用户名称唯一性校验接口返回数据
 */
export interface UserNameExistsDto {
  exists: boolean;
}

/**
 * 用户 page 请求参数
 */
export interface UserPageParams {
  page: number;
  pageSize: number;
  username?: string;
}

/**
 * 用户新增/编辑请求参数
 */
export interface UserAddOrUpdateParams {
  id?: number;
  username: string;
  password?: string;
  roleId?: number | null;
  status?: STATUS;
  description?: string | null;
  isAdmin?: IS_ADMIN;
  phone?: string | null;
}
