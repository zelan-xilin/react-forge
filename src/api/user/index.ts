import request from '@/lib/request';
import type { RequestDto, RequestPageDto } from '../types';
import type {
  CountsDto,
  UserAddOrUpdateParams,
  UserDto,
  UserNameExistsDto,
  UserPageParams,
} from './types';

/**
 * 统计接口
 */
export const userCountApi = (): RequestDto<CountsDto> => {
  return request({
    url: '/users/count',
    method: 'get',
  });
};

/**
 * 用户列表接口
 */
export const userListApi = (): RequestDto<UserDto[]> => {
  return request({
    url: '/users/list',
    method: 'get',
  });
};

/**
 * 用户分页接口
 */
export const userPageApi = (params: UserPageParams): RequestPageDto<UserDto[]> => {
  return request({
    url: '/users/page',
    method: 'get',
    params,
  });
};

/**
 * 用户名称唯一性校验接口
 */
export const userNameExistsApi = (name: string, userId?: number): RequestDto<UserNameExistsDto> => {
  return request({
    url: '/users/exists',
    method: 'get',
    params: { name, userId },
  });
};

/**
 * 用户新增接口
 */
export const userAddApi = (data: UserAddOrUpdateParams): RequestDto<UserDto> => {
  return request({
    url: '/users',
    method: 'post',
    data,
  });
};

/**
 * 用户编辑接口
 */
export const userUpdateApi = (data: UserAddOrUpdateParams): RequestDto<UserDto> => {
  return request({
    url: `/users/${data.id}`,
    method: 'put',
    data,
  });
};

/**
 * 用户删除接口
 */
export const userDeleteApi = (userId: number) => {
  return request({
    url: `/users/${userId}`,
    method: 'delete',
  });
};
