import request from '@/lib/request';
import type { RequestDto, RequestPageDto } from '../types';
import type {
  ProductPricingDto,
  ProductPricingPageParams,
} from './product-types';

/**
 * 商品价格新增接口
 */
export const productPricingAddApi = (
  data: Omit<ProductPricingDto, 'id' | 'productName'>,
) => {
  return request({
    url: '/product-pricing',
    method: 'post',
    data,
  });
};

/**
 * 商品价格更新接口
 */
export const productPricingUpdateApi = (data: Partial<ProductPricingDto>) => {
  return request({
    url: `/product-pricing/${data.id}`,
    method: 'put',
    data,
  });
};

/**
 * 商品价格删除接口
 */
export const productPricingDeleteApi = (productPricingId: number) => {
  return request({
    url: `/product-pricing/${productPricingId}`,
    method: 'delete',
  });
};

/**
 * 分页查询商品价格接口
 */
export const productPricingPageApi = (
  params: ProductPricingPageParams,
): RequestPageDto<ProductPricingDto[]> => {
  return request({
    url: '/product-pricing/page',
    method: 'get',
    params,
  });
};

/**
 * 商品价格list接口
 */
export const productPricingListApi = (): RequestDto<ProductPricingDto[]> => {
  return request({
    url: '/product-pricing/list',
    method: 'get',
  });
};
