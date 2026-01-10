import request from '@/lib/request';
import type { RequestDto, RequestPageDto } from '../types';
import type {
  CountsDto,
  RoleAddOrUpdateParams,
  RoleDto,
  RoleNameExistsDto,
  RolePageParams,
  RolePathsParams,
} from './types';

/**
 * 统计接口
 */
export const roleCountApi = (): RequestDto<CountsDto> => {
  return request({
    url: '/roles/count',
    method: 'get',
  });
};

/**
 * 角色列表接口
 */
export const roleListApi = (): RequestDto<RoleDto[]> => {
  return request({
    url: '/roles/list',
    method: 'get',
  });
};

/**
 * 角色分页接口
 */
export const rolePageApi = (params: RolePageParams): RequestPageDto<RoleDto[]> => {
  return request({
    url: '/roles/page',
    method: 'get',
    params,
  });
};

/**
 * 角色名称唯一性校验接口
 */
export const roleNameExistsApi = (name: string, roleId?: string): RequestDto<RoleNameExistsDto> => {
  return request({
    url: '/roles/exists',
    method: 'get',
    params: { name, roleId },
  });
};

/**
 * 角色新增接口
 */
export const roleAddApi = (data: RoleAddOrUpdateParams): RequestDto<RoleDto> => {
  return request({
    url: '/roles',
    method: 'post',
    data,
  });
};

/**
 * 角色编辑接口
 */
export const roleUpdateApi = (data: RoleAddOrUpdateParams): RequestDto<RoleDto> => {
  return request({
    url: `/roles/${data.id}`,
    method: 'put',
    data,
  });
};

/**
 * 角色删除接口
 */
export const roleDeleteApi = (roleId: string) => {
  return request({
    url: `/roles/${roleId}`,
    method: 'delete',
  });
};

/**
 * 角色 path 权限查询接口
 */
export const roleAuthGetApi = (roleId: string): RequestDto<string[]> => {
  return request({
    url: `/roles/${roleId}/path`,
    method: 'get',
  });
};

/**
 * 角色 path 权限保存接口
 */
export const roleAuthSaveApi = (roleId: string, data: RolePathsParams) => {
  return request({
    url: `/roles/${roleId}/path`,
    method: 'put',
    data,
  });
};
