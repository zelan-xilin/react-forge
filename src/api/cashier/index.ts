import request from '@/lib/request';
import type { RequestDto, RequestPageDto } from '../types';
import type {
  AddOrderPaymentDto,
  AddOrderProductDto,
  CreateOrderDto,
  DeleteOrderDto,
  DeleteOrderItemDto,
  OrderDto,
  OrderPageParams,
  SetOrderAreaDto,
  SetOrderReservedDto,
  UpdateOrderDto,
  UpdateOrderPaymentDto,
  UpdateOrderProductDto,
} from './types';

/**
 * 分页查询订单
 */
export const orderPageApi = (
  params: OrderPageParams,
): RequestPageDto<OrderDto[]> => {
  return request({
    url: '/orders/page',
    method: 'get',
    params: {
      ...params,
      orderStatus: params.orderStatus?.length
        ? params.orderStatus.join(',')
        : undefined,
    },
  });
};

/**
 * 创建订单
 */
export const createOrderApi = (data: CreateOrderDto): RequestDto<OrderDto> => {
  return request({
    url: '/orders',
    method: 'post',
    data,
  });
};

/**
 * 更新订单
 */
export const updateOrderApi = (data: UpdateOrderDto) => {
  return request({
    url: '/orders',
    method: 'put',
    data,
  });
};

/**
 * 删除订单（逻辑删除）
 */
export const deleteOrderApi = (data: DeleteOrderDto) => {
  return request({
    url: '/orders',
    method: 'delete',
    data,
  });
};

/**
 * 删除订单子项（区域 / 商品 / 支付 / 预定）
 */
export const deleteOrderItemApi = (data: DeleteOrderItemDto) => {
  return request({
    url: '/orders/item',
    method: 'delete',
    data,
  });
};

/**
 * 设置订单区域（覆盖式）
 */
export const setOrderAreaApi = (data: SetOrderAreaDto) => {
  return request({
    url: '/orders/area',
    method: 'post',
    data,
  });
};

/**
 * 设置订单预定信息（覆盖式）
 */
export const setOrderReservedApi = (data: SetOrderReservedDto) => {
  return request({
    url: '/orders/reserved',
    method: 'post',
    data,
  });
};

/**
 * 订单商品
 */
export const addOrderProductApi = (data: AddOrderProductDto) => {
  return request({
    url: '/orders/product',
    method: 'post',
    data,
  });
};
export const updateOrderProductApi = (data: UpdateOrderProductDto) => {
  return request({
    url: '/orders/product',
    method: 'put',
    data,
  });
};

/**
 * 订单支付记录
 */
export const addOrderPaymentApi = (data: AddOrderPaymentDto) => {
  return request({
    url: '/orders/payment',
    method: 'post',
    data,
  });
};
export const updateOrderPaymentApi = (data: UpdateOrderPaymentDto) => {
  return request({
    url: '/orders/payment',
    method: 'put',
    data,
  });
};
