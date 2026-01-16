import type { STATUS } from '@/assets/enum';

export interface ProductPricingDto {
  id: number;
  productId: number;
  price: number;
  ruleApplicationType?: string | null;
  applyTimeStart?: string | null;
  status: STATUS;
  description?: string | null;
}

/**
 * 字典 page 请求参数
 */
export interface ProductPricingPageParams {
  page: number;
  pageSize: number;
  productId?: number;
}
