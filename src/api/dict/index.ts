import request from '@/lib/request';
import type { RequestDto, RequestPageDto } from '../types';
import type {
  DictDto,
  DictItemDTO,
  DictNameExistsDto,
  DictPageParams,
} from './types';

/**
 * 字典新增接口
 */
export const dictAddApi = (data: Omit<DictDto, 'children' | 'id'>) => {
  return request({
    url: '/dicts',
    method: 'post',
    data,
  });
};

/**
 * 字典更新接口
 */
export const dictUpdateApi = (data: Omit<DictDto, 'children'>) => {
  return request({
    url: `/dicts/${data.id}`,
    method: 'put',
    data,
  });
};

/**
 * 字典删除接口
 */
export const dictDeleteApi = (dictId: number) => {
  return request({
    url: `/dicts/${dictId}`,
    method: 'delete',
  });
};

/**
 * 字典分页接口
 */
export const dictPageApi = (
  params: DictPageParams,
): RequestPageDto<DictDto[]> => {
  return request({
    url: '/dicts/page',
    method: 'get',
    params,
  });
};

/**
 * 字典list接口
 */
export const dictListApi = (): RequestDto<DictDto[]> => {
  return request({
    url: '/dicts/list',
    method: 'get',
  });
};

/**
 * 字典 ID 查询字典项接口
 */
export const dictListItemsApi = (dictId: number): RequestDto<DictDto[]> => {
  return request({
    url: `/dicts/${dictId}`,
    method: 'get',
  });
};

/**
 * 字典子项新增接口
 */
export const dictItemAddApi = (
  dictId: number,
  data: Omit<DictItemDTO, 'dictId' | 'id'>,
) => {
  return request({
    url: `/dicts/${dictId}/items`,
    method: 'post',
    data,
  });
};

/**
 * 字典子项更新接口
 */
export const dictItemUpdateApi = (
  itemId: number,
  data: Omit<DictItemDTO, 'dictId'>,
) => {
  return request({
    url: `/dicts/items/${itemId}`,
    method: 'put',
    data,
  });
};

/**
 * 字典子项删除接口
 */
export const dictItemDeleteApi = (itemId: number) => {
  return request({
    url: `/dicts/items/${itemId}`,
    method: 'delete',
  });
};

/**
 * 字典名称、编码唯一性校验接口
 */
export const dictNameExistsApi = (
  label: string,
  value: string,
  dictId?: number,
): RequestDto<DictNameExistsDto> => {
  return request({
    url: '/dicts/exists',
    method: 'get',
    params: {
      label,
      value,
      dictId,
    },
  });
};

/**
 * 字典子项名称、编码唯一性校验接口
 */
export const dictItemNameExistsApi = (
  dictId: number,
  label: string,
  value: string,
  itemId?: number,
): RequestDto<DictNameExistsDto> => {
  return request({
    url: `/dicts/items/exists`,
    method: 'get',
    params: {
      dictId,
      label,
      value,
      itemId,
    },
  });
};
