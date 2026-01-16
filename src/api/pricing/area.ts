import request from '@/lib/request';
import type { RequestDto, RequestPageDto } from '../types';
import type { AreaPricingDto, AreaPricingPageParams } from './area-types';

/**
 * 区域价格新增接口
 */
export const areaPricingAddApi = (data: Omit<AreaPricingDto, 'id'>) => {
  return request({
    url: '/area-pricing',
    method: 'post',
    data,
  });
};

/**
 * 区域价格更新接口
 */
export const areaPricingUpdateApi = (data: Partial<AreaPricingDto>) => {
  return request({
    url: `/area-pricing/${data.id}`,
    method: 'put',
    data,
  });
};

/**
 * 区域价格删除接口
 */
export const areaPricingDeleteApi = (areaPricingId: number) => {
  return request({
    url: `/area-pricing/${areaPricingId}`,
    method: 'delete',
  });
};

/**
 * 分页查询区域价格接口
 */
export const areaPricingPageApi = (
  params: AreaPricingPageParams,
): RequestPageDto<AreaPricingDto[]> => {
  return request({
    url: '/area-pricing/page',
    method: 'get',
    params,
  });
};

/**
 * 区域价格list接口
 */
export const areaPricingListApi = (): RequestDto<AreaPricingDto[]> => {
  return request({
    url: '/area-pricing/list',
    method: 'get',
  });
};
