import type { OVERTIME_ROUNDING, STATUS } from '@/assets/enum';

export interface AreaPricingDto {
  id: number;
  areaType: string;
  roomSize?: string | null;
  applyTimeStart: string;
  applyTimeEnd: string;
  usageDurationHours: number;
  basePrice: number;
  overtimeHourPrice: number;
  overtimeRoundType: OVERTIME_ROUNDING;
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
