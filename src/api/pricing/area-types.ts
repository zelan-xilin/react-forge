import type { STATUS } from '@/assets/enum';

export interface AreaPricingDto {
  id: number;
  areaType: string;
  roomSize?: string | null;
  ruleApplicationType: string;
  applyTimeStart: string;
  usageDurationHours: number;
  basePrice: number;
  overtimeHourPrice: number;
  overtimeRoundType: string;
  overtimeGraceMinutes: number;
  giftTeaAmount: number;
  status: STATUS;
  description?: string | null;
}

/**
 * 字典 page 请求参数
 */
export interface AreaPricingPageParams {
  page: number;
  pageSize: number;
  areaType?: string;
}
