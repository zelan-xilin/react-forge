import request from '@/lib/request';
import type { RequestDto } from '../types';
import type {
  AreaPricingRuleAddOrUpdateParams,
  AreaPricingRuleDto,
  AreaResourceAddOrUpdateParams,
  AreaResourceDto,
  AreaResourceNameExistsDto,
} from './types';

/**
 * 区域收费规则列表接口
 */
export const areaPricingRuleListApi = (): RequestDto<AreaPricingRuleDto[]> => {
  return request({
    url: '/areas/rule/list',
    method: 'get',
  });
};

/**
 * 区域收费规则新增接口
 */
export const areaPricingRuleAddApi = (
  data: AreaPricingRuleAddOrUpdateParams,
): RequestDto<AreaPricingRuleDto> => {
  return request({
    url: '/areas/rule',
    method: 'post',
    data,
  });
};

/**
 * 区域收费规则编辑接口
 */
export const areaPricingRuleUpdateApi = (
  data: AreaPricingRuleAddOrUpdateParams,
): RequestDto<AreaPricingRuleDto> => {
  return request({
    url: `/areas/rule/${data.id}`,
    method: 'put',
    data,
  });
};

/**
 * 区域收费规则删除接口
 */
export const areaPricingRuleDeleteApi = (areaPricingRuleId: number) => {
  return request({
    url: `/areas/rule/${areaPricingRuleId}`,
    method: 'delete',
  });
};

/**
 * 区域资源列表接口
 */
export const areaResourceListApi = (): RequestDto<AreaResourceDto[]> => {
  return request({
    url: '/areas/resource/list',
    method: 'get',
  });
};

/**
 * 区域资源名称唯一性校验接口
 */
export const areaResourceNameExistsApi = (
  name: string,
  areaResourceId?: number,
): RequestDto<AreaResourceNameExistsDto> => {
  return request({
    url: '/areas/resource/exists',
    method: 'get',
    params: { name, areaResourceId },
  });
};

/**
 * 区域资源新增接口
 */
export const areaResourceAddApi = (
  data: AreaResourceAddOrUpdateParams,
): RequestDto<AreaResourceDto> => {
  return request({
    url: '/areas/resource',
    method: 'post',
    data,
  });
};

/**
 * 区域资源编辑接口
 */
export const areaResourceUpdateApi = (
  data: AreaResourceAddOrUpdateParams,
): RequestDto<AreaResourceDto> => {
  return request({
    url: `/areas/resource/${data.id}`,
    method: 'put',
    data,
  });
};

/**
 * 区域资源删除接口
 */
export const areaResourceDeleteApi = (areaResourceId: number) => {
  return request({
    url: `/areas/resource/${areaResourceId}`,
    method: 'delete',
  });
};
