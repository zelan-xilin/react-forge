import type { IS_DELETE, ORDER_STATUS } from '@/assets/enum';

/**
 * 分页接口查询参数
 */
export interface OrderPageParams {
  /** 订单信息 */
  orderNo?: string;
  orderStatus?: ORDER_STATUS[];

  /** 订单区域 */
  areaName?: string;
  areaType?: string;
  roomSize?: string;

  /** 是否为散客(即没有固定座位) */
  unboundArea?: boolean;

  /** 订单开启时间 */
  openedAtFrom?: string;
  openedAtTo?: string;

  /** 预定人信息 */
  reservedUsername?: string;
  reservedContact?: string;
  reservedArriveAtFrom?: string;
  reservedArriveAtTo?: string;

  /** 分页 */
  page: number;
  pageSize: number;
}

/**
 * 订单预定信息 DTO
 */
export interface OrderReservedDto {
  id: number;
  orderNo: string;

  /** 预定人姓名 */
  username?: string | null;
  /** 预定人联系方式 */
  contact?: string | null;
  /** 预定到店时间 */
  arriveAt?: string | null;
}

/**
 * 订单区域信息 DTO
 */
export interface OrderAreaDto {
  id: number;
  orderNo: string;

  /** 订单绑定的区域信息 */
  areaId: number;
  areaName: string;
  areaType: string;
  roomSize?: string | null;
}

/**
 * 订单商品信息 DTO
 */
export interface OrderProductDto {
  id: number;
  orderNo: string;

  /** 商品信息 */
  productId: number;
  productName: string;

  /** 商品销售数量 */
  quantity: number;

  /** 商品单价 */
  unitPrice: number;

  /** 商品理论应收总价 */
  totalPrice: number;
}

/**
 * 订单支付信息 DTO
 */
export interface OrderPaymentDto {
  id: number;
  /** ORD + 时间(YYYYMMDD) + 序列 */
  orderNo: string;

  /** 支付方式记录 */
  paymentMethod: string;
  paymentMethodName: string;
  paidAt?: string;

  /** 支付金额 */
  paymentAmount: number;
}

/**
 * 订单信息 DTO
 */
export interface OrderDto {
  id: number;
  orderNo: string;

  /** 订单流转状态，开单和关闭时间记录 */
  orderStatus: ORDER_STATUS;
  openedAt?: string | null;
  closedAt?: string | null;

  /** 预定人信息 */
  reserved?: OrderReservedDto | null;

  /** 当前订单绑定的区域信息或者散客(即没有固定座位) */
  area?: OrderAreaDto | null;

  /** 订单商品信息(可多商品) */
  products?: OrderProductDto[] | null;

  /** 理论付款 */
  expectedAmount?: number | null;
  /** 实际付款 */
  actualAmount?: number | null;
  /** 实际付款与理论付款差异原因 */
  paymentDifferenceReason?: string | null;
  /** 付款支付方式(支持组合付款) */
  payments?: OrderPaymentDto[] | null;

  /** 备注信息 */
  remark?: string | null;

  /** 删除状态以及删除原因 */
  isDeleted: IS_DELETE;
  deleteReason?: string | null;
  deletedBy?: number | null;
  deletedByName?: string | null;
  deletedAt?: string | null;

  /** 常规信息记录 */
  createdBy: number;
  createdByName: string;
  createdAt: string;
  updatedBy?: number | null;
  updatedByName?: string | null;
  updatedAt?: string | null;
}

/**
 * 创建、更新订单 DTO
 */
export interface CreateOrderDto {
  orderStatus: ORDER_STATUS;
  openedAt?: string | null;
  remark?: string | null;
  createdBy: number;
  createdByName: string;
}
export interface UpdateOrderDto {
  orderNo: string;
  orderStatus?: ORDER_STATUS;
  openedAt?: string | null;
  closedAt?: string | null;
  expectedAmount?: number | null;
  actualAmount?: number | null;
  paymentDifferenceReason?: string | null;
  remark?: string | null;
  updatedBy: number;
  updatedByName: string;
}

/**
 * 删除订单
 */
export interface DeleteOrderDto {
  orderNo: string;
  deleteReason: string;
  deletedBy: number;
  deletedByName: string;
}
export interface DeleteOrderItemDto {
  type: 'area' | 'product' | 'payment' | 'reserved';
  ids: number[];
}

/**
 * 设置订单区域 DTO
 */
export interface SetOrderAreaDto {
  orderNo: string;
  areaId: number;
  areaName: string;
  areaType: string;
  roomSize?: string | null;
  price?: number;
}

/**
 * 设置订单预定信息 DTO
 */
export interface SetOrderReservedDto {
  orderNo: string;
  username?: string | null;
  contact?: string | null;
  arriveAt?: string | null;
}

/**
 * 添加订单商品 DTO
 */
export interface AddOrderProductDto {
  orderNo: string;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}
export interface UpdateOrderProductDto {
  id: number;
  orderNo: string;
  productName: string;
  quantity?: number;
  unitPrice?: number;
}

/**
 * 添加订单支付记录 DTO
 */
export interface AddOrderPaymentDto {
  orderNo: string;
  paymentMethod: string;
  paymentMethodName: string;
  paymentAmount: number;
}
export interface UpdateOrderPaymentDto {
  id: number;
  paymentMethod?: string;
  paymentMethodName?: string;
  paymentAmount?: number;
}
