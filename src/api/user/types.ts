import type { IS_ADMIN, STATUS } from '../types';

/**
 * 用户 page list 接口返回数据
 */
export interface UserDto {
  id: number;
  username: string;
  roleId: number;
  roleName: string;
  status: STATUS;
  description: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedBy: string;
  updatedByName: string;
  updatedAt: string;
  isAdmin: IS_ADMIN;
  phone?: string;
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
  roleId?: number;
  status?: STATUS;
  description?: string;
  isAdmin?: IS_ADMIN;
  phone?: string;
}
