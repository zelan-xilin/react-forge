/**
 * 角色 page list 接口返回数据
 */
export interface RoleDto {
  id: number;
  name: string;
  description: string | null;
  createdBy: number;
  createdByName: string;
  createdAt: string;
  updatedBy: number | null;
  updatedByName: string | null;
  updatedAt: string | null;
}

/**
 * 角色名称唯一性校验接口返回数据
 */
export interface RoleNameExistsDto {
  exists: boolean;
}

/**
 * 角色 page 请求参数
 */
export interface RolePageParams {
  page: number;
  pageSize: number;
  name?: string;
}

/**
 * 角色新增/编辑请求参数
 */
export interface RoleAddOrUpdateParams {
  id?: number;
  name: string;
  description?: string | null;
}

/**
 * 角色权限保存请求参数
 */
export interface RolePathsParams {
  paths: string[];
}
