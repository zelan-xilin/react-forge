import request from '@/lib/request';
import type { RequestDto, RequestPageDto } from '../types';
import type {
  MaterialDto,
  MaterialNameExistsDto,
  MaterialPageParams,
} from './types';

/**
 * 物料新增接口
 */
export const materialAddApi = (data: Omit<MaterialDto, 'id'>) => {
  return request({
    url: '/materials',
    method: 'post',
    data,
  });
};

/**
 * 物料更新接口
 */
export const materialUpdateApi = (data: Partial<MaterialDto>) => {
  return request({
    url: `/materials/${data.id}`,
    method: 'put',
    data,
  });
};

/**
 * 物料删除接口
 */
export const materialDeleteApi = (materialId: number) => {
  return request({
    url: `/materials/${materialId}`,
    method: 'delete',
  });
};

/**
 * 分页查询物料接口
 */
export const materialPageApi = (
  params: MaterialPageParams,
): RequestPageDto<MaterialDto[]> => {
  return request({
    url: '/materials/page',
    method: 'get',
    params,
  });
};

/**
 * 物料list接口
 */
export const materialListApi = (): RequestDto<MaterialDto[]> => {
  return request({
    url: '/materials/list',
    method: 'get',
  });
};

/**
 * 物料名称唯一性校验接口
 */
export const materialNameExistsApi = (
  name: string,
  materialId?: number,
): RequestDto<MaterialNameExistsDto> => {
  return request({
    url: '/materials/exists',
    method: 'get',
    params: {
      name,
      materialId,
    },
  });
};
