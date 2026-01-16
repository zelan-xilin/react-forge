import request from '@/lib/request';
import type { RequestDto, RequestPageDto } from '../types';
import type { AreaDto, AreaNameExistsDto, AreaPageParams } from './types';

/**
 * 区域新增接口
 */
export const areaAddApi = (data: Omit<AreaDto, 'id'>) => {
  return request({
    url: '/areas',
    method: 'post',
    data,
  });
};

/**
 * 区域更新接口
 */
export const areaUpdateApi = (data: Partial<AreaDto>) => {
  return request({
    url: `/areas/${data.id}`,
    method: 'put',
    data,
  });
};

/**
 * 区域删除接口
 */
export const areaDeleteApi = (areaId: number) => {
  return request({
    url: `/areas/${areaId}`,
    method: 'delete',
  });
};

/**
 * 分页查询区域接口
 */
export const areaPageApi = (
  params: AreaPageParams,
): RequestPageDto<AreaDto[]> => {
  return request({
    url: '/areas/page',
    method: 'get',
    params,
  });
};

/**
 * 区域list接口
 */
export const areaListApi = (): RequestDto<AreaDto[]> => {
  return request({
    url: '/areas/list',
    method: 'get',
  });
};

/**
 * 区域名称唯一性校验接口
 */
export const areaNameExistsApi = (
  name: string,
  areaId?: number,
): RequestDto<AreaNameExistsDto> => {
  return request({
    url: '/areas/exists',
    method: 'get',
    params: {
      name,
      areaId,
    },
  });
};
